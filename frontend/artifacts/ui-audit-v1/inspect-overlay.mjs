import { chromium } from "playwright-core";

const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});
const page = await browser.newPage();
page.on("response", (response) => {
  if (response.status() >= 400) console.log("HTTP:", response.status(), response.url());
});
page.on("console", (message) => {
  if (message.type() === "error") console.log("CONSOLE:", message.text());
});
page.on("pageerror", (error) => console.log("PAGE:", error.message));
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(600);
const issue = page.locator("nextjs-portal").getByText("1 Issue", { exact: false });
console.log("ISSUE COUNT:", await issue.count());
if (await issue.count()) {
  await issue.first().click();
  await page.waitForTimeout(300);
}
console.log("VISIBLE:", await page.locator("nextjs-portal").evaluateAll((elements) =>
  elements.map((element) => Array.from(element.shadowRoot?.querySelectorAll("*") ?? [])
    .filter((node) => node.tagName !== "STYLE" && node.children.length === 0)
    .map((node) => node.textContent?.trim())
    .filter((value) => value && value.length > 5 && value.length < 300)
    .slice(-30))));
await browser.close();