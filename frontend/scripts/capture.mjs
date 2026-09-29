import { chromium } from "playwright-core";

const width = Number(process.argv[2] ?? 1586);
const height = Number(process.argv[3] ?? 992);
const file = process.argv[4] ?? "artifacts/today.png";
const route = process.argv[5] ?? "/";

const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: 1,
});
await page.goto("http://localhost:3000" + route, {
  waitUntil: "domcontentloaded",
});
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: file, fullPage: true });
const metrics = await page.evaluate(() => ({
  viewportWidth: window.innerWidth,
  documentWidth: document.documentElement.scrollWidth,
  viewportHeight: window.innerHeight,
  documentHeight: document.documentElement.scrollHeight,
  title: document.title,
}));
console.log(JSON.stringify({ file, ...metrics }));
await browser.close();
