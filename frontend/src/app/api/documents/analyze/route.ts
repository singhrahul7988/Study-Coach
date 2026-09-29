import { NextResponse } from "next/server";
import { z } from "zod";
import { analyseWithGemini } from "@/lib/server/geminiDocument";
import {
  DocumentParseError,
  maximumDocumentBytes,
  parseDocument,
} from "@/lib/server/parseDocument";

export const runtime = "nodejs";
export const maxDuration = 60;

const reviewedPagesSchema = z
  .array(
    z.object({
      number: z.number().int().positive(),
      text: z.string().max(300_000),
    }),
  )
  .max(80);

function errorResponse(message: string, status: number): NextResponse {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request): Promise<NextResponse> {
  if (process.env.NODE_ENV === "production") {
    return errorResponse(
      "Document analysis is unavailable right now. Try again later.",
      503,
    );
  }
  const url = new URL(request.url);
  if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
    return errorResponse(
      "Document analysis is unavailable from this address.",
      403,
    );
  }
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) {
    return errorResponse("This upload must come from the app.", 403);
  }
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > maximumDocumentBytes + 1024 * 1024) {
    return errorResponse("Choose a file under 10 MB.", 413);
  }

  let file: File;
  let reviewedPages: z.infer<typeof reviewedPagesSchema> | null = null;
  let geminiApiKey: string | undefined;
  try {
    const form = await request.formData();
    const selected = form.get("file");
    if (!(selected instanceof File)) {
      return errorResponse("Choose a document to analyse.", 400);
    }
    file = selected;
    const submittedKey = form.get("geminiApiKey");
    if (typeof submittedKey === "string" && submittedKey.trim()) {
      if (submittedKey.length > 512 || submittedKey.length < 12) {
        return errorResponse("Check the Gemini key in Settings.", 400);
      }
      geminiApiKey = submittedKey.trim();
    }
    const submittedPages = form.get("reviewedPages");
    if (typeof submittedPages === "string") {
      reviewedPages = reviewedPagesSchema.parse(JSON.parse(submittedPages));
      if (
        reviewedPages.reduce((sum, page) => sum + page.text.length, 0) > 300_000
      ) {
        return errorResponse("The corrected text is too long to analyse.", 400);
      }
    }
  } catch {
    return errorResponse("The upload could not be read.", 400);
  }

  if (file.size > maximumDocumentBytes) {
    return errorResponse("Choose a file under 10 MB.", 413);
  }
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const extracted = await parseDocument(file.name, bytes);
    if (
      reviewedPages &&
      (reviewedPages.length !== extracted.pages.length ||
        reviewedPages.some(
          (page, index) => page.number !== extracted.pages[index].number,
        ))
    ) {
      return errorResponse("The corrected pages do not match this file.", 400);
    }
    const corrections =
      reviewedPages?.filter(
        (page, index) => page.text !== extracted.pages[index].text,
      ) ?? [];
    const parsed = corrections.length
      ? {
          ...extracted,
          pages: extracted.pages.map((page) => {
            const correction = corrections.find(
              (item) => item.number === page.number,
            );
            return correction
              ? { ...page, text: correction.text, source: "text" as const }
              : page;
          }),
          warnings: [
            ...extracted.warnings,
            "Student-corrected text was used for this analysis.",
          ],
          hasCorrections: true,
        }
      : extracted;
    const analysis = await analyseWithGemini(parsed, bytes, geminiApiKey);
    return NextResponse.json(
      { format: parsed.format, analysis },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof DocumentParseError) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("The document could not be analysed.", 500);
  }
}
