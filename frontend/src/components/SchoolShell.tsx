"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpenCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  House,
  UsersRound,
} from "lucide-react";
import { useState, type ReactNode } from "react";

type SchoolView = "Overview" | "Student context";

const schoolNavigation = [
  { label: "Overview", href: "/school/overview", icon: House },
  { label: "Student context", href: "/school/student", icon: UsersRound },
  {
    label: "Daily updates",
    href: "/school/student#daily-updates",
    icon: ClipboardList,
  },
  {
    label: "Weekly plans",
    href: "/school/student#weekly-plan",
    icon: CalendarDays,
  },
] as const;

export function SchoolShell({
  active,
  children,
}: {
  active: SchoolView;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={"school-shell" + (collapsed ? " school-shell-collapsed" : "")}
    >
      <aside
        className="school-sidebar"
        aria-label="School workspace navigation"
      >
        <Link
          href="/school/overview"
          className="school-sidebar-brand"
          aria-label="Ranjan Sir school workspace"
        >
          <Image
            src="/brand/ranjan-sir-portrait.png"
            alt=""
            width={37}
            height={45}
          />
          <span>Ranjan Sir</span>
        </Link>
        <div className="school-sidebar-divider" />
        <span className="school-sidebar-label">SCHOOL WORKSPACE</span>
        <nav className="school-side-nav" aria-label="School workspace">
          {schoolNavigation.map((item) => {
            const Icon = item.icon;
            const selected = item.label === active;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={"school-nav-item" + (selected ? " is-active" : "")}
                aria-current={selected ? "page" : undefined}
                title={item.label}
              >
                <Icon aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="school-sidebar-bottom">
          <Link
            href="/school/sign-in"
            className="school-nav-item school-nav-back"
            title="Back to school sign in"
          >
            <ArrowLeft aria-hidden="true" />
            <span>Back to sign in</span>
          </Link>
          <button
            type="button"
            className="school-collapse-button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            {collapsed ? (
              <ChevronRight aria-hidden="true" />
            ) : (
              <ChevronLeft aria-hidden="true" />
            )}
            <span>Collapse sidebar</span>
          </button>
        </div>
      </aside>
      <div className="school-main">
        <header className="school-topbar">
          <Link href="/school/overview" className="school-mobile-brand">
            <Image
              src="/brand/ranjan-sir-portrait.png"
              alt=""
              width={30}
              height={36}
            />{" "}
            Ranjan Sir
          </Link>
          <span className="school-topbar-title">
            <BookOpenCheck aria-hidden="true" /> School workspace
          </span>
          <span className="school-preview-badge">DESIGN PREVIEW</span>
          <span className="school-topbar-avatar" aria-hidden="true">
            S
          </span>
        </header>
        <nav className="school-mobile-nav" aria-label="School workspace mobile">
          {schoolNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={item.label === active ? "is-active" : undefined}
              >
                <Icon aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        {children}
      </div>
    </div>
  );
}
