import { z } from "zod";

export const documentFormatSchema = z.enum(["pdf", "docx", "txt", "md"]);
export type DocumentFormat = z.infer<typeof documentFormatSchema>;

export const extractedPageSchema = z.object({
  number: z.number().int().positive(),
  text: z.string(),
  source: z.enum(["embedded", "text", "unreadable"]),
});
export type ExtractedPage = z.infer<typeof extractedPageSchema>;

export const practiceQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  answer: z.string(),
  hint: z.string(),
  page: z.number().int().positive(),
  evidence: z.string(),
  reviewRequired: z.boolean(),
});
export type PracticeQuestion = z.infer<typeof practiceQuestionSchema>;

export const documentAnalysisSchema = z.object({
  subject: z.string().nullable(),
  topics: z.array(z.string()),
  summary: z.string().nullable(),
  pages: z.array(extractedPageSchema),
  questions: z.array(practiceQuestionSchema),
  warnings: z.array(z.string()),
  aiStatus: z.enum(["complete", "unavailable", "failed"]),
});
export type DocumentAnalysis = z.infer<typeof documentAnalysisSchema>;

export const analyzeResponseSchema = z.object({
  format: documentFormatSchema,
  analysis: documentAnalysisSchema,
});

export interface StoredDocument {
  id: string;
  name: string;
  format: DocumentFormat;
  size: number;
  addedAt: string;
  status: "processing" | "ready" | "needs-review" | "error";
  file: Blob;
  analysis: DocumentAnalysis | null;
  error: string | null;
  reviewed: boolean;
}
