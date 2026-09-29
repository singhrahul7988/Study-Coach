"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Lightbulb,
  Pause,
  Play,
  Send,
  Sparkles,
  Square,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { CoachPortrait } from "@/components/CoachPortrait";
import { listDocuments } from "@/lib/documentStore";
import {
  readDemoRoom,
  remainingRoomSeconds,
  requestCoachReply,
  reviewedCoachSources,
  saveDemoRoom,
} from "@/lib/demoJourney";
import type { CoachReply, CoachSource, DemoRoom } from "@/types/journey";
import type { PracticeQuestion } from "@/types/document";

interface RoomMessage {
  id: string;
  role: "student" | "coach";
  text: string;
  reply?: CoachReply;
  detail?: string;
}
interface RoomQuiz {
  question: PracticeQuestion;
  documentName: string;
  documentId: string;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds % 60).padStart(2, "0")
  );
}

export function StudyRoomScreen() {
  const [room, setRoom] = useState<DemoRoom | null>(null);
  const [sources, setSources] = useState<CoachSource[]>([]);
  const [questions, setQuestions] = useState<RoomQuiz[]>([]);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<RoomQuiz | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [testRemaining, setTestRemaining] = useState(0);
  const [inTest, setInTest] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (active) setRoom(readDemoRoom());
    });
    reviewedCoachSources()
      .then((available) => {
        if (active) setSources(available);
      })
      .catch(() => {
        if (active) setNotice("Library sources could not be read.");
      });
    listDocuments()
      .then(
        (documents) =>
          active &&
          setQuestions(
            documents
              .filter((document) => document.reviewed && document.analysis)
              .flatMap((document) =>
                (document.analysis?.questions ?? [])
                  .filter((question) => !question.reviewRequired)
                  .map((question) => ({
                    question,
                    documentName: document.name,
                    documentId: document.id,
                  })),
              ),
          ),
      )
      .catch(() => {
        if (active) setNotice("Practice questions could not be read.");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!room || room.runningSince === null || room.ended) return;
    const interval = window.setInterval(() => {
      setTick((current) => current + 1);
      if (remainingRoomSeconds(room) === 0) {
        const finished = {
          ...room,
          remainingSeconds: 0,
          runningSince: null,
          ended: true,
        };
        saveDemoRoom(finished);
        setRoom(finished);
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [room]);

  function changeRoom(change: (current: DemoRoom) => DemoRoom): void {
    setRoom((current) => {
      if (!current) return current;
      const updated = change(current);
      saveDemoRoom(updated);
      return updated;
    });
  }

  function toggleTimer(): void {
    changeRoom((current) =>
      current.runningSince === null
        ? { ...current, runningSince: Date.now() }
        : {
            ...current,
            remainingSeconds: remainingRoomSeconds(current),
            runningSince: null,
          },
    );
  }

  function endRoom(): void {
    changeRoom((current) => ({
      ...current,
      remainingSeconds: remainingRoomSeconds(current),
      runningSince: null,
      ended: true,
    }));
  }

  function toggleDone(id: string): void {
    changeRoom((current) => ({
      ...current,
      doneIds: current.doneIds.includes(id)
        ? current.doneIds.filter((item) => item !== id)
        : [...current.doneIds, id],
    }));
  }

  function addMessage(message: Omit<RoomMessage, "id">): void {
    setMessages((current) => [
      ...current,
      { ...message, id: crypto.randomUUID() },
    ]);
  }

  function showPracticeQuestion(
    index: number,
    testNumber: number | null,
  ): void {
    const next = questions[index % questions.length];
    setQuizIndex(index + 1);
    setActiveQuiz(next);
    setHintVisible(false);
    addMessage({
      role: "coach",
      text:
        testNumber === null
          ? next.question.prompt
          : `Question ${testNumber} of ${Math.min(3, questions.length)}: ${next.question.prompt}`,
      detail:
        "From " + next.documentName + " · page/section " + next.question.page,
    });
  }

  function startQuiz(): void {
    if (!questions.length) {
      addMessage({
        role: "coach",
        text: "There are no reviewed, source-linked questions yet. Add and review a document in Library to unlock a quiz.",
      });
      return;
    }
    setInTest(false);
    setTestRemaining(0);
    showPracticeQuestion(quizIndex, null);
  }

  function startTest(): void {
    if (questions.length < 2) {
      addMessage({
        role: "coach",
        text: "A short test needs at least two reviewed questions. Add and review practice questions in Library first.",
      });
      return;
    }
    setInTest(true);
    setTestRemaining(Math.min(3, questions.length) - 1);
    showPracticeQuestion(quizIndex, 1);
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const question = draft.trim();
    if (!question || !room || busy || room.ended) return;
    setDraft("");
    addMessage({ role: "student", text: question });
    if (activeQuiz) {
      addMessage({
        role: "coach",
        text:
          "Compare your answer with this draft: " + activeQuiz.question.answer,
        detail:
          "Source: " +
          activeQuiz.documentName +
          " · page/section " +
          activeQuiz.question.page +
          (activeQuiz.question.evidence
            ? ' · Supporting quote: "' + activeQuiz.question.evidence + '"'
            : "") +
          " · Self-check only; your answer has not been graded.",
      });
      setHintVisible(false);
      if (inTest && testRemaining > 0) {
        const nextNumber = Math.min(3, questions.length) - testRemaining + 1;
        setTestRemaining(testRemaining - 1);
        showPracticeQuestion(quizIndex, nextNumber);
      } else {
        setActiveQuiz(null);
        if (inTest) {
          setInTest(false);
          addMessage({
            role: "coach",
            text: "Short test complete. Compare your answers with the source drafts above. No score has been assigned.",
          });
        }
      }
      return;
    }
    setBusy(true);
    try {
      const history = messages.slice(-6).map((message) => ({
        role: message.role,
        text: message.text.slice(0, 1200),
      }));
      const reply = await requestCoachReply(
        room.profile,
        question,
        sources,
        history,
      );
      addMessage({ role: "coach", text: reply.answer, reply });
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "The Coach could not reply right now.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (!room) {
    return (
      <AppShell active="Study">
        <main className="room-empty">
          <span>
            <Sparkles aria-hidden="true" /> STUDY ROOM
          </span>
          <h1>Start with a plan you choose.</h1>
          <p>
            Ask Coach a question, tick the suggested tasks, and create your
            study room.
          </p>
          <Link href="/coach">
            Open Coach <ArrowRight aria-hidden="true" />
          </Link>
        </main>
      </AppShell>
    );
  }

  const remaining = remainingRoomSeconds(room);
  const doneCount = room.tasks.filter((task) =>
    room.doneIds.includes(task.id),
  ).length;
  const firstTask = room.tasks[0];

  return (
    <AppShell
      active="Study"
      studentName={room.profile.name}
      grade={room.profile.grade}
      board={room.profile.board}
    >
      <main className="room-page">
        <header className="room-header">
          <div>
            <span className="journey-eyebrow">
              <Sparkles aria-hidden="true" /> YOUR STUDY ROOM
            </span>
            <h1>Let&apos;s focus, {room.profile.name}.</h1>
            <p>
              {room.tasks.length} chosen{" "}
              {room.tasks.length === 1 ? "task" : "tasks"} · {doneCount} marked
              done
            </p>
          </div>
          <div className="room-timer" role="timer" aria-label="Time remaining">
            <Clock3 aria-hidden="true" />
            <strong>{formatTime(remaining)}</strong>
            <span>left</span>
            <button
              type="button"
              onClick={toggleTimer}
              disabled={room.ended || remaining === 0}
              aria-label={
                room.runningSince === null ? "Resume timer" : "Pause timer"
              }
            >
              {room.runningSince === null ? (
                <Play aria-hidden="true" />
              ) : (
                <Pause aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={endRoom}
              disabled={room.ended}
              aria-label="End session"
            >
              <Square aria-hidden="true" />
            </button>
          </div>
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
        <div className="room-grid">
          <section className="room-chat" aria-label="Study room conversation">
            <div className="room-chat-head">
              <span className="room-chat-status" />
              <div>
                <strong>Ranjan Sir</strong>
                <small>Here with you for this session</small>
              </div>
              <span className="room-chat-mode">Focused study</span>
            </div>
            <div className="room-chat-thread" aria-live="polite">
              <div className="journey-message journey-message-coach">
                <CoachPortrait />
                <div>
                  <strong>Ranjan Sir</strong>
                  <p>
                    Let&apos;s begin with {firstTask.title.toLowerCase()}. Ask
                    me to explain a point, or start a quiz or short test from a
                    reviewed Library source.
                  </p>
                  <small>
                    Use the timer to pace yourself. Answers are self-checks.
                  </small>
                </div>
              </div>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    "journey-message " +
                    (message.role === "student"
                      ? "journey-message-student"
                      : "journey-message-coach")
                  }
                >
                  {message.role === "coach" ? (
                    <CoachPortrait />
                  ) : (
                    <span className="journey-message-avatar">
                      {room.profile.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <strong>
                      {message.role === "coach"
                        ? "Ranjan Sir"
                        : room.profile.name}
                    </strong>
                    <p>{message.text}</p>
                    {message.detail ? <small>{message.detail}</small> : null}
                    {message.reply?.citations.map((citation) => (
                      <Link
                        className="room-citation"
                        key={citation.sourceId + "-" + citation.page}
                        href="/library"
                      >
                        <BookOpen aria-hidden="true" />
                        {citation.sourceName} · page/section {citation.page}
                      </Link>
                    ))}
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
                    <p>Looking through your available context...</p>
                  </div>
                </div>
              ) : null}
            </div>
            {room.ended ? (
              <div className="room-ended">
                <strong>Session ended.</strong>
                <span>Tasks are marked done only when you choose them.</span>
                <Link href="/coach">
                  Plan another room <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <>
                <div className="room-quick-actions">
                  <button
                    type="button"
                    onClick={startQuiz}
                    disabled={busy || Boolean(activeQuiz)}
                  >
                    <Sparkles aria-hidden="true" /> Quick quiz
                  </button>
                  <button
                    type="button"
                    onClick={startTest}
                    disabled={busy || Boolean(activeQuiz)}
                  >
                    <Check aria-hidden="true" /> Short test
                  </button>
                  {activeQuiz ? (
                    <button
                      type="button"
                      onClick={() => setHintVisible(!hintVisible)}
                    >
                      <Lightbulb aria-hidden="true" />{" "}
                      {hintVisible ? "Hide hint" : "Show hint"}
                    </button>
                  ) : null}
                  <Link href="/library">
                    <BookOpen aria-hidden="true" /> Open Library
                  </Link>
                </div>
                {hintVisible && activeQuiz ? (
                  <p className="room-hint" role="status">
                    {activeQuiz.question.hint ||
                      "Look back at the source before answering."}
                  </p>
                ) : null}
                <form
                  className="journey-composer room-composer"
                  onSubmit={(event) => void submit(event)}
                >
                  <label className="sr-only" htmlFor="room-question">
                    {activeQuiz
                      ? "Answer practice question"
                      : "Ask in your study room"}
                  </label>
                  <input
                    id="room-question"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={
                      activeQuiz
                        ? "Write your answer for a self-check..."
                        : "Ask a question or request an explanation..."
                    }
                    maxLength={1000}
                  />
                  <button
                    type="submit"
                    className="journey-send"
                    disabled={!draft.trim() || busy}
                    aria-label="Send message"
                  >
                    <Send aria-hidden="true" />
                  </button>
                </form>
              </>
            )}
          </section>
          <aside className="room-side">
            <section className="room-plan-card">
              <span className="room-side-kicker">YOUR PLAN</span>
              <h2>One step at a time</h2>
              <p>
                Mark a task done when you finish it. The timer never marks work
                complete.
              </p>
              <div className="room-task-list">
                {room.tasks.map((task, index) => (
                  <label key={task.id} className="room-task">
                    <input
                      type="checkbox"
                      checked={room.doneIds.includes(task.id)}
                      onChange={() => toggleDone(task.id)}
                    />
                    <span className="room-task-index">
                      {room.doneIds.includes(task.id) ? (
                        <Check aria-hidden="true" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span>
                      <strong>{task.title}</strong>
                      <small>
                        {task.minutes} min · {task.reason}
                      </small>
                    </span>
                  </label>
                ))}
              </div>
            </section>
            <section className="room-source-card">
              <BookOpen aria-hidden="true" />
              <div>
                <strong>Source check</strong>
                <p>
                  {sources.length
                    ? "Reviewed Library text can be quoted for matching questions."
                    : "Add and review material in Library for source-linked questions and quizzes."}
                </p>
                <Link href="/library">
                  Open Library <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </AppShell>
  );
}
