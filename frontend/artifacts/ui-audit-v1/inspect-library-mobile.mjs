import { chromium } from "playwright-core";

const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000/library");
await page.getByText("No documents yet").waitFor();
await page.getByLabel("Select study material").setInputFiles({
  name: "My motion notes.txt",
  mimeType: "text/plain",
  buffer: Buffer.from("Motion notes\nSpeed is distance divided by time."),
});
await page.getByText("Text was extracted.", { exact: false }).waitFor();
console.log(await page.evaluate(() => ({
  viewport: innerWidth,
  document: document.documentElement.scrollWidth,
  offenders: Array.from(document.querySelectorAll("body *"))
    .map((element) => ({
      tag: element.tagName.toLowerCase(),
      className: typeof element.className === "string" ? element.className : "",
      right: Math.round(element.getBoundingClientRect().right),
      width: Math.round(element.getBoundingClientRect().width),
    }))
    .filter((element) => element.right > innerWidth + 1 && element.width > 20)
    .slice(0, 20),
})));
await page.screenshot({ path: "artifacts/ui-audit-v1/before/library-document-mobile-viewport.png" });
await browser.close();