import { z } from "zod";

export const demoProfileSchema = z.object({
  name: z.string().trim().min(1).max(40),
  grade: z.number().int().min(6).max(12),
  board: z.enum(["CBSE", "ICSE", "State board", "Other"]),
  entranceExam: z.enum(["JEE", "NEET", "Other"]).nullable(),
  pace: z.enum(["gentle", "steady", "focused"]),
  goal: z
    .enum([
      "Improve overall performance",
      "Prepare for exams",
      "Build a steady routine",
      "Understand difficult topics",
    ])
    .nullable()
    .optional(),
});
export type DemoProfile = z.infer<typeof demoProfileSchema>;

export const coachSourceSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().min(1).max(180),
  subject: z.string().max(80).nullable(),
  topics: z.array(z.string().max(80)).max(5),
  page: z.number().int().positive().max(80),
  text: z.string().min(1).max(1200),
});
export type CoachSource = z.infer<typeof coachSourceSchema>;

export const coachHistorySchema = z.object({
  role: z.enum(["student", "coach"]),
  text: z.string().min(1).max(1200),
});
export type CoachHistory = z.infer<typeof coachHistorySchema>;

export const coachRequestSchema = z.object({
  mode: z.enum(["starter", "question"]),
  profile: demoProfileSchema,
  question: z.string().trim().max(1000),
  sources: z.array(coachSourceSchema).max(6),
  history: z.array(coachHistorySchema).max(6),
});
export type CoachRequest = z.infer<typeof coachRequestSchema>;

export const planTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  minutes: z.number().int().positive().max(60),
  reason: z.string().min(1),
  sourceId: z.string().nullable(),
  sourceName: z.string().nullable(),
  page: z.number().int().positive().nullable(),
});
export type DemoPlanTask = z.infer<typeof planTaskSchema>;

export const coachCitationSchema = z.object({
  sourceId: z.string(),
  sourceName: z.string(),
  page: z.number().int().positive(),
});
export type CoachCitation = z.infer<typeof coachCitationSchema>;

export const coachReplySchema = z.object({
  answer: z.string().min(1),
  status: z.enum(["source-excerpt", "planning-guidance"]),
  citations: z.array(coachCitationSchema),
  tasks: z.array(planTaskSchema).min(1).max(3),
});
export type CoachReply = z.infer<typeof coachReplySchema>;

export const demoConversationSchema = z
  .array(
    z.object({
      id: z.string(),
      role: z.enum(["student", "coach"]),
      text: z.string(),
      reply: coachReplySchema.optional(),
    }),
  )
  .max(30);
export type DemoConversationMessage = z.infer<
  typeof demoConversationSchema
>[number];

export const demoRoomSchema = z.object({
  profile: demoProfileSchema,
  tasks: z.array(planTaskSchema).min(1).max(3),
  createdAt: z.number().int().positive(),
  remainingSeconds: z.number().int().nonnegative(),
  runningSince: z.number().int().positive().nullable(),
  doneIds: z.array(z.string()),
  ended: z.boolean(),
});
export type DemoRoom = z.infer<typeof demoRoomSchema>;
