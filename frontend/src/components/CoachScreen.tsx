"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  FileText,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Timer,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { CoachPortrait } from "@/components/CoachPortrait";
import { readDemoServiceKeys } from "@/lib/demoServiceKeys";
import {
  readDemoProfile,
  readDemoConversation,
  readStarterReply,
  requestCoachReply,
  reviewedCoachSources,
  saveDemoRoom,
  saveDemoConversation,
} from "@/lib/demoJourney";
import type {
  CoachReply,
  CoachSource,
  DemoProfile,
  DemoConversationMessage,
} from "@/types/journey";

interface SpeechResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}
interface BrowserSpeechRecognition {
  lang: string;
  interimResults: boolean;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
type SpeechConstructor = new () => BrowserSpeechRecognition;

const primaryPrompts = [
  { text: "Make me a plan for today", icon: CalendarDays },
  { text: "Help me understand my next topic", icon: BookOpen },
  { text: "What can I practise from my notes?", icon: FileText },
] as const;

const additionalPrompts = [
  { text: "Help me revise for a test", icon: CalendarDays },
  { text: "Make my plan lighter", icon: Timer },
  { text: "Quiz me on my notes", icon: FileText },
] as const;

export function CoachScreen() {
  const router = useRouter();
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const cancelVoiceRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const voiceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const threadRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLInputElement | null>(null);
  const [profile, setProfile] = useState<DemoProfile | null>(null);
  const [sources, setSources] = useState<CoachSource[]>([]);
  const [starter, setStarter] = useState<CoachReply | null>(null);
  const [messages, setMessages] = useState<DemoConversationMessage[]>([]);
  const [conversationReady, setConversationReady] = useState(false);
  const [reply, setReply] = useState<CoachReply | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [promptsExpanded, setPromptsExpanded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) return;
      const saved = readDemoProfile();
      if (!saved) {
        router.replace("/start");
        return;
      }
      setProfile(saved);
      setStarter(readStarterReply());
      const previous = readDemoConversation();
      setMessages(previous);
      const previousReply = previous.findLast(
        (message) => message.reply,
      )?.reply;
      setReply(previousReply ?? null);
      setSelectedIds(previousReply?.tasks.map((task) => task.id) ?? []);
      setConversationReady(true);
    });
    reviewedCoachSources()
      .then((available) => {
        if (active) setSources(available);
      })
      .catch(() => {
        if (active) setNotice("Library material could not be read.");
      });
    return () => {
      active = false;
      recognitionRef.current?.stop();
      if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current);
      cancelVoiceRef.current = true;
      recorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [router]);

  useEffect(() => {
    if (conversationReady) saveDemoConversation(messages);
  }, [conversationReady, messages]);

  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [messages, busy]);

  async function ask(question: string): Promise<void> {
    const clean = question.trim();
    if (!clean || !profile || busy) return;
    setDraft("");
    setNotice(null);
    setBusy(true);
    setSelectedIds([]);
    setReply(null);
    const history = messages.slice(-6).map((message) => ({
      role: message.role,
      text: message.text.slice(0, 1200),
    }));
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "student", text: clean },
    ]);
    try {
      const result = await requestCoachReply(profile, clean, sources, history);
      setReply(result);
      setSelectedIds(result.tasks.map((task) => task.id));
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "coach",
          text: result.answer,
          reply: result,
        },
      ]);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Coach is unavailable right now.",
      );
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void ask(draft);
  }

  function toggleTask(id: string): void {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function createRoom(): void {
    if (!profile || !reply) return;
    const tasks = reply.tasks.filter((task) => selectedIds.includes(task.id));
    if (!tasks.length) return;
    const now = Date.now();
    saveDemoRoom({
      profile,
      tasks,
      createdAt: now,
      remainingSeconds: tasks.reduce(
        (total, task) => total + task.minutes * 60,
        0,
      ),
      runningSince: now,
      doneIds: [],
      ended: false,
    });
    router.push("/study");
  }

  async function startDeepgramVoice(key: string): Promise<void> {
    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setNotice(
        "Voice recording is unavailable in this browser. You can type your question.",
      );
      return;
    }
    try {
      cancelVoiceRef.current = false;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = ["audio/webm", "audio/ogg", "audio/mp4"].find((value) =>
        MediaRecorder.isTypeSupported(value),
      );
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setListening(false);
        if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current);
        const blob = new Blob(chunks, {
          type: recorder.mimeType || "audio/webm",
        });
        if (cancelVoiceRef.current || blob.size < 100) return;
        const form = new FormData();
        form.append("audio", blob, "question.webm");
        form.append("deepgramApiKey", key);
        void fetch("/api/voice/transcribe", { method: "POST", body: form })
          .then(async (response) => {
            const payload: unknown = await response.json();
            if (
              !response.ok ||
              typeof payload !== "object" ||
              payload === null ||
              !("transcript" in payload) ||
              typeof payload.transcript !== "string"
            )
              throw new Error(
                "Voice transcription failed. Check your key and try again.",
              );
            const transcript = payload.transcript;
            setDraft((current) =>
              current ? current + " " + transcript : transcript,
            );
            composerRef.current?.focus();
          })
          .catch(() =>
            setNotice(
              "Voice transcription failed. Check your key and try again.",
            ),
          );
      };
      recorderRef.current = recorder;
      recorder.start();
      setListening(true);
      setNotice(null);
      voiceTimerRef.current = setTimeout(() => recorder.stop(), 30000);
    } catch {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setNotice("The microphone could not start. You can type your question.");
    }
  }

  function toggleVoice(): void {
    if (listening) {
      if (recorderRef.current?.state === "recording")
        recorderRef.current.stop();
      else recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const deepgramKey = readDemoServiceKeys().deepgram;
    if (deepgramKey) {
      void startDeepgramVoice(deepgramKey);
      return;
    }
    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechConstructor;
      webkitSpeechRecognition?: SpeechConstructor;
    };
    const Constructor =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Constructor) {
      setNotice(
        "Voice input is not available in this browser. You can type your question.",
      );
      return;
    }
    const recognition = new Constructor();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setDraft((current) =>
          current ? current + " " + transcript : transcript,
        );
      }
    };
    recognition.onerror = () => {
      setNotice(
        "The microphone could not capture your question. You can type it instead.",
      );
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      setNotice("The microphone could not start. You can type your question.");
    }
  }

  if (!profile) {
    return <main className="journey-loading">Opening Coach...</main>;
  }

  const uniqueSources = new Set(sources.map((source) => source.id)).size;
  const latestReplyMessageId = messages.findLast(
    (message) => message.reply,
  )?.id;
  const selectedMinutes =
    reply?.tasks
      .filter((task) => selectedIds.includes(task.id))
      .reduce((total, task) => total + task.minutes, 0) ?? 0;
  const previewMinutes =
    starter?.tasks.reduce((total, task) => total + task.minutes, 0) ?? 0;

  return (
    <AppShell
      active="Coach"
      studentName={profile.name}
      grade={profile.grade}
      board={profile.board}
    >
      <main className="journey-coach">
        <header className="journey-heading">
          <div>
            <span className="journey-eyebrow">
              <Sparkles aria-hidden="true" /> Your Coach
            </span>
            <h1>What should we work on, {profile.name}?</h1>
            <p>
              Ask in your own words. I&apos;ll use your setup and any reviewed
              material in your Library.
            </p>
          </div>
          <Link href="/start" className="journey-edit-link">
            Edit setup <ArrowRight aria-hidden="true" />
          </Link>
        </header>

        {notice ? (
          <div className="notice journey-notice" role="status">
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Dismiss message"
            >
              <X aria-hidden="true" />
            </button>
          </div>
        ) : null}

        <div className="journey-coach-grid">
          <section className="journey-chat" aria-label="Coach conversation">
            <div
              className="journey-chat-thread"
              ref={threadRef}
              aria-live="polite"
            >
              <div className="journey-message journey-message-coach">
                <CoachPortrait />
                <div>
                  <strong>Ranjan Sir</strong>
                  <p>
                    Hi {profile.name}.{" "}
                    {starter
                      ? "Your starting plan is ready."
                      : "Let's build your first plan."}{" "}
                    What are you trying to understand or finish today?
                  </p>
                  <small>
                    {uniqueSources
                      ? "I can quote reviewed Library pages when they match your question."
                      : "Add and review a source in Library for source-linked answers and quizzes."}
                  </small>
                </div>
              </div>
              {messages.map((message) => (
                <div
                  className={
                    "journey-message " +
                    (message.role === "student"
                      ? "journey-message-student"
                      : "journey-message-coach")
                  }
                  key={message.id}
                >
                  {message.role === "coach" ? (
                    <CoachPortrait />
                  ) : (
                    <span className="journey-message-avatar">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <strong>
                      {message.role === "coach" ? "Ranjan Sir" : profile.name}
                    </strong>
                    <p>{message.text}</p>
                    {message.reply ? (
                      <>
                        <small>
                          {message.reply.status === "source-excerpt"
                            ? "Source excerpt · check the original page"
                            : "Planning guidance · no academic answer checked"}
                        </small>
                        {message.id === latestReplyMessageId && reply ? (
                          <div className="coach-reply-plan">
                            <div className="coach-reply-plan-head">
                              <span className="coach-reply-plan-icon">
                                <Sparkles aria-hidden="true" />
                              </span>
                              <div>
                                <strong>Your study plan</strong>
                                <small>
                                  Choose the parts you want to study. You can
                                  change them before you start.
                                </small>
                              </div>
                            </div>
                            <div className="coach-reply-tasks">
                              {message.reply.tasks.map((task, index) => (
                                <label
                                  className="journey-task-choice coach-reply-task"
                                  key={task.id}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedIds.includes(task.id)}
                                    onChange={() => toggleTask(task.id)}
                                  />
                                  <span className="journey-task-check">
                                    <Check aria-hidden="true" />
                                  </span>
                                  <span className="coach-reply-task-body">
                                    <span className="coach-reply-task-top">
                                      <strong>
                                        {index + 1}. {task.title}
                                      </strong>
                                      <span className="coach-reply-task-time">
                                        {task.minutes} min
                                      </span>
                                    </span>
                                    <small>{task.reason}</small>
                                  </span>
                                </label>
                              ))}
                            </div>
                            <button
                              className="journey-create-room coach-reply-create"
                              type="button"
                              disabled={!selectedIds.length}
                              onClick={createRoom}
                            >
                              Create study plan
                              <span>
                                {selectedMinutes
                                  ? selectedMinutes + " min"
                                  : "Choose a task"}
                              </span>
                              <ArrowRight aria-hidden="true" />
                            </button>
                            <small className="coach-reply-handoff">
                              Opens your study room with a timer and these
                              tasks.
                            </small>
                          </div>
                        ) : null}
                        {message.reply.citations.length ? (
                          <div className="journey-citations">
                            {message.reply.citations.map((citation) => (
                              <Link
                                key={citation.sourceId + "-" + citation.page}
                                href="/library"
                              >
                                <BookOpen aria-hidden="true" />
                                {citation.sourceName} · page/section{" "}
                                {citation.page}
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
              {busy ? (
                <div
                  className="journey-message journey-message-coach"
                  role="status"
                >
                  <CoachPortrait />
                  <div>
                    <strong>Ranjan Sir</strong>
                    <p>Checking your question against available context...</p>
                  </div>
                </div>
              ) : null}
            </div>
            {messages.length === 0 ? (
              <div
                className={
                  "journey-prompts" + (promptsExpanded ? " is-expanded" : "")
                }
                aria-label="Suggested questions"
              >
                <div className="journey-prompt-row">
                  <div className="journey-prompt-scroll">
                    {primaryPrompts.map(({ text, icon: Icon }) => (
                      <button
                        className="journey-prompt"
                        key={text}
                        type="button"
                        onClick={() => void ask(text)}
                        disabled={busy}
                      >
                        <Icon aria-hidden="true" />
                        <span>{text}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    className="journey-prompt-toggle"
                    type="button"
                    aria-label={
                      promptsExpanded
                        ? "Hide more suggested questions"
                        : "Show more suggested questions"
                    }
                    aria-expanded={promptsExpanded}
                    aria-controls="coach-more-prompts"
                    onClick={() => setPromptsExpanded((current) => !current)}
                  >
                    <ChevronDown aria-hidden="true" />
                  </button>
                </div>
                <div
                  className="journey-prompt-more"
                  id="coach-more-prompts"
                  hidden={!promptsExpanded}
                >
                  {additionalPrompts.map(({ text, icon: Icon }) => (
                    <button
                      className="journey-prompt"
                      key={text}
                      type="button"
                      onClick={() => void ask(text)}
                      disabled={busy}
                    >
                      <Icon aria-hidden="true" />
                      <span>{text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <form className="journey-composer" onSubmit={submit}>
              <label className="sr-only" htmlFor="coach-demo-question">
                Ask Ranjan Sir
              </label>
              <input
                id="coach-demo-question"
                ref={composerRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask about a topic, homework, or today's plan..."
                maxLength={1000}
              />
              <button
                className={
                  listening ? "journey-voice is-listening" : "journey-voice"
                }
                type="button"
                onClick={toggleVoice}
                aria-label={listening ? "Stop voice input" : "Use voice input"}
                aria-pressed={listening}
              >
                {listening ? (
                  <MicOff aria-hidden="true" />
                ) : (
                  <Mic aria-hidden="true" />
                )}
              </button>
              <button
                type="submit"
                className="journey-send"
                disabled={!draft.trim() || busy}
                aria-label="Send question"
              >
                <Send aria-hidden="true" />
              </button>
            </form>
          </section>

          <aside className="journey-plan" aria-label="Suggested study plan">
            <div className="journey-plan-head">
              <span className="journey-plan-icon">
                <Timer aria-hidden="true" />
              </span>
              <div className="journey-plan-heading">
                <span>{reply ? "PLAN READY" : "YOUR NEXT STEP"}</span>
                <h2>{reply ? "Your session" : "A focused start"}</h2>
              </div>
              {reply || starter ? (
                <span className="journey-plan-duration">
                  {reply ? selectedMinutes : previewMinutes} min
                </span>
              ) : null}
            </div>
            {reply ? (
              <div className="journey-plan-summary">
                <p>
                  Choose the tasks you want in Coach&apos;s reply. Your study
                  room will use those selections.
                </p>
                <div className="journey-plan-selection">
                  <strong>{selectedIds.length}</strong>
                  <span>of {reply.tasks.length} tasks selected</span>
                </div>
                <div className="journey-plan-source-status">
                  <BookOpen aria-hidden="true" />
                  <span>
                    {reply.citations.length
                      ? "Reviewed Library source linked"
                      : "No reviewed source linked for this question"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="journey-plan-preview">
                <p>
                  Tell Coach what you need today. This outline will adapt to
                  your question.
                </p>
                {starter ? (
                  <div className="journey-plan-outline">
                    <span className="journey-plan-section-label">
                      STARTING OUTLINE
                    </span>
                    <ol className="journey-starting-steps">
                      {starter.tasks.map((task, index) => (
                        <li key={task.id}>
                          <span
                            className="journey-step-number"
                            aria-hidden="true"
                          >
                            {index + 1}
                          </span>
                          <strong>{task.title}</strong>
                          <small>{task.minutes} min</small>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
                <button
                  type="button"
                  className="journey-refine-action"
                  onClick={() => composerRef.current?.focus()}
                >
                  Ask Coach about a topic <ArrowRight aria-hidden="true" />
                </button>
              </div>
            )}
          </aside>
        </div>
      </main>
    </AppShell>
  );
}
