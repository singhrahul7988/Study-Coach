"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { readDemoProfile, saveDemoProfile } from "@/lib/demoJourney";
import { demoProfileSchema, type DemoProfile } from "@/types/journey";

const paces: {
  value: DemoProfile["pace"];
  title: string;
  description: string;
}[] = [
  {
    value: "gentle",
    title: "Gentle",
    description: "20 minute focus",
  },
  {
    value: "steady",
    title: "Steady",
    description: "35 minute focus",
  },
  {
    value: "focused",
    title: "Focused",
    description: "50 minute focus",
  },
];

export default function StartPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [board, setBoard] = useState("");
  const [examEnabled, setExamEnabled] = useState(false);
  const [exam, setExam] = useState<DemoProfile["entranceExam"]>("JEE");
  const [pace, setPace] = useState<DemoProfile["pace"]>("steady");
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    void Promise.resolve().then(() => {
      const saved = readDemoProfile();
      if (!saved) return;
      setName(saved.name);
      setGrade(String(saved.grade));
      setBoard(saved.board);
      setExamEnabled(Boolean(saved.entranceExam));
      if (saved.entranceExam) setExam(saved.entranceExam);
      setPace(saved.pace);
      setEditing(true);
    });
  }, []);

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const result = demoProfileSchema.safeParse({
      name,
      grade: Number(grade),
      board,
      entranceExam: examEnabled ? exam : null,
      pace,
    });
    if (!result.success) {
      setError("Add your name, class, board, and pace to continue.");
      return;
    }
    saveDemoProfile(result.data);
    router.push("/curating");
  }

  return (
    <main className="start-page">
      <section className="start-aside" aria-label="About your study plan">
        <Link href="/choose" className="start-back">
          <ArrowLeft aria-hidden="true" /> Back
        </Link>
        <div className="start-brand">
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
        <span className="start-step">01 / 03 · Your starting point</span>
        <h1>Let&apos;s make this yours.</h1>
        <p>Your class and pace help shape a study session that fits you.</p>
      </section>
      <section className="start-form-panel">
        <form onSubmit={submit} className="start-form">
          <div className="start-form-heading">
            <span>STUDENT SETUP</span>
            <h2>Where are you starting?</h2>
            <p>Choose the pace that feels useful today.</p>
          </div>
          <label className="start-field">
            <span>Your name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="What should we call you?"
              maxLength={40}
              required
            />
          </label>
          <div className="start-field-row">
            <label className="start-field">
              <span>Class</span>
              <select
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
                required
              >
                <option value="">Choose class</option>
                {[6, 7, 8, 9, 10, 11, 12].map((value) => (
                  <option key={value} value={value}>
                    Class {value}
                  </option>
                ))}
              </select>
            </label>
            <label className="start-field">
              <span>Board</span>
              <select
                value={board}
                onChange={(event) => setBoard(event.target.value)}
                required
              >
                <option value="">Choose board</option>
                <option>CBSE</option>
                <option>ICSE</option>
                <option>State board</option>
                <option>Other</option>
              </select>
            </label>
          </div>
          <div className="start-exam">
            <label className="start-check">
              <input
                type="checkbox"
                checked={examEnabled}
                onChange={(event) => setExamEnabled(event.target.checked)}
              />
              <span className="start-check-box">
                <Check aria-hidden="true" />
              </span>
              <span>
                <strong>Preparing for an entrance exam?</strong>
                <small>Optional · add this alongside board study</small>
              </span>
            </label>
            {examEnabled ? (
              <label className="start-field start-exam-select">
                <span>Entrance exam</span>
                <select
                  value={exam ?? "JEE"}
                  onChange={(event) =>
                    setExam(event.target.value as DemoProfile["entranceExam"])
                  }
                >
                  <option>JEE</option>
                  <option>NEET</option>
                  <option>Other</option>
                </select>
              </label>
            ) : null}
          </div>
          <fieldset className="start-pace">
            <legend>Your pace</legend>
            <div className="start-pace-options">
              {paces.map((option) => (
                <label
                  key={option.value}
                  className={
                    "start-pace-option start-pace-option-" +
                    option.value +
                    (pace === option.value ? " is-selected" : "")
                  }
                >
                  <input
                    type="radio"
                    name="pace"
                    value={option.value}
                    checked={pace === option.value}
                    onChange={() => setPace(option.value)}
                  />
                  <span className="start-pace-dot" />
                  <strong>{option.title}</strong>
                  <small>{option.description}</small>
                </label>
              ))}
            </div>
          </fieldset>
          {error ? (
            <p className="start-error" role="alert">
              {error}
            </p>
          ) : null}
          {editing ? (
            <p className="start-update-note">
              Saving changes will start a new plan.
            </p>
          ) : null}
          <button className="start-submit" type="submit">
            Create my starting plan <ArrowRight aria-hidden="true" />
          </button>
        </form>
      </section>
    </main>
  );
}
