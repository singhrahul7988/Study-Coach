"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Award,
  BookOpenCheck,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Flame,
  ImagePlus,
  Target,
  TrendingUp,
  UserRound,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { AppShell } from "@/components/AppShell";
import {
  readCompletedTasks,
  readDemoAvatar,
  readDemoProfile,
  saveDemoAvatar,
  updateDemoProfile,
  type CompletedTask,
} from "@/lib/demoJourney";
import { readDemoEmail, saveDemoEmail } from "@/lib/demoServiceKeys";
import { demoProfileSchema, type DemoProfile } from "@/types/journey";

interface ProfileState {
  profile: DemoProfile;
  email: string;
  completed: CompletedTask[];
}

type ActivityPeriod = "recent" | "all";
const paceLabels: Record<DemoProfile["pace"], string> = {
  gentle: "Gentle / 20 min",
  steady: "Steady / 35 min",
  focused: "Focused / 50 min",
};

function finishedRooms(items: CompletedTask[]) {
  const rooms = new Map<number, CompletedTask[]>();
  for (const item of items) {
    rooms.set(item.roomId, [...(rooms.get(item.roomId) ?? []), item]);
  }
  return [...rooms.values()]
    .filter(
      (tasks) =>
        new Set(tasks.map((task) => task.taskId)).size >= tasks[0].taskCount,
    )
    .map((tasks) => Math.max(...tasks.map((task) => task.completedAt)));
}

function uniqueDays(items: CompletedTask[]) {
  return new Set(items.map((item) => new Date(item.completedAt).toDateString()))
    .size;
}

export function ProfilePageScreen() {
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [state, setState] = useState<ProfileState | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState(9);
  const [board, setBoard] = useState<DemoProfile["board"]>("CBSE");
  const [entranceExam, setEntranceExam] =
    useState<DemoProfile["entranceExam"]>(null);
  const [pace, setPace] = useState<DemoProfile["pace"]>("steady");
  const [goal, setGoal] = useState<DemoProfile["goal"]>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [period, setPeriod] = useState<ActivityPeriod>("recent");
  const [referenceTime, setReferenceTime] = useState(0);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const badgeTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) return;
      try {
        const profile = readDemoProfile();
        const currentEmail = readDemoEmail();
        const completed = readCompletedTasks();
        if (profile) {
          setState({ profile, email: currentEmail, completed });
          setName(profile.name);
          setEmail(currentEmail);
          setGrade(profile.grade);
          setBoard(profile.board);
          setEntranceExam(profile.entranceExam);
          setPace(profile.pace);
          setGoal(profile.goal ?? null);
          setAvatar(readDemoAvatar());
        }
      } catch {
        setLoadError(true);
      } finally {
        setReferenceTime(Date.now());
        setLoaded(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = demoProfileSchema.safeParse({
      name,
      grade,
      board,
      entranceExam,
      pace,
      goal,
    });
    if (
      !result.success ||
      (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    ) {
      setError("Check your name, email, class, and study choices.");
      setSaved(false);
      return;
    }
    updateDemoProfile(result.data);
    saveDemoEmail(email.trim());
    setState((current) =>
      current
        ? { ...current, profile: result.data, email: email.trim() }
        : current,
    );
    setError("");
    setSaved(true);
    setEditing(false);
    window.dispatchEvent(new Event("ranjan-demo-profile-updated"));
  }

  function cancelEdit() {
    if (!state) return;
    setName(state.profile.name);
    setEmail(state.email);
    setGrade(state.profile.grade);
    setBoard(state.profile.board);
    setEntranceExam(state.profile.entranceExam);
    setPace(state.profile.pace);
    setGoal(state.profile.goal ?? null);
    setError("");
    setSaved(false);
    setEditing(false);
  }

  function scrollBadges(direction: -1 | 1) {
    const track = badgeTrackRef.current;
    const card = track?.querySelector<HTMLElement>(".profile-badge-card");
    if (!track || !card) return;
    const gap = Number.parseFloat(window.getComputedStyle(track).gap) || 0;
    track.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: "smooth",
    });
  }
  function changePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 1_000_000
    ) {
      setPhotoError("Choose a PNG, JPG, or WebP image under 1 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      setAvatar(reader.result);
      saveDemoAvatar(reader.result);
      setPhotoError("");
    };
    reader.onerror = () => setPhotoError("That photo could not be opened.");
    reader.readAsDataURL(file);
  }

  const completed = state?.completed ?? [];
  const taskCount = completed.length;
  const studyDays = uniqueDays(completed);
  const roomFinishTimes = finishedRooms(completed);
  const roomCount = new Set(completed.map((item) => item.roomId)).size;
  const recentStart = referenceTime - 28 * 86_400_000;
  const viewed =
    period === "recent"
      ? completed.filter((item) => item.completedAt >= recentStart)
      : completed;
  const viewedRooms =
    period === "recent"
      ? roomFinishTimes.filter((time) => time >= recentStart)
      : roomFinishTimes;
  const latestActivity = completed.length
    ? new Date(Math.max(...completed.map((item) => item.completedAt)))
    : null;
  const lastActivity =
    latestActivity && !Number.isNaN(latestActivity.getTime())
      ? new Intl.DateTimeFormat("en", {
          day: "numeric",
          month: "short",
        }).format(latestActivity)
      : "None yet";
  const weeklyCounts = [3, 2, 1, 0].map(
    (weeksAgo) =>
      completed.filter((item) => {
        const age = referenceTime - item.completedAt;
        return (
          age >= weeksAgo * 7 * 86_400_000 &&
          age < (weeksAgo + 1) * 7 * 86_400_000
        );
      }).length,
  );
  const maxWeeklyCount = Math.max(1, ...weeklyCounts);
  const badges = [
    {
      title: "First step",
      detail: "Finish your first study task.",
      current: Math.min(taskCount, 1),
      target: 1,
      unit: "task",
      icon: Check,
      tone: "blue",
    },
    {
      title: "Steady learner",
      detail: "Study on three different days.",
      current: Math.min(studyDays, 3),
      target: 3,
      unit: "days",
      icon: CalendarDays,
      tone: "violet",
    },
    {
      title: "Practice builder",
      detail: "Finish five study tasks.",
      current: Math.min(taskCount, 5),
      target: 5,
      unit: "tasks",
      icon: Target,
      tone: "amber",
    },
    {
      title: "Plan finisher",
      detail: "Finish every task in one room.",
      current: Math.min(roomFinishTimes.length, 1),
      target: 1,
      unit: "room",
      icon: BookOpenCheck,
      tone: "teal",
    },
    {
      title: "Room explorer",
      detail: "Work in three study rooms.",
      current: Math.min(roomCount, 3),
      target: 3,
      unit: "rooms",
      icon: Award,
      tone: "coral",
    },
    {
      title: "Learning habit",
      detail: "Study on seven different days.",
      current: Math.min(studyDays, 7),
      target: 7,
      unit: "days",
      icon: Flame,
      tone: "blue",
    },
    {
      title: "Ten tasks",
      detail: "Finish ten study tasks.",
      current: Math.min(taskCount, 10),
      target: 10,
      unit: "tasks",
      icon: Check,
      tone: "violet",
    },
  ];
  const earnedCount = badges.filter(
    (badge) => badge.current >= badge.target,
  ).length;
  const snapshot = [
    {
      label: "Tasks completed",
      value: String(viewed.length),
      icon: CircleCheck,
      tone: "blue",
    },
    {
      label: "Study days",
      value: String(uniqueDays(viewed)),
      icon: CalendarDays,
      tone: "violet",
    },
    {
      label: "Plans finished",
      value: String(viewedRooms.length),
      icon: BookOpenCheck,
      tone: "teal",
    },
  ];

  return (
    <AppShell
      active="Profile"
      studentName={state?.profile.name}
      grade={state?.profile.grade}
      board={state?.profile.board}
    >
      <main className="account-page profile-page">
        <div className="account-page-inner profile-container">
          <div className="profile-title-row">
            <header className="account-heading">
              <div className="account-eyebrow">
                <UserRound aria-hidden="true" /> YOUR SPACE
              </div>
              <h1>My profile</h1>
              <p>Your study details and the work you&apos;ve completed.</p>
            </header>
          </div>
          {!loaded ? (
            <p className="account-loading">Loading your profile...</p>
          ) : loadError ? (
            <section className="account-card account-empty" role="alert">
              <h2>We couldn&apos;t open your profile</h2>
              <p>Refresh the page to try again.</p>
              <button
                type="button"
                className="account-primary"
                onClick={() => window.location.reload()}
              >
                Refresh profile
              </button>
            </section>
          ) : !state ? (
            <section className="account-card account-empty">
              <h2>Start your study journey</h2>
              <p>Add your details to create a profile.</p>
              <Link href="/start" className="account-primary">
                Get started
              </Link>
            </section>
          ) : (
            <>
              <section
                className="account-card profile-overview"
                aria-label="Profile summary"
              >
                <div className="profile-person">
                  <span className="profile-large-avatar" aria-hidden="true">
                    {avatar ? (
                      <Image
                        src={avatar}
                        alt=""
                        width={64}
                        height={64}
                        unoptimized
                      />
                    ) : (
                      state.profile.name.charAt(0).toUpperCase()
                    )}
                  </span>
                  <div className="profile-person-copy">
                    <h2>{state.profile.name}</h2>
                    <p>
                      Class {state.profile.grade} · {state.profile.board}
                    </p>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      aria-label="Choose profile photo"
                      onChange={changePhoto}
                    />
                    <div className="profile-photo-actions">
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                      >
                        <ImagePlus aria-hidden="true" /> Edit photo
                      </button>
                      {avatar ? (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatar(null);
                            saveDemoAvatar(null);
                          }}
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                    {photoError ? (
                      <small role="alert" className="profile-photo-error">
                        {photoError}
                      </small>
                    ) : null}
                  </div>
                </div>
              </section>

              <div className="profile-main-grid">
                <section
                  className="account-card profile-details"
                  aria-labelledby="profile-details-title"
                >
                  <div className="profile-card-heading">
                    <span className="profile-heading-icon">
                      <UserRound aria-hidden="true" />
                    </span>
                    <div>
                      <h2 id="profile-details-title">Your details</h2>
                      <p>Coach uses these choices to shape your study plan.</p>
                    </div>
                    {!editing ? (
                      <button
                        type="button"
                        className="profile-edit-button"
                        onClick={() => {
                          setSaved(false);
                          setEditing(true);
                        }}
                      >
                        Edit details
                      </button>
                    ) : null}
                  </div>
                  {editing ? (
                    <form onSubmit={save} className="profile-form">
                      <div className="account-fields profile-fields">
                        <label>
                          <span>Name</span>
                          <input
                            value={name}
                            onChange={(event) => {
                              setName(event.target.value);
                              setSaved(false);
                            }}
                            maxLength={40}
                            required
                          />
                        </label>
                        <label>
                          <span>
                            Email <small>optional</small>
                          </span>
                          <input
                            type="email"
                            value={email}
                            onChange={(event) => {
                              setEmail(event.target.value);
                              setSaved(false);
                            }}
                            maxLength={160}
                            placeholder="you@example.com"
                          />
                        </label>
                        <label>
                          <span>Class</span>
                          <select
                            value={grade}
                            onChange={(event) => {
                              setGrade(Number(event.target.value));
                              setSaved(false);
                            }}
                          >
                            {[6, 7, 8, 9, 10, 11, 12].map((value) => (
                              <option key={value} value={value}>
                                Class {value}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          <span>Board</span>
                          <select
                            value={board}
                            onChange={(event) => {
                              setBoard(
                                event.target.value as DemoProfile["board"],
                              );
                              setSaved(false);
                            }}
                          >
                            {["CBSE", "ICSE", "State board", "Other"].map(
                              (value) => (
                                <option key={value}>{value}</option>
                              ),
                            )}
                          </select>
                        </label>
                        <label>
                          <span>
                            Entrance exam <small>optional</small>
                          </span>
                          <select
                            value={entranceExam ?? ""}
                            onChange={(event) => {
                              setEntranceExam(
                                (event.target.value ||
                                  null) as DemoProfile["entranceExam"],
                              );
                              setSaved(false);
                            }}
                          >
                            <option value="">Boards only</option>
                            <option>JEE</option>
                            <option>NEET</option>
                            <option>Other</option>
                          </select>
                        </label>
                        <label>
                          <span>Study pace</span>
                          <select
                            value={pace}
                            onChange={(event) => {
                              setPace(
                                event.target.value as DemoProfile["pace"],
                              );
                              setSaved(false);
                            }}
                          >
                            <option value="gentle">Gentle / 20 min</option>
                            <option value="steady">Steady / 35 min</option>
                            <option value="focused">Focused / 50 min</option>
                          </select>
                        </label>
                        <label className="profile-goal-field">
                          <span>
                            Goal <small>optional</small>
                          </span>
                          <select
                            value={goal ?? ""}
                            onChange={(event) => {
                              setGoal(
                                (event.target.value ||
                                  null) as DemoProfile["goal"],
                              );
                              setSaved(false);
                            }}
                          >
                            <option value="">Choose a personal goal</option>
                            <option>Improve overall performance</option>
                            <option>Prepare for exams</option>
                            <option>Build a steady routine</option>
                            <option>Understand difficult topics</option>
                          </select>
                        </label>
                      </div>
                      {state.profile.grade !== grade ||
                      state.profile.board !== board ||
                      state.profile.entranceExam !== entranceExam ||
                      state.profile.pace !== pace ? (
                        <p className="account-note">
                          Changing study choices starts a new plan and clears
                          the current study room.
                        </p>
                      ) : null}
                      <div className="profile-form-footer">
                        <span role="status">
                          {error || (saved ? "Profile saved." : "")}
                        </span>
                        <button
                          type="button"
                          className="profile-text-button"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="account-primary">
                          Save profile
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <dl className="profile-detail-list">
                        <div>
                          <dt>Class</dt>
                          <dd>Class {state.profile.grade}</dd>
                        </div>
                        <div>
                          <dt>Board</dt>
                          <dd>{state.profile.board}</dd>
                        </div>
                        <div>
                          <dt>Entrance exam</dt>
                          <dd>{state.profile.entranceExam ?? "Boards only"}</dd>
                        </div>
                        <div>
                          <dt>Study pace</dt>
                          <dd>{paceLabels[state.profile.pace]}</dd>
                        </div>
                        <div>
                          <dt>Email</dt>
                          <dd className={!state.email ? "is-empty" : undefined}>
                            {state.email || "Not added"}
                          </dd>
                        </div>
                        <div>
                          <dt>Goal</dt>
                          <dd
                            className={
                              !state.profile.goal ? "is-empty" : undefined
                            }
                          >
                            {state.profile.goal || "Not set"}
                          </dd>
                        </div>
                      </dl>
                      {saved ? (
                        <p className="profile-saved" role="status">
                          Profile saved.
                        </p>
                      ) : null}
                    </>
                  )}
                </section>

                <section
                  className="account-card profile-activity"
                  aria-labelledby="profile-activity-title"
                >
                  <div className="profile-card-heading profile-activity-heading">
                    <span className="profile-heading-icon">
                      <TrendingUp aria-hidden="true" />
                    </span>
                    <div>
                      <h2 id="profile-activity-title">Study activity</h2>
                      <p>Only work you&apos;ve marked complete is counted.</p>
                    </div>
                    {taskCount ? (
                      <select
                        aria-label="Activity period"
                        value={period}
                        onChange={(event) =>
                          setPeriod(event.target.value as ActivityPeriod)
                        }
                      >
                        <option value="recent">Last 4 weeks</option>
                        <option value="all">All time</option>
                      </select>
                    ) : null}
                  </div>
                  {taskCount ? (
                    <>
                      <div className="profile-snapshot-grid">
                        {snapshot.map((item) => (
                          <div
                            className="profile-snapshot-card"
                            key={item.label}
                          >
                            <span
                              className={
                                "profile-snapshot-icon is-" + item.tone
                              }
                            >
                              <item.icon aria-hidden="true" />
                            </span>
                            <div>
                              <span>{item.label}</span>
                              <strong>{item.value}</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="profile-weekly">
                        <div className="profile-weekly-copy">
                          <strong>Your study rhythm</strong>
                          <small>Tasks finished over the last four weeks</small>
                        </div>
                        <div
                          className="profile-weekly-chart"
                          aria-label={
                            "Weekly completed tasks: " + weeklyCounts.join(", ")
                          }
                        >
                          {weeklyCounts.map((count, index) => (
                            <div
                              className={
                                "profile-weekly-bar" +
                                (count ? "" : " is-empty")
                              }
                              key={index}
                            >
                              <span
                                style={{
                                  height: count
                                    ? Math.max(
                                        8,
                                        Math.round(
                                          (count / maxWeeklyCount) * 52,
                                        ),
                                      )
                                    : 4,
                                }}
                              />
                              <small>{["3w", "2w", "1w", "Now"][index]}</small>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="profile-last-activity">
                        Latest activity <strong>{lastActivity}</strong>
                      </p>
                    </>
                  ) : (
                    <div className="profile-activity-empty">
                      <span className="profile-empty-icon">
                        <CircleCheck aria-hidden="true" />
                      </span>
                      <h3>Your study history starts here</h3>
                      <p>Finish a task in a Study room to see your progress.</p>
                      <Link href="/coach" className="account-primary">
                        Ask Coach
                      </Link>
                    </div>
                  )}
                </section>
              </div>

              <section
                className="account-card profile-badges"
                aria-labelledby="profile-badges-title"
              >
                <div
                  className={
                    "profile-card-heading profile-badges-heading" +
                    (!taskCount ? " is-empty" : "")
                  }
                >
                  <span className="profile-heading-icon">
                    <Award aria-hidden="true" />
                  </span>
                  <div>
                    <h2 id="profile-badges-title">Milestones &amp; badges</h2>
                    <p>Earn badges as you finish study tasks.</p>
                  </div>
                  {taskCount ? (
                    <span className="profile-badge-count">
                      {earnedCount} of {badges.length} earned
                    </span>
                  ) : null}
                  {taskCount ? (
                    <div className="profile-badge-controls">
                      <button
                        type="button"
                        aria-label="Previous badges"
                        onClick={() => scrollBadges(-1)}
                      >
                        <ChevronLeft aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next badges"
                        onClick={() => scrollBadges(1)}
                      >
                        <ChevronRight aria-hidden="true" />
                      </button>
                    </div>
                  ) : null}
                </div>
                {taskCount ? (
                  <div className="profile-badge-track" ref={badgeTrackRef}>
                    {badges.map((badge) => {
                      const earned = badge.current >= badge.target;
                      return (
                        <article
                          className={
                            "profile-badge-card is-" +
                            badge.tone +
                            (!earned && !badge.current ? " is-locked" : "")
                          }
                          key={badge.title}
                        >
                          <span
                            className={"profile-badge-symbol is-" + badge.tone}
                          >
                            <badge.icon aria-hidden="true" />
                          </span>
                          <div className="profile-badge-content">
                            <span
                              className={
                                "profile-badge-status " +
                                (earned
                                  ? "is-earned"
                                  : badge.current
                                    ? "is-progress"
                                    : "is-locked")
                              }
                            >
                              {earned
                                ? "Earned"
                                : badge.current
                                  ? "In progress"
                                  : "Locked"}
                            </span>
                            <h3>{badge.title}</h3>
                            <p>{badge.detail}</p>
                            {earned ? (
                              <small className="profile-badge-earned-detail">
                                {badge.current} / {badge.target} {badge.unit}
                              </small>
                            ) : (
                              <div className="profile-badge-progress-row">
                                <div
                                  className="profile-badge-progress"
                                  aria-hidden="true"
                                >
                                  <span
                                    style={{
                                      width:
                                        Math.round(
                                          (badge.current / badge.target) * 100,
                                        ) + "%",
                                    }}
                                  />
                                </div>
                                <small>
                                  {badge.current} / {badge.target}
                                </small>
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="profile-badge-starter is-blue">
                    <span className="profile-badge-symbol">
                      <Award aria-hidden="true" />
                    </span>
                    <div>
                      <span className="profile-badge-status">Up next</span>
                      <strong>First step</strong>
                      <p>Complete one study task to earn your first badge.</p>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </AppShell>
  );
}
