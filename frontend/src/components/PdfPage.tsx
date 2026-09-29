"use client";

import { useEffect, useRef, useState } from "react";

interface PdfPageProps {
  file: Blob;
  pageNumber: number;
}

export function PdfPage({ file, pageNumber }: PdfPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (containerWidth === 0) return;
    let active = true;
    let cancelRender: (() => void) | null = null;
    let destroyDocument: (() => Promise<void>) | null = null;

    async function renderPage(): Promise<void> {
      setReady(false);
      setError(null);
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const bytes = new Uint8Array(await file.arrayBuffer());
        if (!active) return;
        const loadingTask = pdfjs.getDocument({ data: bytes });
        destroyDocument = () => loadingTask.destroy();
        const pdf = await loadingTask.promise;
        if (!active) return;
        const page = await pdf.getPage(Math.min(pageNumber, pdf.numPages));
        const canvas = canvasRef.current;
        if (!active || !canvas) return;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("The PDF preview could not start.");
        const base = page.getViewport({ scale: 1 });
        const availableWidth = Math.max(100, containerWidth - 28);
        const scale = Math.min(1.5, availableWidth / base.width);
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: scale * pixelRatio });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${Math.floor(viewport.width / pixelRatio)}px`;
        canvas.style.height = "auto";
        const task = page.render({ canvas, canvasContext: context, viewport });
        cancelRender = () => task.cancel();
        await task.promise;
        if (active) setReady(true);
      } catch (cause: unknown) {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "The PDF preview could not be shown.",
          );
        }
      }
    }

    void renderPage();
    return () => {
      active = false;
      cancelRender?.();
      void destroyDocument?.();
    };
  }, [file, pageNumber, containerWidth]);

  return (
    <div ref={containerRef} className="study-pdf-page">
      {!ready && !error ? (
        <p role="status">Rendering page {pageNumber}…</p>
      ) : null}
      {error ? <p role="alert">{error}</p> : null}
      <canvas ref={canvasRef} aria-label={`PDF page ${pageNumber}`} />
    </div>
  );
}
