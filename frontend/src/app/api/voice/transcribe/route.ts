import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 30;

const deepgramResultSchema = z.object({
  results: z.object({
    channels: z
      .array(
        z.object({
          alternatives: z.array(z.object({ transcript: z.string() })).min(1),
        }),
      )
      .min(1),
  }),
});

function error(message: string, status: number): NextResponse {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

export async function POST(request: Request): Promise<NextResponse> {
  if (process.env.NODE_ENV === "production")
    return error("Voice input is unavailable right now.", 503);
  const url = new URL(request.url);
  if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1")
    return error("Voice input is unavailable from this address.", 403);
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin)
    return error("The recording must come from the app.", 403);
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 6 * 1024 * 1024)
    return error("Please record a shorter question.", 413);
  let audio: File;
  let key: string;
  try {
    const form = await request.formData();
    const file = form.get("audio");
    const submittedKey = form.get("deepgramApiKey");
    if (!(file instanceof File)) return error("Record a question first.", 400);
    if (
      typeof submittedKey !== "string" ||
      submittedKey.trim().length < 12 ||
      submittedKey.length > 512
    )
      return error("Add a Deepgram key in Settings.", 400);
    audio = file;
    key = submittedKey.trim();
  } catch {
    return error("The recording could not be read.", 400);
  }
  if (audio.size < 100 || audio.size > 5 * 1024 * 1024)
    return error("Please record a shorter question.", 413);
  if (!/^(audio\/webm|audio\/ogg|audio\/mp4|audio\/mpeg)/.test(audio.type))
    return error("This recording format is unsupported.", 415);
  try {
    const response = await fetch(
      "https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true&mip_opt_out=true",
      {
        method: "POST",
        headers: { Authorization: "Token " + key, "Content-Type": audio.type },
        body: Buffer.from(await audio.arrayBuffer()),
        signal: AbortSignal.timeout(20000),
      },
    );
    if (!response.ok)
      return error(
        "Voice transcription failed. Check your key and try again.",
        502,
      );
    const value: unknown = await response.json();
    const result = deepgramResultSchema.safeParse(value);
    if (!result.success)
      return error("Voice transcription returned no result.", 502);
    const transcript =
      result.data.results.channels[0].alternatives[0].transcript.trim();
    if (!transcript)
      return error(
        "No speech was found. Try again or type your question.",
        422,
      );
    return NextResponse.json(
      { transcript },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return error("Voice transcription is unavailable. Try again.", 502);
  }
}
