"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock3,
  FileText,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Pause,
  Play,
  Square,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PdfPage } from "@/components/PdfPage";
import { getDocument, listDocuments } from "@/lib/documentStore";
import type { StoredDocument } from "@/types/document";

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds % 60).padStart(2, "0")
  );
}

interface StudyScreenProps {
  initialSeconds: number;
  documentId?: string;
}

export function StudyScreen({ initialSeconds, documentId }: StudyScreenProps) {
  const [document, setDocument] = useState<StoredDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const [ended, setEnded] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [sourcePage, setSourcePage] = useState(1);
  const [answer, setAnswer] = useState("");
  const [hintVisible, setHintVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [viewerExpanded, setViewerExpanded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let currentUrl: string | null = null;
    const readDocument = documentId
      ? getDocument(documentId)
      : listDocuments().then((documents) => documents[0] ?? null);
    readDocument
      .then((saved) => {
        if (!active) return;
        currentUrl =
          saved?.format === "pdf" ? URL.createObjectURL(saved.file) : null;
        setFileUrl(currentUrl);
        setDocument(saved);
        setSourcePage(1);
        setRunning(Boolean(saved));
        if (documentId && !saved) {
          setNotice("That document was not found.");
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setNotice(
            error instanceof Error
              ? error.message
              : "Saved documents could not be opened.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [documentId]);

  useEffect(() => {
    if (!viewerExpanded) return;
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") setViewerExpanded(false);
    }
    window.document.addEventListener("keydown", handleKeyDown);
    return () => window.document.removeEventListener("keydown", handleKeyDown);
  }, [viewerExpanded]);

  useEffect(() => {
    if (!running || ended || remaining <= 0) return;
    const timer = window.setInterval(
      () => setRemaining((current) => Math.max(0, current - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [running, ended, remaining]);

  const questions = document?.analysis?.questions ?? [];
  const question = questions[questionIndex];
  const pageText =
    document?.analysis?.pages.find((page) => page.number === sourcePage)
      ?.text ?? "";
  const pageCount = document?.analysis?.pages.length ?? 0;

  function nextQuestion(): void {
    if (questionIndex + 1 >= questions.length) return;
    setQuestionIndex(questionIndex + 1);
    setSourcePage(questions[questionIndex + 1].page);
    setAnswer("");
    setHintVisible(false);
    setFeedbackVisible(false);
    setBookmarked(false);
  }

  return (
    <AppShell active="Study">
      <main className="study-page">
        <div className="study-header">
          <div>
            <h1>
              {document?.analysis?.subject
                ? document.analysis.subject + " study"
                : "Study your material."}
            </h1>
            <p>{document?.name ?? "Choose a document from Library"}</p>
            <span>{document ? "Your source" : "No document selected"}</span>
          </div>
          {document ? (
            <div className="session-timer">
              <Clock3 aria-hidden="true" />
              <div className="timer-content">
                <div>
                  <strong>{formatTime(remaining)}</strong> <span>left</span>
                </div>
                <div className="timer-track">
                  <span
                    style={{
                      width: (remaining / initialSeconds) * 100 + "%",
                    }}
                  />
                </div>
                <small>Focused study session</small>
              </div>
              <button
                type="button"
                onClick={() => setRunning(!running)}
                disabled={ended || remaining === 0}
              >
                {running ? (
                  <Pause aria-hidden="true" />
                ) : (
                  <Play aria-hidden="true" />
                )}
                {running ? "Pause" : "Resume"}
              </button>
              <button
                type="button"
                className="end-session"
                onClick={() => {
                  setEnded(true);
                  setRunning(false);
                  setNotice("This study session has ended.");
                }}
              >
                <Square aria-hidden="true" /> End session
              </button>
            </div>
          ) : null}
        </div>

        {notice ? (
          <div className="notice" role="status">
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

        <div className="study-columns">
          <section
            className={
              "document-viewer" +
              (viewerExpanded ? " document-viewer-expanded" : "")
            }
            aria-label="Your document"
          >
            <div className="document-toolbar">
              <span className="document-toolbar-icon">
                <FileText aria-hidden="true" />
              </span>
              <div>
                <strong>{document?.name ?? "No document selected"}</strong>
                <small>
                  {document
                    ? document.format === "pdf"
                      ? "Original PDF · page " + sourcePage + " of " + pageCount
                      : "Extracted document text"
                    : "Add a PDF or document in Library"}
                </small>
              </div>
              {document ? (
                <div className="document-controls">
                  {document.format === "pdf" && pageCount > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setSourcePage(Math.max(1, sourcePage - 1))
                        }
                        disabled={sourcePage === 1}
                        aria-label="Previous PDF page"
                      >
                        <ChevronLeft aria-hidden="true" />
                      </button>
                      <span>
                        {sourcePage} / {pageCount}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setSourcePage(Math.min(pageCount, sourcePage + 1))
                        }
                        disabled={sourcePage === pageCount}
                        aria-label="Next PDF page"
                      >
                        <ChevronRight aria-hidden="true" />
                      </button>
                    </>
                  ) : null}
                  {document.format === "pdf" && fileUrl ? (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open original PDF"
                    >
                      Open PDF
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setViewerExpanded(!viewerExpanded)}
                    aria-label={
                      viewerExpanded
                        ? "Close expanded document"
                        : "Expand document"
                    }
                  >
                    {viewerExpanded ? (
                      <X aria-hidden="true" />
                    ) : (
                      <Maximize2 aria-hidden="true" />
                    )}
                  </button>
                </div>
              ) : null}
            </div>
            <div className="document-scroll">
              {loading ? (
                <div className="study-document-empty">
                  <p>Opening your documents…</p>
                </div>
              ) : document?.format === "pdf" ? (
                <PdfPage file={document.file} pageNumber={sourcePage} />
              ) : document ? (
                <article className="source-text-paper">
                  <h2>{document.name}</h2>
                  <span>Source text · section {sourcePage}</span>
                  <pre>
                    {pageText ||
                      "No readable text was extracted. Check the source in Library."}
                  </pre>
                </article>
              ) : (
                <div className="study-document-empty">
                  <FileText aria-hidden="true" />
                  <h2>Bring your own source</h2>
                  <p>
                    Add a PDF, Word document, or text file in Library. Your
                    original file will appear here.
                  </p>
                  <Link href="/library">
                    Add material <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
              )}
            </div>
          </section>

          <div className="study-right">
            {question ? (
              <section
                className="question-card"
                aria-labelledby="study-question-title"
              >
                <div className="question-top">
                  <span className="question-count">
                    <Clock3 aria-hidden="true" /> Question {questionIndex + 1}{" "}
                    of {questions.length}
                  </span>
                  <div>
                    <span className="topic-pill">
                      {document?.analysis?.topics[0] ?? "Your document"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBookmarked(!bookmarked)}
                      aria-label={
                        bookmarked ? "Remove bookmark" : "Bookmark question"
                      }
                      aria-pressed={bookmarked}
                    >
                      <Bookmark
                        fill={bookmarked ? "currentColor" : "none"}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
                <h2 id="study-question-title">{question.prompt}</h2>
                <div className="question-guidance">
                  <strong>
                    Source: {document?.format === "pdf" ? "page " : "section "}
                    {question.page}
                  </strong>
                  <span>
                    {question.reviewRequired
                      ? "AI draft · check this question against the source."
                      : "Supporting quote matched the extracted text."}
                  </span>
                </div>
                <label className="sr-only" htmlFor="study-answer">
                  Write your answer
                </label>
                <textarea
                  id="study-answer"
                  placeholder="Write your answer here..."
                  value={answer}
                  onChange={(event) => {
                    setAnswer(event.target.value);
                    setFeedbackVisible(false);
                  }}
                  rows={5}
                />
                {hintVisible ? (
                  <div className="study-hint" role="status">
                    {question.hint ||
                      "Look back at the source before answering."}
                  </div>
                ) : null}
                {feedbackVisible ? (
                  <div className="study-feedback" role="status">
                    <CheckCircle2 aria-hidden="true" />
                    <div>
                      <strong>Compare with this draft answer</strong>
                      <p>{question.answer}</p>
                      {question.evidence ? (
                        <small>Source quote: “{question.evidence}”</small>
                      ) : null}
                      <small>
                        This is a self-check guide. Your answer has not been
                        graded.
                      </small>
                    </div>
                  </div>
                ) : null}
                <div className="question-actions">
                  <button
                    type="button"
                    className="check-answer"
                    disabled={!answer.trim()}
                    onClick={() => setFeedbackVisible(true)}
                  >
                    Check my thinking
                  </button>
                  <button
                    type="button"
                    className="hint-button"
                    onClick={() => setHintVisible(!hintVisible)}
                    aria-expanded={hintVisible}
                  >
                    <Lightbulb aria-hidden="true" />{" "}
                    {hintVisible ? "Hide hint" : "Show a hint"}
                  </button>
                </div>
                {questionIndex + 1 < questions.length ? (
                  <button
                    type="button"
                    className="next-question"
                    onClick={nextQuestion}
                  >
                    Next question <ArrowRight aria-hidden="true" />
                  </button>
                ) : null}
              </section>
            ) : (
              <section className="question-card question-empty">
                <span className="topic-pill">Practice</span>
                <h2>
                  {document
                    ? "No practice questions yet"
                    : "Start with your own material"}
                </h2>
                <p>
                  {document
                    ? document.analysis?.aiStatus === "unavailable"
                      ? "Your document text is ready. There are no practice questions yet."
                      : document.analysis?.aiStatus === "failed"
                        ? "Questions could not be prepared. Check the source in Library and try again."
                        : "Review this file in Library to prepare source-linked questions."
                    : "Upload a document in Library, then return here to study it."}
                </p>
                <Link href="/library">
                  Open Library <ArrowRight aria-hidden="true" />
                </Link>
              </section>
            )}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
