import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright-core";

const stage = process.argv[2];
const onlyScreen = process.argv[3];
if (stage !== "before" && stage !== "after") {
  throw new Error("Use before or after.");
}

const screens = [
  ["today", "/"],
  ["library", "/library"],
  ["study", "/study"],
  ["progress", "/progress"],
  ["coach", "/coach"],
];
const viewports = [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }],
];
const output = resolve("artifacts", "ui-audit-v1", stage);
await mkdir(output, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});

try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  for (const [name, route] of screens) {
    if (onlyScreen && name !== onlyScreen) continue;
    for (const [device, viewport] of viewports) {
      await page.setViewportSize(viewport);
      await page.goto("http://localhost:3000" + route, {
        waitUntil: "domcontentloaded",
      });
      await page.locator("h1").waitFor();
      if (name === "library") {
        await page.getByText("No documents yet").waitFor();
      }
      await page.evaluate(async () => {
        await document.fonts.ready;
      });
      await page.screenshot({
        path: resolve(output, name + "-" + device + ".png"),
        fullPage: true,
      });
      console.log(name + " " + device);
    }
    if (name === "library") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("http://localhost:3000/library");
      await page.getByText("No documents yet").waitFor();
      await page.getByLabel("Select study material").setInputFiles({
        name: "My motion notes.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("Motion notes\nSpeed is distance divided by time."),
      });
      await page.getByText("Text was extracted.", { exact: false }).waitFor();
      for (const [device, viewport] of viewports) {
        await page.setViewportSize(viewport);
        await page.screenshot({
          path: resolve(output, "library-document-" + device + ".png"),
          fullPage: true,
        });
      }
    }
  }
} finally {
  await browser.close();
}
