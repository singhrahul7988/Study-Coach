import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Layers3,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { SchoolShell } from "@/components/SchoolShell";

export const metadata = { title: "School overview preview | Ranjan Sir" };

export default function SchoolOverviewPage() {
  return (
    <SchoolShell active="Overview">
      <main className="school-content">
        <div className="school-page-heading">
          <div>
            <span className="school-kicker">MANAGEMENT OVERVIEW</span>
            <h1>One clearer picture of every learner.</h1>
            <p>
              Bring school records together so each student&apos;s next study
              step has useful context.
            </p>
          </div>
          <Link href="/school/student" className="school-primary-button">
            View student context <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="school-overview-banner">
          <div className="school-overview-banner-icon">
            <ShieldCheck aria-hidden="true" />
          </div>
          <div>
            <strong>Ready for your school&apos;s data</strong>
            <p>
              This preview has no connected school or student records. Once
              access is set up, the workspace can show only information the
              school is permitted to share.
            </p>
          </div>
          <span>NO DATA CONNECTED</span>
        </div>
        <section
          className="school-overview-section"
          aria-labelledby="school-signals-title"
        >
          <div className="school-section-heading">
            <div>
              <span className="school-kicker">THE LEARNING PICTURE</span>
              <h2 id="school-signals-title">What comes together here</h2>
            </div>
            <span className="school-section-note">
              Source and update time shown for each record
            </span>
          </div>
          <div className="school-signal-grid">
            <article className="school-signal-card">
              <span className="school-signal-icon">
                <ClipboardList aria-hidden="true" />
              </span>
              <div>
                <span className="school-signal-index">01 / ASSESSMENTS</span>
                <h3>Scores with topic coverage</h3>
                <p>
                  Connect a test result to the topics it assessed, the class,
                  and the date. Keep the original record close to every insight.
                </p>
              </div>
              <span className="school-signal-status">
                Awaiting school connection
              </span>
            </article>
            <article className="school-signal-card">
              <span className="school-signal-icon">
                <CalendarDays aria-hidden="true" />
              </span>
              <div>
                <span className="school-signal-index">02 / DAILY SIGNALS</span>
                <h3>Today&apos;s school context</h3>
                <p>
                  Attendance, classwork, homework, and upcoming tests can help
                  the coach adjust the day&apos;s workload.
                </p>
              </div>
              <span className="school-signal-status">
                Awaiting school connection
              </span>
            </article>
            <article className="school-signal-card">
              <span className="school-signal-icon">
                <Layers3 aria-hidden="true" />
              </span>
              <div>
                <span className="school-signal-index">03 / WEEKLY CONTEXT</span>
                <h3>Patterns over time</h3>
                <p>
                  Summarize recent topics, teacher notes, and deadlines without
                  treating a single mark as the whole story.
                </p>
              </div>
              <span className="school-signal-status">
                Awaiting school connection
              </span>
            </article>
          </div>
        </section>
        <div className="school-overview-lower">
          <section
            className="school-panel school-connection-panel"
            aria-labelledby="school-next-title"
          >
            <div className="school-panel-heading">
              <span className="school-panel-icon">
                <FileText aria-hidden="true" />
              </span>
              <div>
                <span className="school-kicker">DATA READINESS</span>
                <h2 id="school-next-title">From records to useful plans</h2>
              </div>
            </div>
            <ol className="school-connection-steps">
              <li>
                <span>1</span>
                <div>
                  <strong>Map students and classes</strong>
                  <small>
                    Match each school ID to the right student and permissions.
                  </small>
                </div>
                <CheckCircle2 aria-hidden="true" />
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>Attach context to results</strong>
                  <small>
                    Include assessment date, subject, topics, and source.
                  </small>
                </div>
                <CheckCircle2 aria-hidden="true" />
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>Shape a realistic schedule</strong>
                  <small>
                    Fit study around classes, commitments, and sleep.
                  </small>
                </div>
                <CheckCircle2 aria-hidden="true" />
              </li>
            </ol>
          </section>
          <section
            className="school-panel school-focus-panel"
            aria-labelledby="school-student-title"
          >
            <span className="school-focus-illustration">
              <UsersRound aria-hidden="true" />
            </span>
            <span className="school-kicker">STUDENT VIEW</span>
            <h2 id="school-student-title">
              See the story behind the next step.
            </h2>
            <p>
              The student context screen shows how daily signals and a weekly
              summary can lead to a personal plan. It begins empty until
              verified records arrive.
            </p>
            <Link href="/school/student">
              Open student view <ChevronRight aria-hidden="true" />
            </Link>
          </section>
        </div>
      </main>
    </SchoolShell>
  );
}
