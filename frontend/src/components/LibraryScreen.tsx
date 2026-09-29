"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { readDemoServiceKeys } from "@/lib/demoServiceKeys";
import { AppShell, type SearchItem } from "@/components/AppShell";
import { DocumentIcon } from "@/components/DocumentIcon";
import {
  deleteDocument,
  listDocuments,
  saveDocument,
} from "@/lib/documentStore";
import {
  analyzeResponseSchema,
  type DocumentFormat,
  type StoredDocument,
} from "@/types/document";

const maximumFileBytes = 10 * 1024 * 1024;
const acceptedExtensions = new Set(["pdf", "docx", "txt", "md"]);

function readableSize(bytes: number): string {
  return bytes < 1024 * 1024
    ? Math.max(1, Math.round(bytes / 1024)) + " KB"
    : (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function formatFromName(name: string): DocumentFormat | null {
  const extension = name.toLowerCase().split(".").pop();
  if (extension && acceptedExtensions.has(extension)) {
    return extension as DocumentFormat;
  }
  return null;
}

function responseError(payload: unknown): string {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return payload.error;
  }
  return "The document could not be analysed. Please try again.";
}

function statusLabel(document: StoredDocument): string {
  if (document.status === "processing") return "Analysing";
  if (document.status === "error") return "Needs attention";
  if (document.status === "ready") return "Ready";
  return "Check details";
}

export function LibraryScreen() {
  const inputRef = useRef<HTMLInputElement>(null);
  const insightsRef = useRef<HTMLElement>(null);
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageDraft, setPageDraft] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [working, setWorking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listDocuments()
      .then((saved) => {
        if (active) setDocuments(saved);
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
    };
  }, []);

  const selected = documents.find((document) => document.id === selectedId);
  const currentPage = selected?.analysis?.pages.find(
    (page) => page.number === pageNumber,
  );
  const searchItems: SearchItem[] = documents.map((document) => ({
    id: document.id,
    label: document.name,
    description: document.analysis?.subject ?? document.format.toUpperCase(),
  }));

  function chooseDocument(document: StoredDocument): void {
    setSelectedId(document.id);
    setPageNumber(1);
    setPageDraft(document.analysis?.pages[0]?.text ?? "");
    if (window.innerWidth <= 1250) {
      window.setTimeout(() => {
        insightsRef.current?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
          block: "start",
        });
      }, 0);
    }
  }

  async function refreshDocuments(): Promise<void> {
    setDocuments(await listDocuments());
  }

  async function analyseFile(
    file: File,
    existing?: StoredDocument,
  ): Promise<void> {
    const format = formatFromName(file.name);
    if (!format || file.size === 0 || file.size > maximumFileBytes) {
      setNotice("Choose a PDF, Word .docx, .txt, or .md file under 10 MB.");
      return;
    }
    const document: StoredDocument = existing
      ? { ...existing, status: "processing", error: null, reviewed: false }
      : {
          id: crypto.randomUUID(),
          name: file.name,
          format,
          size: file.size,
          addedAt: new Date().toISOString(),
          status: "processing",
          file,
          analysis: null,
          error: null,
          reviewed: false,
        };
    await saveDocument(document);
    await refreshDocuments();
    setSelectedId(document.id);
    setPageNumber(1);
    setPageDraft("");
    const form = new FormData();
    form.append("file", file);
    const geminiKey = readDemoServiceKeys().gemini;
    if (geminiKey) form.append("geminiApiKey", geminiKey);
    if (existing?.analysis) {
      form.append(
        "reviewedPages",
        JSON.stringify(
          existing.analysis.pages.map(({ number, text }) => ({ number, text })),
        ),
      );
    }
    try {
      const response = await fetch("/api/documents/analyze", {
        method: "POST",
        body: form,
      });
      const payload: unknown = await response.json();
      if (!response.ok) throw new Error(responseError(payload));
      const result = analyzeResponseSchema.parse(payload);
      const updated: StoredDocument = {
        ...document,
        format: result.format,
        analysis: result.analysis,
        status: "needs-review",
        error: null,
      };
      await saveDocument(updated);
      await refreshDocuments();
      setPageDraft(result.analysis.pages[0]?.text ?? "");
      setNotice(
        result.analysis.aiStatus === "complete"
          ? "Your file is ready. Check the text and suggested questions against the original."
          : "Text was extracted. Review it below; practice questions are unavailable right now.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The document could not be analysed.";
      await saveDocument({ ...document, status: "error", error: message });
      await refreshDocuments();
      setNotice(message);
    }
  }

  async function addFiles(files: FileList | File[]): Promise<void> {
    if (working) return;
    const selectedFiles = Array.from(files);
    if (!selectedFiles.length) return;
    setWorking(true);
    try {
      for (const file of selectedFiles) {
        await analyseFile(file);
      }
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "The file could not be saved.",
      );
    } finally {
      setWorking(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.files) void addFiles(event.target.files);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    setDragActive(false);
    if (event.dataTransfer.files.length) {
      void addFiles(event.dataTransfer.files);
    }
  }

  async function correctPage(): Promise<void> {
    if (!selected?.analysis || !currentPage) return;
    const updated: StoredDocument = {
      ...selected,
      reviewed: false,
      status: "needs-review",
      analysis: {
        ...selected.analysis,
        pages: selected.analysis.pages.map((page) =>
          page.number === pageNumber
            ? { ...page, text: pageDraft.trim(), source: "text" as const }
            : page,
        ),
        questions: selected.analysis.questions.map((question) => ({
          ...question,
          reviewRequired: true,
        })),
        warnings: [
          ...selected.analysis.warnings,
          "Text was corrected after AI analysis. Check generated questions against the new text.",
        ],
      },
    };
    await saveDocument(updated);
    await refreshDocuments();
    setNotice("Corrected text saved.");
  }

  async function markReviewed(): Promise<void> {
    if (!selected?.analysis) return;
    const needsQuestionReview = selected.analysis.questions.some(
      (question) => question.reviewRequired,
    );
    const hasUnreadablePage = selected.analysis.pages.some(
      (page) => !page.text.trim(),
    );
    const updated: StoredDocument = {
      ...selected,
      reviewed: true,
      status:
        needsQuestionReview || hasUnreadablePage ? "needs-review" : "ready",
    };
    await saveDocument(updated);
    await refreshDocuments();
    setNotice(
      updated.status === "ready"
        ? "Document review saved."
        : "Your review is saved. Some pages or question quotes still need checking.",
    );
  }

  async function removeSelected(): Promise<void> {
    if (!selected) return;
    if (!window.confirm("Delete " + selected.name + "?")) {
      return;
    }
    await deleteDocument(selected.id);
    await refreshDocuments();
    setSelectedId(null);
    setNotice("Document deleted.");
  }

  async function retrySelected(): Promise<void> {
    if (!selected || working) return;
    setWorking(true);
    try {
      const file = new File([selected.file], selected.name, {
        type: selected.file.type,
      });
      await analyseFile(file, selected);
    } finally {
      setWorking(false);
    }
  }

  return (
    <AppShell
      active="Library"
      searchItems={searchItems}
      onSearchSelect={(item) => {
        const found = documents.find((document) => document.id === item.id);
        if (found) chooseDocument(found);
      }}
    >
      <main className="library-page">
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
        <div className="library-heading">
          <div>
            <h1>Your study material.</h1>
            <p>
              Add your own files, check what was read, then practise from them.
            </p>
          </div>
          <button
            type="button"
            className="library-add"
            onClick={() => inputRef.current?.click()}
            disabled={working}
          >
            <Plus aria-hidden="true" /> Add material
          </button>
        </div>

        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept=".pdf,.docx,.txt,.md"
          multiple
          onChange={handleFileChange}
          aria-label="Select study material"
        />
        <div className="library-workspace">
          <div className="library-left">
            <div
              className={
                "upload-zone" + (dragActive ? " upload-zone-active" : "")
              }
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <span className="upload-icon" aria-hidden="true">
                <Upload />
              </span>
              <strong>
                {working ? "Reading your document…" : "Drop a document here"}
              </strong>
              <p>
                or{" "}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={working}
                >
                  browse files
                </button>{" "}
                from your device.
              </p>
              <small>
                PDF, Word .docx, .txt, .md · 10 MB · PDF up to 80 pages
              </small>
              <small>
                Preparing questions may send the selected file for AI analysis.
              </small>
            </div>

            <section
              className="document-list"
              aria-labelledby="document-list-title"
            >
              <div className="document-list-heading">
                <h2 id="document-list-title">Your documents</h2>
                <span>{documents.length} saved here</span>
              </div>
              {loading ? (
                <p className="library-empty">Loading your documents…</p>
              ) : documents.length ? (
                <div className="document-list-items">
                  {documents.map((document) => (
                    <div
                      className={
                        "document-list-row" +
                        (selectedId === document.id
                          ? " document-list-row-active"
                          : "")
                      }
                      key={document.id}
                    >
                      <DocumentIcon format={document.format} />
                      <button
                        type="button"
                        className="document-list-title"
                        onClick={() => chooseDocument(document)}
                      >
                        <strong>{document.name}</strong>
                        <small>
                          {document.format.toUpperCase()} ·{" "}
                          {readableSize(document.size)}
                          {document.analysis?.subject
                            ? " · " + document.analysis.subject
                            : ""}
                        </small>
                      </button>
                      <span
                        className={
                          "document-state document-state-" + document.status
                        }
                      >
                        {statusLabel(document)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="library-empty">
                  <BookOpen aria-hidden="true" />
                  <strong>No documents yet</strong>
                  <p>Your uploaded PDFs and notes will appear here.</p>
                </div>
              )}
            </section>
          </div>

          <aside
            ref={insightsRef}
            className="document-insights"
            aria-label="Document analysis"
          >
            {selected ? (
              <>
                <div className="document-insights-heading">
                  <DocumentIcon format={selected.format} />
                  <div>
                    <h2>{selected.name}</h2>
                    <p>
                      {statusLabel(selected)} · {readableSize(selected.size)}
                    </p>
                  </div>
                </div>
                {selected.error ? (
                  <p className="document-warning" role="alert">
                    {selected.error}
                  </p>
                ) : null}
                {selected.analysis ? (
                  <>
                    <Link
                      className="library-study-link"
                      href={
                        "/study?document=" + encodeURIComponent(selected.id)
                      }
                    >
                      Open in Study <ArrowRight aria-hidden="true" />
                    </Link>
                    <div className="document-insights-section">
                      <span className="insight-label">
                        {selected.analysis.aiStatus === "complete"
                          ? "Draft study notes"
                          : "Source details"}
                      </span>
                      <h3>
                        {selected.analysis.subject ?? "Subject not detected"}
                      </h3>
                      <p>
                        {selected.analysis.summary ??
                          "No summary is available. Check the extracted text below before studying."}
                      </p>
                      {selected.analysis.topics.length ? (
                        <div className="document-topic-list">
                          {selected.analysis.topics.map((topic) => (
                            <span key={topic}>{topic}</span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    {selected.analysis.warnings.length ? (
                      <div className="document-warning-list">
                        <strong>Check these details</strong>
                        <ul>
                          {selected.analysis.warnings.map((warning, index) => (
                            <li key={warning + index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <div className="document-insights-section">
                      <div className="source-review-heading">
                        <h3>Extracted text</h3>
                        <span>
                          {selected.format === "pdf" ? "Page" : "Section"}{" "}
                          {pageNumber} of {selected.analysis.pages.length}
                        </span>
                      </div>
                      {selected.analysis.pages.length > 1 ? (
                        <select
                          aria-label="Choose source page"
                          value={pageNumber}
                          onChange={(event) => {
                            const next = Number(event.target.value);
                            setPageNumber(next);
                            setPageDraft(
                              selected.analysis?.pages.find(
                                (page) => page.number === next,
                              )?.text ?? "",
                            );
                          }}
                        >
                          {selected.analysis.pages.map((page) => (
                            <option key={page.number} value={page.number}>
                              Page {page.number}
                            </option>
                          ))}
                        </select>
                      ) : null}
                      <label className="sr-only" htmlFor="corrected-page-text">
                        Correct extracted text
                      </label>
                      <textarea
                        id="corrected-page-text"
                        value={pageDraft}
                        onChange={(event) => setPageDraft(event.target.value)}
                        placeholder="No selectable text was found. Read the original PDF in Study and add corrections here."
                        rows={10}
                      />
                      <button
                        type="button"
                        className="library-secondary"
                        onClick={() => void correctPage()}
                        disabled={pageDraft === (currentPage?.text ?? "")}
                      >
                        Save corrected text
                      </button>
                    </div>
                    <div className="document-insights-actions">
                      <button
                        type="button"
                        className="library-secondary"
                        onClick={() => void markReviewed()}
                      >
                        <CheckCircle2 aria-hidden="true" /> I checked this
                        source
                      </button>
                      <button
                        type="button"
                        className="library-secondary"
                        onClick={() => void retrySelected()}
                        disabled={working}
                      >
                        <RefreshCw aria-hidden="true" /> Analyse again
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="document-insights-placeholder">
                    {selected.status === "processing"
                      ? "Extracting text and analysing the source…"
                      : "Run analysis again to read this document."}
                  </p>
                )}
                <button
                  type="button"
                  className="library-delete"
                  onClick={() => void removeSelected()}
                >
                  <Trash2 aria-hidden="true" /> Delete document
                </button>
              </>
            ) : (
              <div className="document-insights-empty">
                <BookOpen aria-hidden="true" />
                <h2>Learn from your own sources</h2>
                <p>
                  Select a document to inspect extracted text, correct mistakes,
                  and open source-based practice.
                </p>
              </div>
            )}
          </aside>
        </div>
      </main>
    </AppShell>
  );
}
