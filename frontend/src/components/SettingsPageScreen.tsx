"use client";

import Link from "next/link";
import { KeyRound, ShieldCheck, Sparkles, Mic2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { readDemoProfile } from "@/lib/demoJourney";
import {
  readDemoServiceKeys,
  saveDemoServiceKeys,
  type DemoServiceKeys,
} from "@/lib/demoServiceKeys";
import type { DemoProfile } from "@/types/journey";

export function SettingsPageScreen() {
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState<DemoProfile | null>(null);
  const [keys, setKeys] = useState<DemoServiceKeys>({
    gemini: "",
    deepgram: "",
  });
  const [savedKeys, setSavedKeys] = useState<DemoServiceKeys>({
    gemini: "",
    deepgram: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) return;
      setProfile(readDemoProfile());
      const stored = readDemoServiceKeys();
      setKeys(stored);
      setSavedKeys(stored);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = { gemini: keys.gemini.trim(), deepgram: keys.deepgram.trim() };
    saveDemoServiceKeys(next);
    setKeys(next);
    setSavedKeys(next);
    setSaved(true);
  }

  return (
    <AppShell
      active="Settings"
      studentName={profile?.name}
      grade={profile?.grade}
      board={profile?.board}
    >
      <main className="account-page settings-page">
        <div className="account-page-inner account-settings-inner">
          <header className="account-heading">
            <h1>Settings</h1>
            <p>Set up document help and voice questions.</p>
          </header>
          {!loaded ? (
            <p className="account-loading">Loading settings...</p>
          ) : !profile ? (
            <section className="account-card account-empty">
              <h2>Start your study journey</h2>
              <p>Get started to set up your study tools.</p>
              <Link href="/start" className="account-primary">
                Get started
              </Link>
            </section>
          ) : (
            <form onSubmit={save} className="account-settings-form">
              <section className="account-card">
                <div className="account-section-heading">
                  <span className="account-badge-heading-icon">
                    <KeyRound aria-hidden="true" />
                  </span>
                  <div>
                    <h2>Study tools</h2>
                    <p>Add a key for each tool you want to use.</p>
                  </div>
                </div>
                <div className="account-service-list">
                  <div className="account-service">
                    <span className="account-service-icon">
                      <Sparkles aria-hidden="true" />
                    </span>
                    <div className="account-service-body">
                      <div className="account-service-title">
                        <h3>Gemini</h3>
                        <span>
                          {keys.gemini.trim() !== savedKeys.gemini
                            ? "Unsaved"
                            : savedKeys.gemini
                              ? "Key saved"
                              : "Not added"}
                        </span>
                      </div>
                      <p>Get study help from documents in your Library.</p>
                      <label htmlFor="gemini-key">Gemini API key</label>
                      <input
                        id="gemini-key"
                        type="password"
                        autoComplete="off"
                        value={keys.gemini}
                        onChange={(event) => {
                          setKeys((current) => ({
                            ...current,
                            gemini: event.target.value,
                          }));
                          setSaved(false);
                        }}
                        placeholder="Paste Gemini key"
                      />
                    </div>
                  </div>
                  <div className="account-service">
                    <span className="account-service-icon">
                      <Mic2 aria-hidden="true" />
                    </span>
                    <div className="account-service-body">
                      <div className="account-service-title">
                        <h3>Deepgram</h3>
                        <span>
                          {keys.deepgram.trim() !== savedKeys.deepgram
                            ? "Unsaved"
                            : savedKeys.deepgram
                              ? "Key saved"
                              : "Not added"}
                        </span>
                      </div>
                      <p>Ask Coach a question by voice.</p>
                      <label htmlFor="deepgram-key">Deepgram API key</label>
                      <input
                        id="deepgram-key"
                        type="password"
                        autoComplete="off"
                        value={keys.deepgram}
                        onChange={(event) => {
                          setKeys((current) => ({
                            ...current,
                            deepgram: event.target.value,
                          }));
                          setSaved(false);
                        }}
                        placeholder="Paste Deepgram key"
                      />
                    </div>
                  </div>
                </div>
                <p className="account-settings-note">
                  <ShieldCheck aria-hidden="true" />
                  Keys are saved for this visit and used only when you choose
                  document help or voice input.
                </p>
                <div className="account-form-footer">
                  <span role="status">{saved ? "Settings saved." : ""}</span>
                  <button type="submit" className="account-primary">
                    Save settings
                  </button>
                </div>
              </section>
            </form>
          )}
        </div>
      </main>
    </AppShell>
  );
}
