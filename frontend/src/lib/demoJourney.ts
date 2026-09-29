import { z } from "zod";
import { listDocuments } from "@/lib/documentStore";
import {
  coachReplySchema,
  demoProfileSchema,
  demoConversationSchema,
  demoRoomSchema,
  type CoachReply,
  type CoachSource,
  type DemoProfile,
  type DemoRoom,
  type DemoConversationMessage,
} from "@/types/journey";

const profileKey = "ranjan-demo-profile";
const starterKey = "ranjan-demo-starter";
const roomKey = "ranjan-demo-room";
const conversationKey = "ranjan-demo-conversation";
const achievementsKey = "ranjan-demo-completed-tasks";
const avatarKey = "ranjan-demo-avatar";
const completedTaskSchema = z.object({
  roomId: z.number().int().positive(),
  taskId: z.string().min(1),
  taskCount: z.number().int().positive().max(3),
  completedAt: z.number().int().positive().max(8_640_000_000_000_000),
});
export type CompletedTask = z.infer<typeof completedTaskSchema>;

export function readCompletedTasks(): CompletedTask[] {
  const stored = readJson(achievementsKey);
  if (!Array.isArray(stored)) return [];
  return stored.slice(-300).flatMap((entry: unknown) => {
    const result = completedTaskSchema.safeParse(entry);
    return result.success ? [result.data] : [];
  });
}

function readJson(key: string): unknown {
  if (typeof window === "undefined") return null;
  try {
    const value = window.sessionStorage.getItem(key);
    return value ? (JSON.parse(value) as unknown) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The demo can still run when storage is unavailable.
  }
}

export function readDemoAvatar(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.sessionStorage.getItem(avatarKey);
    return value && /^data:image\/(png|jpeg|webp);base64,/.test(value)
      ? value
      : null;
  } catch {
    return null;
  }
}

export function saveDemoAvatar(value: string | null): void {
  try {
    if (value) window.sessionStorage.setItem(avatarKey, value);
    else window.sessionStorage.removeItem(avatarKey);
    window.dispatchEvent(new Event("ranjan-demo-avatar-updated"));
  } catch {
    // The profile remains usable when browser storage is unavailable.
  }
}
export function readDemoProfile(): DemoProfile | null {
  const result = demoProfileSchema.safeParse(readJson(profileKey));
  return result.success ? result.data : null;
}

export function saveDemoProfile(profile: DemoProfile): void {
  writeJson(profileKey, demoProfileSchema.parse(profile));
  try {
    window.sessionStorage.removeItem(starterKey);
    window.sessionStorage.removeItem(roomKey);
    window.sessionStorage.removeItem(conversationKey);
  } catch {
    // Storage may be unavailable.
  }
}

export function updateDemoProfile(profile: DemoProfile): void {
  const previous = readDemoProfile();
  const next = demoProfileSchema.parse(profile);
  writeJson(profileKey, next);
  if (
    !previous ||
    previous.grade !== next.grade ||
    previous.board !== next.board ||
    previous.entranceExam !== next.entranceExam ||
    previous.pace !== next.pace
  ) {
    try {
      window.sessionStorage.removeItem(starterKey);
      window.sessionStorage.removeItem(roomKey);
      window.sessionStorage.removeItem(conversationKey);
    } catch {
      // Storage may be unavailable.
    }
    return;
  }
  const room = readDemoRoom();
  if (room) saveDemoRoom({ ...room, profile: next });
}

export function signOutDemoSession(): void {
  try {
    for (const key of [
      profileKey,
      starterKey,
      roomKey,
      conversationKey,
      achievementsKey,
      avatarKey,
    ]) {
      window.sessionStorage.removeItem(key);
    }
  } catch {
    // The current page can still return to the landing screen.
  }
}

export function readStarterReply(): CoachReply | null {
  const result = coachReplySchema.safeParse(readJson(starterKey));
  return result.success ? result.data : null;
}

export function saveStarterReply(reply: CoachReply): void {
  writeJson(starterKey, coachReplySchema.parse(reply));
}

export function readDemoConversation(): DemoConversationMessage[] {
  const result = demoConversationSchema.safeParse(readJson(conversationKey));
  return result.success ? result.data : [];
}

export function saveDemoConversation(
  messages: DemoConversationMessage[],
): void {
  writeJson(conversationKey, demoConversationSchema.parse(messages.slice(-30)));
}

export function readDemoRoom(): DemoRoom | null {
  const result = demoRoomSchema.safeParse(readJson(roomKey));
  return result.success ? result.data : null;
}

export function saveDemoRoom(room: DemoRoom): void {
  const next = demoRoomSchema.parse(room);
  const previous = readDemoRoom();
  const previousDone =
    previous?.createdAt === next.createdAt ? previous.doneIds : [];
  const existing = readCompletedTasks().filter(
    (entry) =>
      entry.roomId !== next.createdAt || next.doneIds.includes(entry.taskId),
  );
  for (const taskId of next.doneIds) {
    if (
      !previousDone.includes(taskId) &&
      next.tasks.some((task) => task.id === taskId) &&
      !existing.some(
        (entry) => entry.roomId === next.createdAt && entry.taskId === taskId,
      )
    ) {
      existing.push({
        roomId: next.createdAt,
        taskId,
        taskCount: next.tasks.length,
        completedAt: Date.now(),
      });
    }
  }
  writeJson(achievementsKey, existing.slice(-300));
  writeJson(roomKey, next);
}

export function remainingRoomSeconds(room: DemoRoom): number {
  if (room.runningSince === null || room.ended) return room.remainingSeconds;
  return Math.max(
    0,
    room.remainingSeconds - Math.floor((Date.now() - room.runningSince) / 1000),
  );
}

export async function reviewedCoachSources(): Promise<CoachSource[]> {
  const documents = await listDocuments();
  return documents
    .filter((document) => document.reviewed && document.analysis)
    .flatMap((document) =>
      (document.analysis?.pages ?? [])
        .filter((page) => page.source !== "unreadable" && page.text.trim())
        .slice(0, 2)
        .map((page) => ({
          id: document.id.slice(0, 100),
          name: document.name.slice(0, 180),
          subject: document.analysis?.subject?.slice(0, 80) ?? null,
          topics:
            document.analysis?.topics
              .slice(0, 5)
              .map((topic) => topic.slice(0, 80)) ?? [],
          page: page.number,
          text: page.text.trim().slice(0, 1200),
        })),
    )
    .slice(0, 6);
}

export async function requestCoachReply(
  profile: DemoProfile,
  question: string,
  sources: CoachSource[],
  history: { role: "student" | "coach"; text: string }[] = [],
  mode: "starter" | "question" = "question",
): Promise<CoachReply> {
  const response = await fetch("/api/coach/respond", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode,
      profile,
      question,
      sources,
      history: history.slice(-6),
    }),
  });
  if (!response.ok) {
    throw new Error("Coach is unavailable right now. Please try again.");
  }
  const value: unknown = await response.json();
  return coachReplySchema.parse(value);
}
