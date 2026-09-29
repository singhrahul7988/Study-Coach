"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Check,
  GraduationCap,
  Gauge,
  MessageCircle,
  Sparkles,
  UserRound,
} from "lucide-react";
import {
  readDemoProfile,
  requestCoachReply,
  reviewedCoachSources,
  saveStarterReply,
} from "@/lib/demoJourney";
import type { DemoProfile } from "@/types/journey";

const steps = [
  { title: "Understanding your details", icon: UserRound },
  { title: "Setting your study pace", icon: Gauge },
  { title: "Checking your Library", icon: BookOpen },
  { title: "Building your starting plan", icon: Sparkles },
  { title: "Opening your Coach room", icon: MessageCircle },
] as const;

const paceLabels: Record<DemoProfile["pace"], string> = {
  gentle: "Gentle",
  steady: "Steady",
  focused: "Focused",
};

export default function CuratingPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<DemoProfile | null>(null);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [libraryUnavailable, setLibraryUnavailable] = useState(false);
  const [planUnavailable, setPlanUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    const startedAt = performance.now();
    const currentProfile = readDemoProfile();
    if (!currentProfile) {
      router.replace("/start");
      return;
    }
    async function finishStep(step: number, atLeastMs: number): Promise<void> {
      const remaining = atLeastMs - (performance.now() - startedAt);
      if (remaining > 0) {
        await new Promise<void>((resolve) =>
          window.setTimeout(resolve, remaining),
        );
      }
      if (active) setCompletedSteps(step);
    }

    async function curate(profile: DemoProfile): Promise<void> {
      await finishStep(1, 450);
      if (active) setProfile(profile);
      await finishStep(2, 950);
      let sources: Awaited<ReturnType<typeof reviewedCoachSources>> = [];
      try {
        sources = await reviewedCoachSources();
      } catch {
        if (active) setLibraryUnavailable(true);
      }
      await finishStep(3, 1550);
      try {
        const starter = await requestCoachReply(
          profile,
          "",
          sources,
          [],
          "starter",
        );
        saveStarterReply(starter);
      } catch {
        if (active) setPlanUnavailable(true);
      }
      await finishStep(4, 2750);
      await finishStep(5, 3650);
      await new Promise<void>((resolve) => window.setTimeout(resolve, 350));
      if (active) router.replace("/coach");
    }

    void curate(currentProfile);
    return () => {
      active = false;
    };
  }, [router]);

  const activeTitle =
    completedSteps >= steps.length
      ? "Your Coach room is ready"
      : completedSteps === 3 && planUnavailable
        ? "Preparing your Coach room"
        : completedSteps === 2 && libraryUnavailable
          ? "Continuing without Library material"
          : steps[completedSteps].title;
  const classLabel = profile
    ? "Class " + profile.grade + " · " + profile.board
    : "Your study details";
  const paceLabel = profile ? paceLabels[profile.pace] + " pace" : "Your pace";

  return (
    <main className="curating-page">
      <section
        className="curating-content"
        aria-label="Preparing your Coach session"
      >
        <header className="curating-header">
          <div className="curating-brand">
            <span className="brand-icon">
              <Image
                src="/brand/ranjan-sir-portrait.png"
                alt=""
                width={1277}
                height={1231}
                className="brand-portrait"
              />
            </span>
            <span>Ranjan Sir</span>
          </div>
          <span className="curating-step">Step 2 of 3</span>
        </header>

        <div className="curating-intro">
          <span className="curating-eyebrow">
            Personalising your study space
          </span>
          <h1>Getting your Coach ready</h1>
          <p>
            We&apos;re using your choices to prepare a useful place to start.
            You can change any suggestion later.
          </p>
        </div>

        <aside className="curating-context" aria-label="Your starting point">
          <span className="curating-context-icon" aria-hidden="true">
            <GraduationCap size={19} strokeWidth={1.9} />
          </span>
          <span className="curating-context-copy">
            <strong>{classLabel}</strong>
            <small>{paceLabel}</small>
          </span>
        </aside>

        <div className="curating-progress">
          <div className="curating-progress-label">
            <span>{activeTitle}</span>
            <span>
              {completedSteps} of {steps.length}
            </span>
          </div>
          <div
            className="curating-progress-track"
            role="progressbar"
            aria-label="Preparation progress"
            aria-valuemin={0}
            aria-valuemax={steps.length}
            aria-valuenow={completedSteps}
          >
            <span
              style={{
                width: (completedSteps / steps.length) * 100 + "%",
              }}
            />
          </div>
        </div>

        <ol className="curating-list" aria-label="Preparation steps">
          {steps.map(({ title, icon: Icon }, index) => {
            const isComplete = index < completedSteps;
            const isActive = index === completedSteps;
            const visibleTitle =
              index === 2 && libraryUnavailable
                ? "Continuing without Library material"
                : index === 3 && planUnavailable
                  ? "Preparing your Coach room"
                  : title;
            return (
              <li
                className={
                  "curating-item" +
                  (isComplete ? " is-complete" : "") +
                  (isActive ? " is-active" : "")
                }
                key={title}
                aria-current={isActive ? "step" : undefined}
              >
                <span className="curating-marker" aria-hidden="true">
                  {isComplete ? <Check size={16} strokeWidth={3} /> : index + 1}
                </span>
                <span className="curating-card">
                  <span className="curating-card-icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={1.9} />
                  </span>
                  <span className="curating-card-title">{visibleTitle}</span>
                </span>
              </li>
            );
          })}
        </ol>

        <p className="curating-footer">
          {planUnavailable
            ? "A starting suggestion isn't available right now. You can still ask Coach a question."
            : libraryUnavailable
              ? "Your Library couldn't be checked right now. You can add material later."
              : "Coach will open automatically when your starting point is ready."}
        </p>
        <span className="sr-only" role="status" aria-live="polite">
          {activeTitle}
        </span>
      </section>
    </main>
  );
}
