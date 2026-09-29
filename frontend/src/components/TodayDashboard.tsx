"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock3,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  readDemoProfile,
  readDemoRoom,
  readStarterReply,
  remainingRoomSeconds,
} from "@/lib/demoJourney";
import type { CoachReply, DemoProfile, DemoRoom } from "@/types/journey";

interface TodayState {
  profile: DemoProfile | null;
  room: DemoRoom | null;
  starter: CoachReply | null;
}

function greeting(): string {
  const hour = new Date().getHours();
  return hour < 12
    ? "Good morning"
    : hour < 17
      ? "Good afternoon"
      : "Good evening";
}

export function TodayDashboard() {
  const [state, setState] = useState<TodayState | null>(null);

  useEffect(() => {
    void Promise.resolve().then(() =>
      setState({
        profile: readDemoProfile(),
        room: readDemoRoom(),
        starter: readStarterReply(),
      }),
    );
  }, []);

  const profile = state?.profile ?? state?.room?.profile ?? null;
  const room = state?.room ?? null;
  const tasks = room?.tasks ?? state?.starter?.tasks ?? [];
  const doneCount =
    room?.tasks.filter((task) => room.doneIds.includes(task.id)).length ?? 0;
  const remainingMinutes = room
    ? Math.ceil(remainingRoomSeconds(room) / 60)
    : 0;
  const roomIsToday = room
    ? new Date(room.createdAt).toDateString() === new Date().toDateString()
    : false;
  const pace = profile?.pace
    ? profile.pace.charAt(0).toUpperCase() + profile.pace.slice(1)
    : null;

  return (
    <AppShell
      active="Today"
      studentName={profile?.name}
      grade={profile?.grade}
      board={profile?.board}
    >
      <main className="today-page">
        <header className="today-heading">
          <span className="today-eyebrow">
            <Sparkles aria-hidden="true" /> YOUR DAY
          </span>
          <h1>
            {profile
              ? greeting() + ", " + profile.name + "."
              : "Plan your study day."}
          </h1>
          <p>
            {room
              ? "Pick up your chosen work when you are ready."
              : "Start with a question and build a plan around your time."}
          </p>
        </header>

        <div className="today-layout">
          <section
            className="today-plan-card"
            aria-labelledby="today-plan-title"
          >
            <div className="today-plan-top">
              <span className="today-plan-icon">
                {room ? (
                  <Clock3 aria-hidden="true" />
                ) : (
                  <MessageSquare aria-hidden="true" />
                )}
              </span>
              <span className="today-plan-kicker">
                {room
                  ? roomIsToday
                    ? "YOUR STUDY ROOM"
                    : "YOUR LAST STUDY ROOM"
                  : "YOUR NEXT STEP"}
              </span>
              <h2 id="today-plan-title">
                {room
                  ? room.ended
                    ? "Your session has ended"
                    : "Your plan is ready"
                  : state?.starter
                    ? "A place to start"
                    : profile
                      ? "What would you like to work on?"
                      : "Make a plan that fits you"}
              </h2>
              <p>
                {room
                  ? doneCount +
                    " of " +
                    room.tasks.length +
                    " tasks marked done" +
                    (room.ended
                      ? "."
                      : " · " + remainingMinutes + " min on your timer.")
                  : state?.starter
                    ? "Coach has suggested a starting direction. Choose the tasks that matter to you."
                    : profile
                      ? "Tell Coach what you need help with, then choose your study tasks."
                      : "Share your class, board, and pace to get started."}
              </p>
              <Link
                href={
                  room && !room.ended ? "/study" : profile ? "/coach" : "/start"
                }
                className="today-primary"
              >
                {room && !room.ended
                  ? "Continue studying"
                  : profile
                    ? room
                      ? "Plan another session"
                      : "Ask Coach"
                    : "Get started"}
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>

            {tasks.length ? (
              <div className="today-tasks">
                <div className="today-tasks-heading">
                  <h3>
                    {room ? "Your chosen tasks" : "Suggested starting points"}
                  </h3>
                  <span>
                    {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
                  </span>
                </div>
                <ol>
                  {tasks.map((task) => {
                    const done = room?.doneIds.includes(task.id) ?? false;
                    return (
                      <li key={task.id}>
                        <span
                          className={
                            done
                              ? "today-task-status is-done"
                              : "today-task-status"
                          }
                        >
                          {done ? (
                            <CheckCircle2 aria-hidden="true" />
                          ) : (
                            <Circle aria-hidden="true" />
                          )}
                        </span>
                        <div>
                          <strong>{task.title}</strong>
                          <p>
                            {task.minutes} min · {task.reason}
                          </p>
                          {task.sourceName ? (
                            <small>From {task.sourceName}</small>
                          ) : null}
                        </div>
                        {done ? (
                          <span className="today-task-done">Done</span>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              </div>
            ) : (
              <div className="today-tasks-empty">
                Your plan will appear here after you choose it with Coach.
              </div>
            )}
          </section>

          <aside className="today-rail">
            <section className="today-rail-card is-mint">
              <span className="today-rail-icon">
                <Sparkles aria-hidden="true" />
              </span>
              <h2>Your pace</h2>
              <p>
                {pace
                  ? "You chose a " +
                    profile?.pace +
                    " pace. You can adjust it anytime."
                  : "Choose a pace that works for your day."}
              </p>
              <Link href="/start">
                {pace ? "Change pace" : "Set up your plan"}{" "}
                <ArrowRight aria-hidden="true" />
              </Link>
            </section>
            <section className="today-rail-card is-amber">
              <span className="today-rail-icon">
                <BookOpen aria-hidden="true" />
              </span>
              <h2>Your material</h2>
              <p>
                Add notes or a worksheet for questions grounded in what you
                study.
              </p>
              <Link href="/library">
                Open Library <ArrowRight aria-hidden="true" />
              </Link>
            </section>
          </aside>
        </div>
      </main>
    </AppShell>
  );
}
