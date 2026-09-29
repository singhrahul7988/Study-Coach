import type { CoachRequest, CoachSource, DemoPlanTask } from "@/types/journey";

const paceMinutes = {
  gentle: 20,
  steady: 35,
  focused: 50,
} as const;

const commonWords = new Set([
  "about",
  "could",
  "explain",
  "help",
  "please",
  "should",
  "study",
  "today",
  "what",
  "with",
  "would",
  "your",
]);

export function availableMinutes(
  pace: CoachRequest["profile"]["pace"],
): number {
  return paceMinutes[pace];
}

export function selectRelevantSources(request: CoachRequest): CoachSource[] {
  if (
    request.mode === "starter" ||
    /plan|study|today|revise/i.test(request.question)
  ) {
    return request.sources.slice(0, 3);
  }
  const previousQuestion = request.history
    .filter((item) => item.role === "student")
    .at(-1)?.text;
  const searchQuestion =
    /^(and |what about|tell me more|explain more|continue)/i.test(
      request.question,
    ) && previousQuestion
      ? previousQuestion
      : request.question;
  const tokens = (
    searchQuestion.toLowerCase().match(/[a-z]{4,}/g) ?? []
  ).filter((word) => !commonWords.has(word));
  if (!tokens.length) return [];
  return request.sources
    .map((source) => {
      const label = [source.name, source.subject, ...source.topics]
        .join(" ")
        .toLowerCase();
      const text = source.text.toLowerCase();
      const score = tokens.reduce(
        (total, token) =>
          total +
          (label.includes(token) ? 3 : 0) +
          (text.includes(token) ? 1 : 0),
        0,
      );
      return { source, score };
    })
    .filter((item) => item.score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, 3)
    .map((item) => item.source);
}

function requestedFocus(question: string): string | null {
  if (/\b(plan|today|what should i study)\b/i.test(question)) return null;
  const focus = question
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[?!\.]+$/, "")
    .replace(
      /^(?:can you |could you |please |i need help (?:with|on) |i want to (?:study|understand) |help me (?:understand|with) |explain |teach me |what is |how does |how do i )/i,
      "",
    )
    .replace(/\s+please$/i, "")
    .trim();
  if (focus.length < 4 || focus.length > 70 || focus === question.trim()) {
    return null;
  }
  return focus;
}

export function createDemoPlan(
  request: CoachRequest,
  sources: CoachSource[],
): DemoPlanTask[] {
  const budget = availableMinutes(request.profile.pace);
  const firstShare =
    request.profile.grade <= 8
      ? 0.55
      : request.profile.entranceExam
        ? 0.5
        : 0.65;
  const firstMinutes = Math.round((budget * firstShare) / 5) * 5;
  const source = sources[0];
  const focus = requestedFocus(request.question);
  const sourceTopic = source?.topics[0] || source?.subject;
  const firstTitle = source
    ? (request.profile.grade <= 8 ? "Read and discuss " : "Explore ") +
      (sourceTopic || source.name)
    : request.mode === "starter"
      ? "Choose your next topic with Coach"
      : focus
        ? "Work through " + focus + " with Coach"
        : request.profile.grade <= 8
          ? "Talk through one question with Coach"
          : "Work through your question with Coach";
  const firstReason = source
    ? "This uses a reviewed source from your Library."
    : "No reviewed source is available for this topic yet.";
  const secondReason = request.profile.entranceExam
    ? "You selected " +
      request.profile.entranceExam +
      "; allow more time to practise, then verify exam alignment with a source."
    : "A short check helps you find what needs another explanation.";
  return [
    {
      id: "understand",
      title: firstTitle,
      minutes: firstMinutes,
      reason: firstReason,
      sourceId: source?.id ?? null,
      sourceName: source?.name ?? null,
      page: source?.page ?? null,
    },
    {
      id: "self-check",
      title: source
        ? "Try a source-linked self-check"
        : "Summarize and self-check",
      minutes: budget - firstMinutes,
      reason: secondReason,
      sourceId: source?.id ?? null,
      sourceName: source?.name ?? null,
      page: source?.page ?? null,
    },
  ];
}
