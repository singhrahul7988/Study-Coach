import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

export const metadata = { title: "Choose your path | Ranjan Sir" };

export default function ChoosePage() {
  return (
    <main className="school-entry">
      <div className="school-entry-glow" aria-hidden="true" />
      <header className="school-entry-header">
        <Link
          className="school-entry-brand"
          href="/"
          aria-label="Ranjan Sir home"
        >
          <Image
            src="/brand/ranjan-sir-portrait.png"
            alt=""
            width={44}
            height={44}
          />
          <span>Ranjan Sir</span>
        </Link>
        <Link className="school-text-link" href="/">
          <ArrowLeft aria-hidden="true" /> Back
        </Link>
      </header>
      <div className="school-entry-content">
        <div className="school-entry-intro">
          <span className="school-kicker">YOUR STARTING POINT</span>
          <h1>How will you study with Ranjan Sir?</h1>
          <p>
            Choose the space that fits you. You can start independently or use
            the learning context your school provides.
          </p>
        </div>
        <div className="school-path-grid">
          <Link href="/start" className="school-path-card">
            <span className="school-path-icon">
              <GraduationCap aria-hidden="true" />
            </span>
            <span className="school-path-body">
              <span className="school-path-label">FOR STUDENTS</span>
              <strong>I&apos;m studying on my own</strong>
              <span>
                Set your class, board, and pace. Bring your own notes to build a
                plan around your goals.
              </span>
            </span>
            <span className="school-path-foot">
              <span>
                <BookOpen aria-hidden="true" /> Your materials, your pace
              </span>
              <ArrowRight aria-hidden="true" />
            </span>
          </Link>
          <Link
            href="/school/sign-in"
            className="school-path-card school-path-card-featured"
          >
            <span className="school-path-icon">
              <Building2 aria-hidden="true" />
            </span>
            <span className="school-path-body">
              <span className="school-path-label">WITH YOUR SCHOOL</span>
              <strong>My school works with Ranjan Sir</strong>
              <span>
                Sign in with your school ID. Your study plan can use school
                shared tests, topics, attendance, and updates when connected.
              </span>
            </span>
            <span className="school-path-foot">
              <span>
                <CalendarDays aria-hidden="true" /> A plan that knows your week
              </span>
              <ArrowRight aria-hidden="true" />
            </span>
          </Link>
        </div>
        <p className="school-entry-note">
          <ShieldCheck aria-hidden="true" /> School data is used only after your
          school connects it and access is set up.
        </p>
      </div>
    </main>
  );
}
