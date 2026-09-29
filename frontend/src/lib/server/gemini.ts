import { GoogleGenAI } from "@google/genai";

export interface GeminiService {
  client: GoogleGenAI;
  model: string;
}

export function getGeminiService(keyOverride?: string): GeminiService | null {
  const apiKey = keyOverride?.trim() || process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  return {
    client: new GoogleGenAI({ apiKey }),
    model: process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash",
  };
}
