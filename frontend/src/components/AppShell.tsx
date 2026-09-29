"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  House,
  KeyRound,
  LogOut,
  MessageSquare,
  PlayCircle,
  Search,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  readDemoAvatar,
  readDemoProfile,
  signOutDemoSession,
} from "@/lib/demoJourney";
import { clearDemoServiceSettings } from "@/lib/demoServiceKeys";
import type { DemoProfile } from "@/types/journey";
import { useRouter } from "next/navigation";

export type ScreenName =
  "Today" | "Library" | "Study" | "Progress" | "Coach" | "Profile" | "Settings";

export interface SearchItem {
  id: string;
  label: string;
  description?: string;
  href?: string;
}

interface AppShellProps {
  active: ScreenName;
  children: React.ReactNode;
  studentName?: string;
  grade?: number;
  board?: string;
  searchItems?: SearchItem[];
  onSearchSelect?: (item: SearchItem) => void;
}

const defaultSearchItems: SearchItem[] = [];
const sidebarStorageKey = "ranjan-sir-sidebar-collapsed";
const sidebarChangeEvent = "ranjan-sir-sidebar-change";
let fallbackSidebarCollapsed = false;

function readSidebarCollapsed(): boolean {
  try {
    return window.localStorage.getItem(sidebarStorageKey) === "true";
  } catch {
    return fallbackSidebarCollapsed;
  }
}

function readServerSidebarCollapsed(): boolean {
  return false;
}

function subscribeSidebar(listener: () => void): () => void {
  window.addEventListener("storage", listener);
  window.addEventListener(sidebarChangeEvent, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(sidebarChangeEvent, listener);
  };
}

function updateSidebarCollapsed(collapsed: boolean): void {
  fallbackSidebarCollapsed = collapsed;
  try {
    window.localStorage.setItem(sidebarStorageKey, String(collapsed));
  } catch {
    fallbackSidebarCollapsed = collapsed;
  }
  window.dispatchEvent(new Event(sidebarChangeEvent));
}

const navigation = [
  { label: "Coach", href: "/coach", icon: <MessageSquare /> },
  { label: "Today", href: "/today", icon: <House /> },
  { label: "Study", href: "/study", icon: <PlayCircle /> },
  { label: "Library", href: "/library", icon: <BookOpen /> },
  {
    label: "Progress",
    href: "/progress",
    icon: <ChartNoAxesColumnIncreasing />,
  },
] as const;

function Brand() {
  return (
    <>
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
      <span className="brand-name">Ranjan Sir</span>
    </>
  );
}

interface NavigationProps {
  active: ScreenName;
  mobile?: boolean;
}

function Navigation({ active, mobile = false }: NavigationProps) {
  return (
    <nav
      className={mobile ? "mobile-nav" : "side-nav"}
      id={mobile ? undefined : "desktop-primary-nav"}
      aria-label={mobile ? "Primary mobile" : "Primary"}
    >
      {navigation.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={
            "nav-item" + (item.label === active ? " nav-item-active" : "")
          }
          aria-current={item.label === active ? "page" : undefined}
          aria-label={item.label}
          title={mobile ? undefined : item.label}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({
  active,
  children,
  studentName,
  grade,
  board,
  searchItems = defaultSearchItems,
  onSearchSelect,
}: AppShellProps) {
  const router = useRouter();
  const sidebarCollapsed = useSyncExternalStore(
    subscribeSidebar,
    readSidebarCollapsed,
    readServerSidebarCollapsed,
  );
  const [savedProfile, setSavedProfile] = useState<DemoProfile | null>(null);
  const [savedAvatar, setSavedAvatar] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const refreshProfile = () => setSavedProfile(readDemoProfile());
    void Promise.resolve().then(refreshProfile);
    window.addEventListener("ranjan-demo-profile-updated", refreshProfile);
    return () =>
      window.removeEventListener("ranjan-demo-profile-updated", refreshProfile);
  }, []);
  useEffect(() => {
    const refreshAvatar = () => setSavedAvatar(readDemoAvatar());
    void Promise.resolve().then(refreshAvatar);
    window.addEventListener("ranjan-demo-avatar-updated", refreshAvatar);
    return () =>
      window.removeEventListener("ranjan-demo-avatar-updated", refreshAvatar);
  }, []);
  useEffect(() => {
    if (!profileMenuOpen) return;
    profileMenuRef.current
      ?.querySelector<HTMLButtonElement>('[role="menuitem"]')
      ?.focus();
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        !profileMenuRef.current?.contains(target) &&
        !profileButtonRef.current?.contains(target)
      ) {
        setProfileMenuOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
        profileButtonRef.current?.focus();
        return;
      }
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      const items = Array.from(
        profileMenuRef.current?.querySelectorAll<HTMLButtonElement>(
          '[role="menuitem"]',
        ) ?? [],
      );
      if (!items.length) return;
      event.preventDefault();
      const current = items.findIndex(
        (item) => item === document.activeElement,
      );
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? items.length - 1
            : event.key === "ArrowDown"
              ? (current + 1) % items.length
              : (current - 1 + items.length) % items.length;
      items[next].focus();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [profileMenuOpen]);

  function openAccountPage(path: "/profile" | "/settings") {
    setProfileMenuOpen(false);
    router.push(path);
  }

  function signOut() {
    setProfileMenuOpen(false);
    signOutDemoSession();
    clearDemoServiceSettings();
    window.location.replace("/");
  }

  const displayName = savedProfile?.name ?? studentName ?? "";
  const displayGrade = savedProfile?.grade ?? grade;
  const displayBoard = savedProfile?.board ?? board;
  const [query, setQuery] = useState("");
  const results = query.trim()
    ? searchItems.filter((item) =>
        (item.label + " " + (item.description ?? ""))
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      )
    : [];

  function selectResult(item: SearchItem): void {
    setQuery("");
    if (onSearchSelect) onSearchSelect(item);
    else router.push(item.href ?? "/library");
  }

  return (
    <div
      className={
        "app-shell" +
        (active === "Coach" ? " app-shell-coach" : "") +
        (sidebarCollapsed ? " sidebar-is-collapsed" : "")
      }
    >
      <aside className="sidebar" aria-label="Main navigation">
        <div className="sidebar-header">
          <div className="brand" aria-label="Ranjan Sir">
            <Brand />
          </div>
        </div>
        <Navigation active={active} />
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => updateSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!sidebarCollapsed}
          aria-controls="desktop-primary-nav"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight aria-hidden="true" />
          ) : (
            <ChevronLeft aria-hidden="true" />
          )}
          <span>
            {sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          </span>
        </button>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <div className="mobile-brand" aria-label="Ranjan Sir">
            <Brand />
          </div>
          {searchItems.length ? (
            <div className="search-wrap">
              <Search className="search-icon" aria-hidden="true" />
              <label className="sr-only" htmlFor="dashboard-search">
                Search topics, notes, worksheets
              </label>
              <input
                id="dashboard-search"
                type="search"
                placeholder="Search for topics, notes, worksheets..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoComplete="off"
              />
              {query.trim() ? (
                <div
                  className="search-popover"
                  role="region"
                  aria-label="Search results"
                >
                  <p className="popover-label">
                    {active === "Today"
                      ? "Today&apos;s plan"
                      : "Study material"}
                  </p>
                  {results.length ? (
                    results.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => selectResult(item)}
                      >
                        <Search aria-hidden="true" />
                        <span>{item.label}</span>
                        <ArrowRight aria-hidden="true" />
                      </button>
                    ))
                  ) : (
                    <p className="empty-result">No matching items.</p>
                  )}
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="account-actions">
            <button
              type="button"
              className="grade-select"
              onClick={() => openAccountPage("/profile")}
            >
              {displayGrade && displayBoard
                ? "Class " + displayGrade + " · " + displayBoard
                : "Set up profile"}
              <ChevronDown aria-hidden="true" />
            </button>
            <div className="profile-action">
              <button
                ref={profileButtonRef}
                type="button"
                className="profile"
                onClick={() => setProfileMenuOpen((open) => !open)}
                aria-label={
                  displayName
                    ? "Open profile menu for " + displayName
                    : "Open profile menu"
                }
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
                aria-controls="profile-menu"
              >
                <span className="avatar" aria-hidden="true">
                  {savedAvatar ? (
                    <Image
                      src={savedAvatar}
                      alt=""
                      width={48}
                      height={48}
                      unoptimized
                      className="avatar-photo"
                    />
                  ) : displayName ? (
                    displayName.charAt(0)
                  ) : (
                    <UserRound />
                  )}
                </span>
                <span className="profile-name">{displayName || "Profile"}</span>
                <ChevronDown className="profile-chevron" aria-hidden="true" />
              </button>
              {profileMenuOpen ? (
                <div
                  id="profile-menu"
                  ref={profileMenuRef}
                  className="profile-menu"
                  role="menu"
                  aria-label="Profile options"
                >
                  <div className="profile-menu-header" role="presentation">
                    <strong>{displayName || "Your profile"}</strong>
                    <span>
                      {displayGrade && displayBoard
                        ? "Class " + displayGrade + " / " + displayBoard
                        : "Study setup"}
                    </span>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => openAccountPage("/profile")}
                  >
                    <UserRound aria-hidden="true" />
                    <span>
                      <strong>My profile</strong>
                      <small>Details and achievements</small>
                    </span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => openAccountPage("/settings")}
                  >
                    <KeyRound aria-hidden="true" />
                    <span>
                      <strong>Settings</strong>
                      <small>Document and voice tools</small>
                    </span>
                  </button>
                  <div className="profile-menu-divider" role="separator" />
                  <button type="button" role="menuitem" onClick={signOut}>
                    <LogOut aria-hidden="true" />
                    <span>
                      <strong>Sign out</strong>
                      <small>End the current study session</small>
                    </span>
                  </button>
                  <p className="profile-menu-note" role="presentation">
                    Uploaded Library files stay on this device.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </header>
        <Navigation active={active} mobile />
        {children}
      </div>
    </div>
  );
}
