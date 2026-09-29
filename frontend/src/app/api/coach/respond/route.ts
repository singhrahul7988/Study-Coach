import { NextResponse } from "next/server";
import {
  availableMinutes,
  createDemoPlan,
  selectRelevantSources,
} from "@/lib/server/demoPlanner";
import {
  coachRequestSchema,
  type CoachRequest,
  type CoachSource,
} from "@/types/journey";

export const runtime = "nodejs";

function relevantExcerpt(question: string, source: CoachSource): string {
  const words = (question.toLowerCase().match(/[a-z]{4,}/g) ?? []).filter(
    (word) => !["about", "explain", "please", "what", "with"].includes(word),
  );
  const sentences = source.text.split(/(?<=[.!?])\s+/);
  const sentence =
    sentences.find((item) =>
      words.some((word) => item.toLowerCase().includes(word)),
    ) ?? sentences[0];
  return sentence.trim().slice(0, 420);
}

function responseText(request: CoachRequest, sources: CoachSource[]): string {
  const budget = availableMinutes(request.profile.pace);
  if (request.mode === "starter") {
    return (
      "Your " +
      budget +
      "-minute starting plan is ready for Class " +
      request.profile.grade +
      " (" +
      request.profile.board +
      "). Ask what you want to work on, then choose the tasks for your room."
    );
  }
  if (sources.length) {
    const source = sources[0];
    return (
      "I found this in " +
      source.name +
      ", page or section " +
      source.page +
      ': "' +
      relevantExcerpt(request.question, source) +
      '" This is an excerpt from your reviewed material, not a full explanation. Check the source and ask a more specific question if needed.'
    );
  }
  return (
    "I can make a " +
    budget +
    "-minute study room around your question. I do not have a relevant reviewed source for this topic yet, so I cannot give a checked academic answer or quiz. Add material in Library for source-linked help."
  );
}

function errorResponse(message: string, status: number): NextResponse {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request): Promise<NextResponse> {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 20_000) {
    return errorResponse("The question or sources are too long.", 413);
  }
  const origin = request.headers.get("origin");
  const url = new URL(request.url);
  if (origin && origin !== url.origin) {
    return errorResponse("This request must come from the app.", 403);
  }
  let parsed: unknown;
  try {
    parsed = await request.json();
  } catch {
    return errorResponse("The Coach request could not be read.", 400);
  }
  const result = coachRequestSchema.safeParse(parsed);
  if (!result.success) {
    return errorResponse("Check your setup and question, then try again.", 400);
  }
  const input = result.data;
  if (input.mode === "question" && !input.question) {
    return errorResponse("Ask a question first.", 400);
  }
  const sources = selectRelevantSources(input);
  const tasks = createDemoPlan(input, sources);
  const source = input.mode === "question" ? sources[0] : undefined;
  return NextResponse.json(
    {
      answer: responseText(input, sources),
      status: source ? "source-excerpt" : "planning-guidance",
      citations: source
        ? [
            {
              sourceId: source.id,
              sourceName: source.name,
              page: source.page,
            },
          ]
        : [],
      tasks,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
