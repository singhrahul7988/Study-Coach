"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock3,
  ListChecks,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  readDemoProfile,
  readDemoRoom,
  remainingRoomSeconds,
} from "@/lib/demoJourney";
import type { DemoProfile, DemoRoom } from "@/types/journey";

interface ProgressState {
  profile: DemoProfile | null;
  room: DemoRoom | null;
}

export function ProgressScreen() {
  const [state, setState] = useState<ProgressState | null>(null);

  useEffect(() => {
    void Promise.resolve().then(() =>
      setState({ profile: readDemoProfile(), room: readDemoRoom() }),
    );
  }, []);

  const room = state?.room ?? null;
  const profile = state?.profile ?? room?.profile ?? null;
  const completed =
    room?.tasks.filter((task) => room.doneIds.includes(task.id)).length ?? 0;
  const remainingMinutes = room
    ? Math.ceil(remainingRoomSeconds(room) / 60)
    : 0;

  return (
    <AppShell
      active="Progress"
      studentName={profile?.name}
      grade={profile?.grade}
      board={profile?.board}
    >
      <main className="progress-page progress-live">
        <header className="progress-live-heading">
          <span className="progress-live-eyebrow">
            <Sparkles aria-hidden="true" /> YOUR WORK
          </span>
          <h1>Your progress.</h1>
          <p>See the tasks you chose and marked complete.</p>
        </header>

        {room ? (
          <>
            <div
              className="progress-live-summary"
              aria-label="Study room activity"
            >
              <div>
                <span className="progress-live-summary-icon is-mint">
                  <CheckCircle2 aria-hidden="true" />
                </span>
                <small>Tasks finished</small>
                <strong>
                  {completed} of {room.tasks.length}
                </strong>
              </div>
              <div>
                <span className="progress-live-summary-icon is-violet">
                  <ListChecks aria-hidden="true" />
                </span>
                <small>Tasks chosen</small>
                <strong>{room.tasks.length}</strong>
              </div>
              <div>
                <span className="progress-live-summary-icon is-amber">
                  <Clock3 aria-hidden="true" />
                </span>
                <small>{room.ended ? "Session" : "Time on your timer"}</small>
                <strong>
                  {room.ended ? "Ended" : remainingMinutes + " min left"}
                </strong>
              </div>
            </div>

            <div className="progress-live-layout">
              <section
                className="progress-live-activity"
                aria-labelledby="progress-activity-title"
              >
                <div className="progress-live-section-head">
                  <div>
                    <span>LAST STUDY ROOM</span>
                    <h2 id="progress-activity-title">Your task activity</h2>
                  </div>
                  <Link href={room.ended ? "/coach" : "/study"}>
                    {room.ended ? "Plan again" : "Continue studying"}{" "}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
                <ol>
                  {room.tasks.map((task) => {
                    const done = room.doneIds.includes(task.id);
                    return (
                      <li key={task.id}>
                        <span
                          className={
                            done
                              ? "progress-live-task-icon is-done"
                              : "progress-live-task-icon"
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
                            <small>Source: {task.sourceName}</small>
                          ) : null}
                        </div>
                        <span
                          className={
                            done
                              ? "progress-live-task-state is-done"
                              : "progress-live-task-state"
                          }
                        >
                          {done ? "Done" : "To do"}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </section>

              <aside className="progress-live-side">
                <span className="progress-live-side-icon">
                  <BookOpen aria-hidden="true" />
                </span>
                <h2>Study from your sources</h2>
                <p>
                  Open your notes and worksheets for practice you can check
                  against the original.
                </p>
                <Link href="/library">
                  Open Library <ArrowRight aria-hidden="true" />
                </Link>
                <small>
                  Quiz answers are self-checks. They do not count as graded
                  results.
                </small>
              </aside>
            </div>
          </>
        ) : (
          <div className="progress-live-empty">
            <span className="progress-live-empty-icon">
              <MessageSquare aria-hidden="true" />
            </span>
            <h2>Your progress starts with a study room.</h2>
            <p>
              Ask Coach what to study, choose your tasks, and mark each one done
              as you work.
            </p>
            <Link href={profile ? "/coach" : "/start"}>
              {profile ? "Ask Coach" : "Get started"}{" "}
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        )}
      </main>
    </AppShell>
  );
}
