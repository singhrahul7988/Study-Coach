import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright-core";

const stage = process.argv[2];
if (!stage || !/^[a-z0-9-]+$/.test(stage)) {
  throw new Error("Pass a simple stage name, such as before or iteration-1.");
}
const output = resolve("artifacts", "design-review", stage);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});
const profile = {
  name: "Maya",
  grade: 11,
  board: "CBSE",
  entranceExam: "NEET",
  pace: "focused",
};
const screens = [];

async function seed(page) {
  await page.goto("http://localhost:3000/");
  await page.evaluate((student) => {
    sessionStorage.setItem("ranjan-demo-profile", JSON.stringify(student));
    sessionStorage.setItem(
      "ranjan-demo-room",
      JSON.stringify({
        profile: student,
        tasks: [
          {
            id: "review-motion",
            title: "Review motion from your notes",
            minutes: 25,
            reason: "Your reviewed note is available for this topic.",
            sourceId: "design-review-notes",
            sourceName: "My motion notes.txt",
            page: 1,
          },
          {
            id: "check-speed",
            title: "Check your understanding of speed",
            minutes: 25,
            reason: "Use the question from your notes to self-check.",
            sourceId: "design-review-notes",
            sourceName: "My motion notes.txt",
            page: 1,
          },
        ],
        createdAt: Date.now(),
        remainingSeconds: 3000,
        runningSince: null,
        doneIds: [],
        ended: false,
      }),
    );
  }, profile);
  await page.evaluate(async () => {
    const db = await new Promise((resolveDb, reject) => {
      const request = indexedDB.open("ranjan-sir-study-documents", 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains("documents")) {
          request.result.createObjectStore("documents", { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolveDb(request.result);
      request.onerror = () => reject(request.error);
    });
    const text =
      "Motion notes\nSpeed is distance divided by time.\nDistance is a scalar.";
    const document = {
      id: "design-review-notes",
      name: "My motion notes.txt",
      format: "txt",
      size: text.length,
      addedAt: "2026-09-29T09:00:00.000Z",
      status: "ready",
      file: new Blob([text], { type: "text/plain" }),
      analysis: {
        subject: "Physics",
        topics: ["Motion", "Speed"],
        summary: "Motion notes covering speed and distance.",
        pages: [{ number: 1, text, source: "text" }],
        questions: [
          {
            id: "speed-question",
            prompt: "How is speed calculated?",
            answer: "Speed is distance divided by time.",
            hint: "Look for the relationship between distance and time.",
            page: 1,
            evidence: "Speed is distance divided by time.",
            reviewRequired: false,
          },
          {
            id: "distance-question",
            prompt: "Is distance scalar or vector?",
            answer: "Distance is a scalar.",
            hint: "Check the corrected note.",
            page: 1,
            evidence: "Distance is a scalar.",
            reviewRequired: false,
          },
        ],
        warnings: [],
        aiStatus: "complete",
      },
      error: null,
      reviewed: true,
    };
    await new Promise((resolveTransaction, reject) => {
      const transaction = db.transaction("documents", "readwrite");
      transaction.objectStore("documents").put(document);
      transaction.oncomplete = () => resolveTransaction();
      transaction.onerror = () => reject(transaction.error);
    });
    db.close();
  });
}

async function snap(page, name, device) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map((img) => img.decode().catch(() => {})),
    );
  });
  await page.addStyleTag({
    content: "nextjs-portal { display: none !important; }",
  });
  await page.waitForTimeout(120);
  const file = resolve(output, `${name}-${device}.png`);
  await page.screenshot({ path: file, fullPage: true });
  if (name === "08-library-document" && device === "mobile") {
    await page.screenshot({
      path: resolve(output, "08-library-document-mobile-viewport.png"),
    });
  }
  const geometry = await page.evaluate(() => ({
    viewportWidth: innerWidth,
    pageWidth: document.documentElement.scrollWidth,
    viewportHeight: innerHeight,
    pageHeight: document.documentElement.scrollHeight,
  }));
  screens.push({ name, device, file, ...geometry });
  console.log(`${stage}: ${name} ${device}`);
}

try {
  for (const [device, viewport] of [
    ["desktop", { width: 1440, height: 900 }],
    ["mobile", { width: 390, height: 844 }],
  ]) {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    await seed(page);
    await snap(page, "01-landing", device);
    await page.goto("http://localhost:3000/start");
    await page.getByPlaceholder("What should we call you?").waitFor();
    await snap(page, "02-setup", device);
    await page.goto("http://localhost:3000/curating");
    await page.locator(".curating-list").waitFor();
    await snap(page, "03-curating", device);
    await page.goto("http://localhost:3000/coach");
    await page.getByRole("heading", { name: "A focused start" }).waitFor();
    await snap(page, "04-coach-start", device);
    await page
      .getByRole("button", { name: "Open profile menu for Maya" })
      .click();
    await page.getByRole("menu", { name: "Profile options" }).waitFor();
    await snap(page, "04-profile-menu", device);
    await page.getByRole("menuitem", { name: /Settings/ }).click();
    await page.getByRole("heading", { name: "Settings" }).waitFor();
    await snap(page, "04-profile-settings", device);
    await page.goto("http://localhost:3000/profile");
    await page.getByRole("heading", { name: "My profile" }).waitFor();
    await snap(page, "04-my-profile", device);
    await page.goto("http://localhost:3000/coach");
    await page
      .getByLabel("Ask Ranjan Sir")
      .fill("What is speed? Make me a plan.");
    await page.getByRole("button", { name: "Send question" }).click();
    await page.getByRole("heading", { name: "Your session" }).waitFor();
    await snap(page, "04-coach", device);
    await page.goto("http://localhost:3000/today");
    await page.locator("h1").waitFor();
    await snap(page, "05-today", device);
    await page.goto("http://localhost:3000/study");
    await page.getByRole("heading", { name: /Let's focus, Maya/ }).waitFor();
    await snap(page, "06-study-room", device);
    await page.goto("http://localhost:3000/library");
    await page.getByRole("heading", { name: "Your study material." }).waitFor();
    await page.getByRole("button", { name: /My motion notes.txt/ }).waitFor();
    await snap(page, "07-library", device);
    await page.getByRole("button", { name: /My motion notes.txt/ }).click();
    await page.getByRole("link", { name: "Open in Study" }).waitFor();
    if (device === "mobile") {
      await page.waitForFunction(() => {
        const action = document
          .querySelector(".library-study-link")
          ?.getBoundingClientRect();
        return action && action.top >= 0 && action.bottom <= innerHeight;
      });
    }
    await snap(page, "08-library-document", device);
    await page.goto("http://localhost:3000/study?document=design-review-notes");
    await page
      .getByText("Speed is distance divided by time.")
      .first()
      .waitFor();
    await snap(page, "09-study-document", device);
    await page.goto("http://localhost:3000/progress");
    await page.getByRole("heading", { name: "Your progress." }).waitFor();
    await snap(page, "10-progress", device);
    await context.close();

    const emptyContext = await browser.newContext({
      viewport,
      deviceScaleFactor: 1,
    });
    const emptyPage = await emptyContext.newPage();
    await emptyPage.goto("http://localhost:3000/library");
    await emptyPage.getByText("No documents yet").waitFor();
    await snap(emptyPage, "11-library-empty", device);
    await emptyPage.evaluate((student) => {
      sessionStorage.setItem("ranjan-demo-profile", JSON.stringify(student));
    }, profile);
    await emptyPage.goto("http://localhost:3000/study");
    await emptyPage
      .getByRole("heading", { name: "Start with a plan you choose." })
      .waitFor();
    await snap(emptyPage, "12-study-empty", device);
    await emptyPage.goto("http://localhost:3000/progress");
    await emptyPage
      .getByRole("heading", { name: "Your progress starts with a study room." })
      .waitFor();
    await snap(emptyPage, "13-progress-empty", device);
    await emptyContext.close();
  }
} finally {
  await browser.close();
}
await writeFile(
  resolve(output, "metrics.json"),
  JSON.stringify(screens, null, 2),
);
