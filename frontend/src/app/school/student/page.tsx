import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  Clock3,
  FileQuestion,
  Info,
  Moon,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { SchoolShell } from "@/components/SchoolShell";

export const metadata = { title: "Student context preview | Ranjan Sir" };

export default function SchoolStudentPage() {
  return (
    <SchoolShell active="Student context">
      <main className="school-content school-student-content">
        <div className="school-page-heading">
          <div>
            <Link className="school-breadcrumb" href="/school/overview">
              <ArrowLeft aria-hidden="true" /> Management overview
            </Link>
            <span className="school-kicker">STUDENT CONTEXT</span>
            <h1>A plan that understands the whole week.</h1>
            <p>
              Bring assessment evidence, daily updates, and the student&apos;s
              own schedule into one reviewable picture.
            </p>
          </div>
          <span className="school-student-state">
            <UserRound aria-hidden="true" /> No student selected
          </span>
        </div>
        <div className="school-student-grid">
          <div className="school-student-column">
            <section
              className="school-panel school-student-profile"
              aria-labelledby="student-profile-title"
            >
              <div className="school-panel-heading">
                <span className="school-panel-icon">
                  <UserRound aria-hidden="true" />
                </span>
                <div>
                  <span className="school-kicker">STUDENT PROFILE</span>
                  <h2 id="student-profile-title">Personal learning context</h2>
                </div>
              </div>
              <p>
                Once a school is connected, select a student to review their
                class, subjects, timetable, and support needs.
              </p>
              <div className="school-profile-fields">
                <span>
                  Class &amp; section <strong>Not connected</strong>
                </span>
                <span>
                  Subjects <strong>Not connected</strong>
                </span>
                <span>
                  School schedule <strong>Not connected</strong>
                </span>
              </div>
              <div className="school-permission-note">
                <ShieldCheck aria-hidden="true" /> Student records appear only
                for permitted school roles.
              </div>
            </section>
            <section
              className="school-panel school-student-evidence"
              aria-labelledby="student-evidence-title"
            >
              <div className="school-panel-heading">
                <span className="school-panel-icon">
                  <BookOpen aria-hidden="true" />
                </span>
                <div>
                  <span className="school-kicker">ASSESSMENT EVIDENCE</span>
                  <h2 id="student-evidence-title">
                    Results, with their topics
                  </h2>
                </div>
              </div>
              <div className="school-empty-row">
                <span className="school-empty-symbol">
                  <FileQuestion aria-hidden="true" />
                </span>
                <div>
                  <strong>No assessment records yet</strong>
                  <p>
                    Test scores will appear with their assessed topics, date,
                    class, and school source. A score alone will not be used as
                    a diagnosis.
                  </p>
                </div>
              </div>
            </section>
            <section
              className="school-panel school-student-updates"
              id="daily-updates"
              aria-labelledby="student-updates-title"
            >
              <div className="school-panel-heading">
                <span className="school-panel-icon">
                  <ClipboardList aria-hidden="true" />
                </span>
                <div>
                  <span className="school-kicker">DAILY UPDATES</span>
                  <h2 id="student-updates-title">What changed today</h2>
                </div>
              </div>
              <div className="school-update-list">
                <span>
                  Attendance <strong>Waiting for a school update</strong>
                </span>
                <span>
                  Classwork &amp; homework{" "}
                  <strong>Waiting for a school update</strong>
                </span>
                <span>
                  Upcoming tests <strong>Waiting for a school update</strong>
                </span>
              </div>
            </section>
          </div>
          <div className="school-student-column">
            <section
              className="school-panel school-weekly-panel"
              aria-labelledby="student-week-title"
            >
              <div className="school-panel-heading">
                <span className="school-panel-icon">
                  <CalendarDays aria-hidden="true" />
                </span>
                <div>
                  <span className="school-kicker">WEEKLY CONTEXT</span>
                  <h2 id="student-week-title">The week at a glance</h2>
                </div>
              </div>
              <div className="school-weekly-empty">
                <CalendarClock aria-hidden="true" />
                <strong>Nothing to summarize yet</strong>
                <p>
                  As school updates arrive, this space can highlight new topics,
                  deadlines, attendance changes, and what may need a gentler
                  plan.
                </p>
              </div>
            </section>
            <section
              className="school-panel school-plan-panel"
              id="weekly-plan"
              aria-labelledby="student-plan-title"
            >
              <div className="school-panel-heading">
                <span className="school-panel-icon">
                  <Clock3 aria-hidden="true" />
                </span>
                <div>
                  <span className="school-kicker">PERSONALIZED SCHEDULE</span>
                  <h2 id="student-plan-title">A plan that fits real life</h2>
                </div>
              </div>
              <p>
                The coach can suggest tasks after school, but only when there is
                enough context to fit them within available time.
              </p>
              <div className="school-plan-sequence">
                <div>
                  <span>
                    <BookOpen aria-hidden="true" />
                  </span>
                  <strong>School priorities</strong>
                  <small>Topics and upcoming work</small>
                </div>
                <div>
                  <span>
                    <Clock3 aria-hidden="true" />
                  </span>
                  <strong>Time available</strong>
                  <small>Classes and commitments</small>
                </div>
                <div>
                  <span>
                    <Moon aria-hidden="true" />
                  </span>
                  <strong>Rest protected</strong>
                  <small>Breaks and sleep window</small>
                </div>
              </div>
              <div className="school-plan-note">
                <Info aria-hidden="true" />
                <span>
                  No student schedule is generated in this preview. The student
                  can adjust or skip a suggested task when planning is
                  connected.
                </span>
              </div>
            </section>
            <div className="school-student-footer">
              <span>
                Every recommendation should show which records informed it.
              </span>
              <Link href="/school/overview">
                Back to overview <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </SchoolShell>
  );
}
