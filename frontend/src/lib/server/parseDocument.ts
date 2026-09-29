import mammoth from "mammoth";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import type { DocumentFormat, ExtractedPage } from "@/types/document";

export const maximumDocumentBytes = 10 * 1024 * 1024;
export const maximumPdfPages = 80;
const maximumTextCharacters = 300_000;

export interface ParsedDocument {
  format: DocumentFormat;
  pages: ExtractedPage[];
  warnings: string[];
  hasCorrections?: boolean;
}

export class DocumentParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DocumentParseError";
  }
}

export function detectDocumentFormat(
  name: string,
  bytes: Uint8Array,
): DocumentFormat {
  const extension = name.toLowerCase().split(".").pop();
  const signature = new TextDecoder("ascii").decode(bytes.subarray(0, 4));
  if (extension === "pdf" && signature === "%PDF") return "pdf";
  if (extension === "docx" && signature.startsWith("PK")) return "docx";
  if (extension === "txt") return "txt";
  if (extension === "md") return "md";
  throw new DocumentParseError(
    "Use a valid PDF, Word .docx, text .txt, or Markdown .md file.",
  );
}

function limitText(pages: ExtractedPage[]): void {
  const characters = pages.reduce((total, page) => total + page.text.length, 0);
  if (characters > maximumTextCharacters) {
    throw new DocumentParseError(
      "This document contains too much text for the current analyser.",
    );
  }
}

async function parsePdf(bytes: Uint8Array): Promise<ParsedDocument> {
  const loading = getDocument({
    data: new Uint8Array(bytes),
    useSystemFonts: true,
  });
  try {
    const document = await loading.promise;
    if (document.numPages > maximumPdfPages) {
      throw new DocumentParseError(
        "PDFs can contain up to " + maximumPdfPages + " pages for now.",
      );
    }
    const pages: ExtractedPage[] = [];
    for (let number = 1; number <= document.numPages; number += 1) {
      const page = await document.getPage(number);
      const content = await page.getTextContent();
      let text = "";
      for (const item of content.items) {
        if ("str" in item) {
          text += item.str + (item.hasEOL ? "\n" : " ");
        }
      }
      const cleaned = text.replace(/[ \t]+\n/g, "\n").trim();
      pages.push({
        number,
        text: cleaned,
        source: cleaned ? "embedded" : "unreadable",
      });
      page.cleanup();
    }
    limitText(pages);
    const unreadable = pages.filter((page) => page.source === "unreadable");
    return {
      format: "pdf",
      pages,
      warnings: unreadable.length
        ? [
            unreadable.length +
              " page(s) have no selectable text. Check those pages in the original PDF.",
          ]
        : [],
    };
  } catch (error) {
    if (error instanceof DocumentParseError) throw error;
    throw new DocumentParseError(
      "The PDF could not be read. Check that it is not damaged or password protected.",
    );
  } finally {
    await loading.destroy();
  }
}

async function parseDocx(bytes: Uint8Array): Promise<ParsedDocument> {
  try {
    const result = await mammoth.extractRawText({
      buffer: Buffer.from(bytes),
    });
    const text = result.value.trim();
    if (!text) {
      throw new DocumentParseError(
        "No readable text was found in this Word document.",
      );
    }
    const pages: ExtractedPage[] = [{ number: 1, text, source: "text" }];
    limitText(pages);
    return {
      format: "docx",
      pages,
      warnings: [
        "Word page positions are not preserved; references use document text.",
        ...result.messages.map((message) => message.message),
      ],
    };
  } catch (error) {
    if (error instanceof DocumentParseError) throw error;
    throw new DocumentParseError(
      "The Word document could not be read. Save it as .docx and try again.",
    );
  }
}

function parsePlainText(
  bytes: Uint8Array,
  format: "txt" | "md",
): ParsedDocument {
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes).trim();
    if (!text) throw new DocumentParseError("The document is empty.");
    const pages: ExtractedPage[] = [{ number: 1, text, source: "text" }];
    limitText(pages);
    return { format, pages, warnings: [] };
  } catch (error) {
    if (error instanceof DocumentParseError) throw error;
    throw new DocumentParseError("The text file could not be read as UTF-8.");
  }
}

export async function parseDocument(
  name: string,
  bytes: Uint8Array,
): Promise<ParsedDocument> {
  if (bytes.byteLength === 0) {
    throw new DocumentParseError("The selected file is empty.");
  }
  if (bytes.byteLength > maximumDocumentBytes) {
    throw new DocumentParseError("Choose a file under 10 MB.");
  }
  const format = detectDocumentFormat(name, bytes);
  if (format === "pdf") return parsePdf(bytes);
  if (format === "docx") return parseDocx(bytes);
  return parsePlainText(bytes, format);
}
