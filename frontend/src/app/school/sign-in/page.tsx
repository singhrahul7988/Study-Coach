"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  ClipboardList,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useState, type FormEvent } from "react";

export default function SchoolSignInPage() {
  const [notice, setNotice] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setNotice(true);
  }

  return (
    <main className="school-login">
      <section className="school-login-aside">
        <Link className="school-text-link" href="/choose">
          <ArrowLeft aria-hidden="true" /> Back to choices
        </Link>
        <div className="school-login-aside-copy">
          <span className="school-login-brand">
            <Image
              src="/brand/ranjan-sir-portrait.png"
              alt=""
              width={46}
              height={46}
            />{" "}
            Ranjan Sir
          </span>
          <span className="school-kicker">SCHOOL CONNECTED STUDY</span>
          <h1>Your school day and study time, together.</h1>
          <p>
            School shared learning updates can help your coach choose a useful
            next step without overloading your evening.
          </p>
          <div className="school-login-benefits">
            <span>
              <ClipboardList aria-hidden="true" /> Recent tests and their topics
            </span>
            <span>
              <CalendarDays aria-hidden="true" /> A schedule shaped around your
              week
            </span>
            <span>
              <ShieldCheck aria-hidden="true" /> Context you can review and
              correct
            </span>
          </div>
        </div>
      </section>
      <section className="school-login-panel">
        <div className="school-login-form-wrap">
          <span className="school-kicker">SCHOOL SIGN IN</span>
          <h2>Welcome back.</h2>
          <p>Use the ID and password provided by your school.</p>
          <p className="school-login-preview-warning">
            <LockKeyhole aria-hidden="true" /> Design preview: please don&apos;t
            enter a real password yet.
          </p>
          <form className="school-login-form" onSubmit={handleSubmit}>
            <label>
              <span>School ID / roll number</span>
              <input
                name="schoolId"
                type="text"
                autoComplete="username"
                placeholder="Enter your school ID"
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />
            </label>
            <button type="submit" className="school-primary-button">
              Sign in <ArrowRight aria-hidden="true" />
            </button>
          </form>
          {notice ? (
            <p className="school-login-notice" role="status">
              School sign-in is still a design preview. No credentials were sent
              or saved.
            </p>
          ) : null}

          <div className="school-login-divider">
            <span>For school teams</span>
          </div>
          <Link className="school-secondary-button" href="/school/overview">
            <Building2 aria-hidden="true" /> Explore management preview{" "}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
