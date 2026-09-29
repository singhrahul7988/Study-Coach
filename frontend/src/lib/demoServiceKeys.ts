export interface DemoServiceKeys {
  gemini: string;
  deepgram: string;
}

const storageKey = "ranjan-demo-service-keys";
const emailKey = "ranjan-demo-email";

export function readDemoServiceKeys(): DemoServiceKeys {
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) return { gemini: "", deepgram: "" };
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) throw new Error();
    const item = value as Record<string, unknown>;
    return {
      gemini: typeof item.gemini === "string" ? item.gemini : "",
      deepgram: typeof item.deepgram === "string" ? item.deepgram : "",
    };
  } catch {
    return { gemini: "", deepgram: "" };
  }
}

export function saveDemoServiceKeys(keys: DemoServiceKeys): void {
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(keys));
  } catch {
    // The current tab can continue without saved service keys.
  }
}

export function readDemoEmail(): string {
  try {
    return window.sessionStorage.getItem(emailKey) ?? "";
  } catch {
    return "";
  }
}

export function saveDemoEmail(email: string): void {
  try {
    window.sessionStorage.setItem(emailKey, email);
  } catch {
    // The current tab can continue without saved email.
  }
}

export function clearDemoServiceSettings(): void {
  try {
    window.sessionStorage.removeItem(storageKey);
    window.sessionStorage.removeItem(emailKey);
  } catch {
    // The current page can still return to the landing screen.
  }
}
