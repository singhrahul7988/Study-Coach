import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.setDefaultTimeout(12000);

try {
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [768, 900],
    [1440, 900],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("http://localhost:3000/");
    await page
      .getByRole("heading", {
        name: "Your preparation, understood.",
      })
      .waitFor();
    const landing = await page.evaluate(() => {
      const button = document.querySelector(".landing-cta");
      return {
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        buttonBottom: button?.getBoundingClientRect().bottom ?? Infinity,
      };
    });
    assert.ok(landing.scrollWidth <= width, "Landing overflows at " + width);
    assert.ok(
      landing.scrollHeight <= height,
      "Landing should fit one viewport at " + width,
    );
    assert.ok(
      landing.buttonBottom <= height,
      "Get started button is outside the viewport at " + width,
    );
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("link", { name: "Get started" }).click();
  await page.waitForURL("**/start");
  await page.getByPlaceholder("What should we call you?").fill("Maya");
  await page.locator(".start-field select").nth(0).selectOption("11");
  await page.locator(".start-field select").nth(1).selectOption("CBSE");
  await page.locator(".start-check input").check();
  await page.locator(".start-exam-select select").selectOption("NEET");
  await page.getByText("Focused", { exact: true }).click();
  await page
    .getByRole("button", {
      name: "Create my starting plan",
    })
    .click();
  await page.waitForURL("**/curating");
  const curationStart = Date.now();
  assert.equal(await page.locator(".curating-item").count(), 5);
  const activeCard = page
    .locator(".curating-item.is-active .curating-card")
    .first();
  assert.equal(
    await activeCard.evaluate((card) => getComputedStyle(card).animationName),
    "curating-card-breathe",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await activeCard.evaluate((card) => getComputedStyle(card).animationName),
    "none",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForFunction(
    () => document.querySelectorAll(".curating-item.is-complete").length >= 4,
  );
  assert.ok((await page.locator(".curating-item.is-complete").count()) >= 4);
  await page.waitForURL("**/coach", { timeout: 12000 });
  assert.ok(Date.now() - curationStart >= 3000, "Curation ended too soon");
  const promptToggle = page.getByRole("button", {
    name: "Show more suggested questions",
  });
  await promptToggle.waitFor();
  assert.equal(
    await page.locator(".journey-prompt-scroll .journey-prompt").count(),
    3,
  );
  assert.equal(
    await page.locator("#coach-more-prompts .journey-prompt:visible").count(),
    0,
  );
  await promptToggle.click();
  assert.equal(
    await page.locator("#coach-more-prompts .journey-prompt:visible").count(),
    3,
  );
  await page
    .getByRole("button", { name: "Hide more suggested questions" })
    .click();
  assert.equal(
    await page.locator("#coach-more-prompts .journey-prompt:visible").count(),
    0,
  );
  await page.goto("http://localhost:3000/progress");
  const progressCta = page.locator(".progress-live-empty a");
  await progressCta.waitFor();
  const progressCtaColors = await progressCta.evaluate((link) => {
    const style = getComputedStyle(link);
    return { background: style.backgroundColor, text: style.color };
  });
  assert.deepEqual(
    progressCtaColors,
    { background: "rgb(22, 94, 227)", text: "rgb(255, 255, 255)" },
    "Ask Coach must use a blue background with white text",
  );
  await progressCta.hover();
  assert.equal(
    await progressCta.evaluate(
      (link) => getComputedStyle(link).textDecorationLine,
    ),
    "none",
    "Ask Coach should not underline on hover",
  );
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto("http://localhost:3000/study");
  const emptyStudy = page.locator(".room-empty");
  await emptyStudy.waitFor();
  const emptyStudyLayout = await emptyStudy.evaluate((section) => {
    const button = section.querySelector("a");
    return {
      top: section.querySelector("span")?.getBoundingClientRect().top,
      buttonBackground: getComputedStyle(button).backgroundColor,
      buttonText: getComputedStyle(button).color,
    };
  });
  assert.ok(
    emptyStudyLayout.top < 230,
    "The empty Study content should start near the top",
  );
  assert.equal(emptyStudyLayout.buttonBackground, "rgb(22, 94, 227)");
  assert.equal(emptyStudyLayout.buttonText, "rgb(255, 255, 255)");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000/study");
  await page.locator(".room-empty").waitFor();
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollHeight <= innerHeight + 2,
    ),
    "The empty Study screen should fit a common mobile viewport",
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/coach");
  await page.locator(".side-nav .nav-item svg").first().waitFor();
  const navColors = await page
    .locator(".side-nav .nav-item svg")
    .evaluateAll((icons) => icons.map((icon) => getComputedStyle(icon).color));
  assert.deepEqual(
    navColors,
    [
      "rgb(101, 69, 165)",
      "rgb(150, 86, 20)",
      "rgb(22, 113, 95)",
      "rgb(22, 94, 227)",
      "rgb(173, 69, 53)",
    ],
    "Navigation icons should retain their distinct colors",
  );
  for (const route of [
    "/coach",
    "/today",
    "/study",
    "/library",
    "/progress",
    "/profile",
    "/settings",
  ]) {
    await page.goto(`http://localhost:3000${route}`);
    await page.locator(".sidebar-header").waitFor();
    const headerAlignment = await page.evaluate(() => {
      const sidebar = document
        .querySelector(".sidebar-header")
        .getBoundingClientRect();
      const topbar = document.querySelector(".topbar").getBoundingClientRect();
      return {
        sidebarCenter: sidebar.top + sidebar.height / 2,
        topbarCenter: topbar.top + topbar.height / 2,
        sidebarHeight: sidebar.height,
        topbarHeight: topbar.height,
      };
    });
    assert.equal(
      headerAlignment.sidebarHeight,
      64,
      route + " rail header height",
    );
    assert.equal(headerAlignment.topbarHeight, 84, route + " topbar height");
    assert.equal(
      headerAlignment.sidebarCenter,
      headerAlignment.topbarCenter,
      route + " header centers should align",
    );
  }
  await page.getByRole("button", { name: "Collapse sidebar" }).click();
  const collapsedAlignment = await page.evaluate(() => {
    const sidebar = document
      .querySelector(".sidebar-header")
      .getBoundingClientRect();
    const topbar = document.querySelector(".topbar").getBoundingClientRect();
    return {
      sidebarCenter: sidebar.top + sidebar.height / 2,
      topbarCenter: topbar.top + topbar.height / 2,
    };
  });
  assert.equal(
    collapsedAlignment.sidebarCenter,
    collapsedAlignment.topbarCenter,
    "Collapsed sidebar and topbar centers should align",
  );
  await page.getByRole("button", { name: "Expand sidebar" }).click();
  await page.goto("http://localhost:3000/profile");
  await page.locator(".profile-badges").waitFor();
  await page.evaluate(() => window.scrollTo(0, 150));
  const stickyHeader = await page.evaluate(() => ({
    scrollY: window.scrollY,
    top: document.querySelector(".topbar").getBoundingClientRect().top,
  }));
  assert.ok(stickyHeader.scrollY > 0, "Profile page should be scrollable");
  assert.equal(
    stickyHeader.top,
    0,
    "Header should remain fixed while scrolling",
  );
  for (const [width, height] of [
    [1917, 883],
    [1366, 768],
    [1280, 720],
    [1024, 768],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("http://localhost:3000/today");
    await page.getByRole("heading", { name: /Maya/ }).waitFor();
    const fit = await page.evaluate(() => ({
      pageHeight: document.documentElement.scrollHeight,
      pageWidth: document.documentElement.scrollWidth,
      cardBottom:
        document.querySelector(".today-plan-card")?.getBoundingClientRect()
          .bottom ?? Infinity,
    }));
    assert.ok(
      fit.pageHeight <= height,
      "Today scrolls at " + width + "x" + height,
    );
    assert.ok(fit.pageWidth <= width, "Today overflows at " + width + "px");
    assert.ok(
      fit.cardBottom <= height,
      "Today plan is clipped at " + width + "x" + height,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000/coach");
  await page
    .getByRole("heading", {
      name: /What should we work on, Maya/,
    })
    .waitFor();
  await page.getByText("Your Coach", { exact: true }).waitFor();
  assert.equal(await page.locator(".journey-context-strip").count(), 0);
  assert.equal(await page.getByText("03 / 03", { exact: false }).count(), 0);
  await page.getByRole("heading", { name: "A focused start" }).waitFor();
  assert.ok(
    (await page
      .locator(".journey-plan")
      .evaluate((panel) => panel.getBoundingClientRect().height)) < 500,
    "Coach starting panel has excessive empty height",
  );
  await page.getByRole("button", { name: "Ask Coach about a topic" }).click();
  assert.equal(
    await page
      .getByLabel("Ask Ranjan Sir")
      .evaluate((input) => document.activeElement === input),
    true,
  );
  await page.getByLabel("Ask Ranjan Sir").fill("Make me a plan for today");
  await page.getByRole("button", { name: "Send question" }).click();
  await page
    .getByRole("heading", {
      name: "Your session",
    })
    .waitFor();
  assert.equal(await page.locator(".journey-task-choice").count(), 2);
  await page
    .getByLabel("Ask Ranjan Sir")
    .fill("Help me understand photosynthesis");
  await page.getByRole("button", { name: "Send question" }).click();
  await page.getByText("Work through photosynthesis with Coach").waitFor();
  assert.equal(await page.locator(".coach-reply-plan").count(), 1);
  await page.reload();
  await page.getByRole("heading", { name: "Your session" }).waitFor();
  assert.equal(await page.locator(".journey-task-choice").count(), 2);
  assert.equal(await page.locator(".coach-reply-plan").count(), 1);
  assert.ok(
    await page.locator(".journey-message-coach .coach-portrait-image").count(),
  );
  const createPlan = page.getByRole("button", { name: /Create study plan/ });
  assert.equal(await createPlan.isEnabled(), true);
  await page.locator(".coach-reply-task").last().click();
  assert.match(await createPlan.textContent(), /min/);
  await createPlan.click();
  await page.waitForURL("**/study");
  await page.getByRole("heading", { name: /Let's focus, Maya/ }).waitFor();
  const timerBefore = await page.locator(".room-timer strong").textContent();
  assert.match(timerBefore ?? "", /^\d\d:\d\d$/);
  await page.getByRole("button", { name: "Pause timer" }).click();
  await page.getByRole("button", { name: "Resume timer" }).waitFor();
  await page.getByRole("button", { name: "Quick quiz" }).click();
  await page.getByText(/no reviewed, source-linked questions/).waitFor();
  await page.getByRole("button", { name: "Short test" }).click();
  await page
    .getByText(/short test needs at least two reviewed questions/i)
    .waitFor();
  await page.locator(".room-task").first().click();
  assert.equal(await page.getByText("1 marked done").count(), 1);

  await page.goto("http://localhost:3000/today");
  await page.getByRole("heading", { name: /Maya/ }).waitFor();
  await page.getByRole("heading", { name: "Your chosen tasks" }).waitFor();
  assert.equal(await page.getByText("Aarav").count(), 0);

  await page.goto("http://localhost:3000/progress");
  await page.getByText("1 of 1").waitFor();
  await page.getByRole("heading", { name: "Your task activity" }).waitFor();
  assert.equal(await page.getByText("8 of 10").count(), 0);

  const routes = [
    "/",
    "/start",
    "/today",
    "/library",
    "/coach",
    "/study",
    "/progress",
  ];
  const widths = [320, 390, 768, 1024, 1586];
  for (const route of routes) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 992 });
      await page.goto("http://localhost:3000" + route, {
        waitUntil: "domcontentloaded",
      });
      await page.locator("h1").waitFor();
      const measure = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        heading: document.querySelector("h1")?.textContent ?? "",
      }));
      assert.equal(measure.viewport, width, route + " viewport");
      assert.ok(
        measure.document <= width,
        route + " overflows at " + width + "px",
      );
      assert.ok(measure.heading.trim(), route + " missing heading");
      const visibleCopy = await page.locator("body").innerText();
      assert.doesNotMatch(
        visibleCopy,
        /local demo|design preview|sample dashboard|illustrative activity|no student account/i,
        route + " exposes internal copy",
      );
    }
  }

  for (const [width, height] of [
    [1680, 874],
    [1366, 768],
    [1280, 720],
    [1024, 768],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("http://localhost:3000/coach");
    await page.getByRole("heading", { name: "Your session" }).waitFor();
    const fit = await page.evaluate(() => ({
      pageHeight: document.documentElement.scrollHeight,
      viewportHeight: document.documentElement.clientHeight,
      composerBottom:
        document.querySelector(".journey-composer")?.getBoundingClientRect()
          .bottom ?? Infinity,
      planButtonBottom:
        document.querySelector(".journey-create-room")?.getBoundingClientRect()
          .bottom ?? Infinity,
    }));
    assert.ok(
      fit.pageHeight <= height,
      `Coach page scrolls at ${width}x${height}`,
    );
    assert.ok(
      fit.composerBottom <= height,
      `Coach composer hidden at ${width}x${height}`,
    );
    assert.ok(
      fit.planButtonBottom <= height,
      `Coach plan action hidden at ${width}x${height}`,
    );
  }

  await page.setViewportSize({ width: 1586, height: 992 });
  await page.goto("http://localhost:3000/coach");
  await page.locator(".side-nav .nav-item").first().waitFor();
  const expectedNavigation = ["Coach", "Today", "Study", "Library", "Progress"];
  for (const selector of [".side-nav", ".mobile-nav"]) {
    assert.deepEqual(
      await page.locator(selector + " .nav-item span").allTextContents(),
      expectedNavigation,
      selector + " navigation order",
    );
  }
  await page.getByRole("button", { name: "Collapse sidebar" }).waitFor();
  const expandedAlignment = await page.evaluate(() => {
    const bounds = (selector) =>
      document.querySelector(selector).getBoundingClientRect();
    const logo = bounds(".sidebar .brand-icon");
    const brandText = bounds(".sidebar .brand-name");
    const navIcon = bounds(".side-nav .nav-item svg");
    const navText = bounds(".side-nav .nav-item span");
    const toggle = bounds(".sidebar-toggle");
    const toggleIcon = bounds(".sidebar-toggle svg");
    const toggleText = bounds(".sidebar-toggle span");
    return {
      logoCenter: logo.left + logo.width / 2,
      navCenter: navIcon.left + navIcon.width / 2,
      brandTextLeft: brandText.left,
      navTextLeft: navText.left,
      toggleIconLeft: toggleIcon.left,
      navIconLeft: navIcon.left,
      toggleTextLeft: toggleText.left,
      footerGap: window.innerHeight - toggle.bottom,
    };
  });
  assert.ok(
    Math.abs(expandedAlignment.logoCenter - expandedAlignment.navCenter) <= 1,
    "Brand icon and navigation icons should align",
  );
  assert.ok(
    Math.abs(expandedAlignment.brandTextLeft - expandedAlignment.navTextLeft) <=
      1,
    "Brand name and navigation labels should align",
  );
  assert.ok(
    Math.abs(
      expandedAlignment.toggleIconLeft - expandedAlignment.navIconLeft,
    ) <= 1,
    "Collapse icon should align with navigation icons",
  );
  assert.ok(
    Math.abs(
      expandedAlignment.toggleTextLeft - expandedAlignment.navTextLeft,
    ) <= 1,
    "Collapse label should align with navigation labels",
  );
  assert.ok(
    expandedAlignment.footerGap <= 24,
    "Collapse control should sit at sidebar bottom",
  );
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForFunction(
    () =>
      document.querySelector(".sidebar")?.getBoundingClientRect().width === 210,
  );
  const narrowAlignment = await page.evaluate(() => {
    const bounds = (selector) =>
      document.querySelector(selector).getBoundingClientRect();
    const logo = bounds(".sidebar .brand-icon");
    const navIcon = bounds(".side-nav .nav-item svg");
    return {
      logoCenter: logo.left + logo.width / 2,
      navCenter: navIcon.left + navIcon.width / 2,
      brandTextLeft: bounds(".sidebar .brand-name").left,
      navTextLeft: bounds(".side-nav .nav-item span").left,
      footerGap: window.innerHeight - bounds(".sidebar-toggle").bottom,
    };
  });
  assert.ok(
    Math.abs(narrowAlignment.logoCenter - narrowAlignment.navCenter) <= 1,
    "Brand icon should align in narrow desktop sidebar",
  );
  assert.ok(
    Math.abs(narrowAlignment.brandTextLeft - narrowAlignment.navTextLeft) <= 1,
    "Brand name should align in narrow desktop sidebar",
  );
  assert.ok(
    narrowAlignment.footerGap <= 24,
    "Collapse control should stay at bottom",
  );
  await page.setViewportSize({ width: 1586, height: 992 });
  await page.waitForFunction(
    () =>
      document.querySelector(".sidebar")?.getBoundingClientRect().width === 246,
  );
  await page.getByRole("button", { name: "Collapse sidebar" }).click();
  await page.waitForFunction(
    () =>
      document.querySelector(".sidebar")?.getBoundingClientRect().width === 58,
  );
  assert.ok(await page.locator(".sidebar .brand-icon").isVisible());
  assert.ok(await page.locator(".sidebar .brand-name").isHidden());
  await page.reload();
  await page.locator(".app-shell.sidebar-is-collapsed").waitFor();
  await page.getByRole("button", { name: "Expand sidebar" }).click();
  await page.waitForFunction(
    () =>
      document.querySelector(".sidebar")?.getBoundingClientRect().width === 246,
  );

  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto("http://localhost:3000/library");
  await page.getByText("No documents yet").waitFor();
  await page.getByLabel("Select study material").setInputFiles({
    name: "My motion notes.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Motion notes\nSpeed is distance divided by time."),
  });
  await page.getByText("Text was extracted.", { exact: false }).waitFor();
  await page
    .getByLabel("Correct extracted text")
    .fill(
      "Motion notes\nSpeed is distance divided by time.\nDistance is a scalar.",
    );
  await page.getByRole("button", { name: "Save corrected text" }).click();
  await page.getByRole("button", { name: "I checked this source" }).click();
  await page.getByText("Document review saved.").waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: /My motion notes.txt/ }).click();
  await page.waitForFunction(() => {
    const action = document
      .querySelector(".library-study-link")
      ?.getBoundingClientRect();
    return action && action.top >= 0 && action.bottom <= innerHeight;
  });
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.getByRole("link", { name: "Open in Study" }).click();
  await page.getByText("Distance is a scalar.").waitFor();
  await page
    .getByRole("heading", {
      name: "No practice questions yet",
    })
    .waitFor();
  await page.reload();
  await page.getByText("Distance is a scalar.").waitFor();

  await page.goto("http://localhost:3000/coach");
  await page.getByLabel("Ask Ranjan Sir").fill("What is speed?");
  await page.getByRole("button", { name: "Send question" }).click();
  await page.getByText(/I found this in My motion notes.txt/).waitFor();
  await page
    .getByRole("link", {
      name: /My motion notes.txt.*page\/section 1/,
    })
    .waitFor();

  await page.evaluate(async () => {
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open("ranjan-sir-study-documents", 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const transaction = database.transaction("documents", "readwrite");
      const store = transaction.objectStore("documents");
      const request = store.getAll();
      request.onsuccess = () => {
        const document = request.result.find(
          (item) => item.name === "My motion notes.txt",
        );
        document.analysis.questions = [
          {
            id: "speed-question",
            prompt: "How is speed calculated?",
            answer: "Speed is distance divided by time.",
            hint: "Look for the relation between distance and time.",
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
        ];
        store.put(document);
      };
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
    database.close();
  });
  await page.goto("http://localhost:3000/study");
  await page.getByRole("button", { name: "Short test" }).click();
  await page.getByText(/Question 1 of 2: How is speed calculated/).waitFor();
  await page
    .getByLabel("Answer practice question")
    .fill("distance divided by time");
  await page.getByRole("button", { name: "Send message" }).click();
  await page
    .getByText(/Question 2 of 2: Is distance scalar or vector/)
    .waitFor();
  await page.getByLabel("Answer practice question").fill("scalar");
  await page.getByRole("button", { name: "Send message" }).click();
  await page
    .getByText(/Short test complete.*No score has been assigned/)
    .waitFor();

  await page.goto("http://localhost:3000/library");
  await page.getByRole("button", { name: /My motion notes\.txt/ }).click();
  await page.getByRole("button", { name: "Analyse again" }).click();
  await page.getByText("Text was extracted.", { exact: false }).waitFor();
  assert.match(
    await page.getByLabel("Correct extracted text").inputValue(),
    /Distance is a scalar/,
  );

  await page.setContent(
    '<h1>Motion worksheet</h1><p>Speed is distance divided by time.</p><div style="page-break-before:always"><h1>Second page</h1><p>Acceleration changes speed.</p></div>',
  );
  const pdf = await page.pdf({ format: "A4" });
  await page.goto("http://localhost:3000/library");
  await page.getByLabel("Select study material").setInputFiles({
    name: "My worksheet.pdf",
    mimeType: "application/pdf",
    buffer: pdf,
  });
  await page.getByText("Text was extracted.", { exact: false }).waitFor();
  await page.getByRole("link", { name: "Open in Study" }).click();
  await page.waitForFunction(() => {
    const canvas = document.querySelector(".study-pdf-page canvas");
    return canvas instanceof HTMLCanvasElement && canvas.width > 0;
  });
  await page.getByRole("link", { name: "Open original PDF" }).waitFor();
  await page.getByRole("button", { name: "Next PDF page" }).click();
  await page.getByText("2 / 2").waitFor();

  const removedRoute = await page.goto("http://localhost:3000/review");
  assert.equal(removedRoute?.status(), 404);
  await page.goto("http://localhost:3000/progress");
  await page.getByRole("heading", { name: "Your task activity" }).waitFor();
  await page.getByText("1 of 1").waitFor();

  await page.goto("http://localhost:3000/coach");
  const profileButton = page.getByRole("button", {
    name: "Open profile menu for Maya",
  });
  await profileButton.click();
  const menu = page.getByRole("menu", { name: "Profile options" });
  await menu.getByRole("menuitem", { name: /My profile/ }).waitFor();
  await menu.getByRole("menuitem", { name: /Settings/ }).waitFor();
  await menu.getByRole("menuitem", { name: /Sign out/ }).waitFor();
  assert.match(page.url(), /\/coach$/, "Profile menu must stay on Coach");
  await page.keyboard.press("ArrowDown");
  assert.ok(
    await menu
      .getByRole("menuitem", { name: /Settings/ })
      .evaluate((item) => item === document.activeElement),
    "Arrow Down should focus Settings",
  );
  await page.keyboard.press("Escape");
  assert.equal(await menu.count(), 0, "Escape should close the menu");
  await profileButton.click();
  await menu.getByRole("menuitem", { name: /Settings/ }).click();
  await page.waitForURL("http://localhost:3000/settings");
  await page.getByRole("heading", { name: "Settings" }).waitFor();
  assert.equal(
    await page.locator('main a[href="/profile"]').count(),
    0,
    "Settings should not link to My profile",
  );
  await page.getByPlaceholder("Paste Gemini key").fill("gemini-test-key-123");
  await page
    .getByPlaceholder("Paste Deepgram key")
    .fill("deepgram-test-key-123");
  await page.getByRole("button", { name: "Save settings" }).click();
  await page.getByText("Settings saved.").waitFor();
  await page
    .getByRole("button", { name: "Open profile menu for Maya" })
    .click();
  await page.getByRole("menuitem", { name: /My profile/ }).click();
  await page.waitForURL("http://localhost:3000/profile");
  await page.getByRole("heading", { name: "My profile" }).waitFor();
  assert.ok(
    (await page.locator(".profile-badge-status.is-earned").count()) >= 1,
    "Completing a Study room task should earn a badge",
  );
  assert.equal(await page.getByLabel("Name").count(), 0);
  await page.getByRole("button", { name: "Edit details" }).click();
  await page.getByLabel("Name").fill("Temporary");
  await page.getByRole("button", { name: "Cancel" }).click();
  assert.equal(await page.getByLabel("Name").count(), 0);
  await page.getByRole("button", { name: "Edit details" }).click();
  assert.equal(await page.getByLabel("Name").inputValue(), "Maya");
  await page.getByLabel("Email", { exact: false }).fill("maya@example.com");
  await page.getByLabel("Class").selectOption("10");
  await page
    .getByLabel("Goal", { exact: false })
    .selectOption("Build a steady routine");
  await page.getByRole("button", { name: "Save profile" }).click();
  await page.getByText("Profile saved.").waitFor();
  await page.getByLabel("Choose profile photo").setInputFiles({
    name: "avatar.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLqNAAAAABJRU5ErkJggg==",
      "base64",
    ),
  });
  await page.locator(".profile-large-avatar img").waitFor();
  await page.locator(".avatar-photo").waitFor();
  await page.getByRole("heading", { name: "Milestones & badges" }).waitFor();
  await page.getByRole("button", { name: "Next badges" }).click();
  await page.waitForFunction(
    () => document.querySelector(".profile-badge-track")?.scrollLeft > 0,
  );
  await page
    .getByRole("button", { name: "Open profile menu for Maya" })
    .click();
  await page.getByRole("menuitem", { name: /Settings/ }).click();
  assert.equal(
    await page.getByPlaceholder("Paste Deepgram key").inputValue(),
    "deepgram-test-key-123",
  );
  await page.goto("http://localhost:3000/coach");
  await page
    .getByRole("heading", { name: /What should we work on, Maya/ })
    .waitFor();
  const invalidVoiceStatus = await page.evaluate(async () => {
    const form = new FormData();
    form.append(
      "audio",
      new Blob(["recording"], { type: "audio/webm" }),
      "test.webm",
    );
    return (
      await fetch("/api/voice/transcribe", { method: "POST", body: form })
    ).status;
  });
  assert.equal(invalidVoiceStatus, 400);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000/profile");
  await page.getByRole("heading", { name: "My profile" }).waitFor();
  await page.getByRole("button", { name: "Edit details" }).click();
  assert.equal(
    await page.getByLabel("Goal", { exact: false }).inputValue(),
    "Build a steady routine",
  );
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Profile must fit the mobile viewport",
  );
  await page.goto("http://localhost:3000/settings");
  await page.getByRole("heading", { name: "Settings" }).waitFor();
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Settings must fit the mobile viewport",
  );
  await page
    .getByRole("button", { name: "Open profile menu for Maya" })
    .click();
  const mobileMenu = page.getByRole("menu", { name: "Profile options" });
  const bounds = await mobileMenu.boundingBox();
  assert.ok(
    bounds && bounds.x >= 0 && bounds.x + bounds.width <= 390,
    "Profile menu should fit on mobile",
  );
  await mobileMenu.getByRole("menuitem", { name: /Sign out/ }).click();
  await page.waitForURL("http://localhost:3000/");
  const signedOutState = await page.evaluate(() => ({
    profile: sessionStorage.getItem("ranjan-demo-profile"),
    starter: sessionStorage.getItem("ranjan-demo-starter"),
    room: sessionStorage.getItem("ranjan-demo-room"),
    conversation: sessionStorage.getItem("ranjan-demo-conversation"),
    badges: sessionStorage.getItem("ranjan-demo-completed-tasks"),
    avatar: sessionStorage.getItem("ranjan-demo-avatar"),
    keys: sessionStorage.getItem("ranjan-demo-service-keys"),
    email: sessionStorage.getItem("ranjan-demo-email"),
  }));
  assert.deepEqual(signedOutState, {
    profile: null,
    starter: null,
    room: null,
    conversation: null,
    badges: null,
    avatar: null,
    keys: null,
    email: null,
  });

  await page.evaluate(() => {
    sessionStorage.setItem(
      "ranjan-demo-profile",
      JSON.stringify({
        name: "Rahul",
        grade: 11,
        board: "CBSE",
        entranceExam: null,
        pace: "steady",
      }),
    );
  });
  await page.goto("http://localhost:3000/profile");
  await page
    .getByRole("heading", { name: "Your study history starts here" })
    .waitFor();
  assert.equal(await page.locator(".profile-snapshot-card").count(), 0);
  await page
    .getByText("Complete one study task to earn your first badge.")
    .waitFor();

  const profileErrors = [];
  page.on("pageerror", (error) => profileErrors.push(error.message));
  await page.evaluate(() => {
    sessionStorage.setItem(
      "ranjan-demo-profile",
      JSON.stringify({
        name: "Rahul",
        grade: 11,
        board: "CBSE",
        entranceExam: null,
        pace: "steady",
      }),
    );
    sessionStorage.setItem(
      "ranjan-demo-completed-tasks",
      JSON.stringify([
        {
          roomId: 1,
          taskId: "valid",
          taskCount: 1,
          completedAt: Date.now(),
        },
        {
          roomId: 2,
          taskId: "invalid",
          taskCount: 1,
          completedAt: 8_640_000_000_000_001,
        },
      ]),
    );
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/profile");
  await page.locator(".profile-overview").waitFor();
  assert.equal(
    await page
      .locator(".profile-snapshot-card")
      .nth(0)
      .locator("strong")
      .innerText(),
    "1",
    "A corrupt activity date must not hide valid completed tasks",
  );
  assert.deepEqual(
    profileErrors,
    [],
    "Profile should render without a runtime error",
  );

  console.log(
    "PASS: guided journey, responsive routes, profile menu, sign out, settings, Coach, Study, Library, and voice API validation.",
  );
} finally {
  await browser.close();
}
