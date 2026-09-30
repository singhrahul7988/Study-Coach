import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  CirclePlay,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Ranjan Sir | Your preparation, understood",
};

export default function LandingPage() {
  return (
    <main className="landing-page">
      <div className="landing-orbit landing-orbit-one" aria-hidden="true" />
      <div className="landing-orbit landing-orbit-two" aria-hidden="true" />
      <div className="landing-dots" aria-hidden="true" />
      <div className="landing-content">
        <div className="landing-mark" aria-label="Ranjan Sir">
          <span className="brand-icon">
            <Image
              src="/brand/ranjan-sir-portrait.png"
              alt=""
              width={1277}
              height={1231}
              priority
              className="brand-portrait"
            />
          </span>
          <span>Ranjan Sir</span>
        </div>
        <div className="landing-copy">
          <span className="landing-eyebrow">
            <Sparkles aria-hidden="true" /> A study coach that starts with you
          </span>
          <h1>Your preparation, understood.</h1>
          <p>
            Start with your class and pace. Ask what you need help with, then
            turn your question into a focused study room using your own
            material.
          </p>
          <Link href="/choose" className="landing-cta">
            Get started <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="landing-showcase" aria-hidden="true">
        <div className="landing-showcase-halo" />
        <div className="landing-showcase-orbit" />
        <span className="landing-showcase-dot landing-showcase-dot-one" />
        <span className="landing-showcase-dot landing-showcase-dot-two" />
        <div className="landing-showcase-rays">
          <span />
          <span />
          <span />
        </div>

        <div className="landing-showcase-card landing-showcase-plan">
          <div className="landing-showcase-card-heading">
            <span className="landing-showcase-heading-icon">
              <CalendarDays />
            </span>
            <strong>Plan your day</strong>
          </div>
          <div className="landing-showcase-plan-steps">
            <div className="landing-showcase-plan-step">
              <span className="landing-showcase-step-icon is-blue">
                <MessageSquare />
              </span>
              <span>
                <strong>Ask Coach a question</strong>
                <small>Start with what you need</small>
              </span>
            </div>
            <div className="landing-showcase-plan-step">
              <span className="landing-showcase-step-icon">
                <Check />
              </span>
              <span>
                <strong>Choose your focus</strong>
                <small>Keep the tasks that fit</small>
              </span>
            </div>
            <div className="landing-showcase-plan-step">
              <span className="landing-showcase-step-icon">
                <CirclePlay />
              </span>
              <span>
                <strong>Enter your study room</strong>
                <small>Learn at your pace</small>
              </span>
            </div>
          </div>
        </div>

        <div className="landing-showcase-card landing-showcase-progress">
          <div className="landing-showcase-card-heading">
            <span className="landing-showcase-heading-icon">
              <BarChart3 />
            </span>
            <strong>Your progress</strong>
          </div>
          <div className="landing-showcase-progress-content">
            <span className="landing-showcase-progress-emblem">
              <Check />
            </span>
            <span>
              <strong>See your work add up</strong>
              <small>Track tasks you finish</small>
              <span className="landing-showcase-progress-tags">
                <span>Tasks</span>
                <span>Study rooms</span>
              </span>
            </span>
          </div>
        </div>

        <div className="landing-showcase-card landing-showcase-library">
          <span className="landing-showcase-library-icon">
            <BookOpen />
          </span>
          <span>
            <strong>Study with your material</strong>
            <small>Bring notes and worksheets</small>
          </span>
          <ArrowRight className="landing-showcase-library-arrow" />
        </div>
      </div>
    </main>
  );
}
