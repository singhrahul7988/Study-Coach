# AGENTS.md — Rebuild Rules

Read PRD.md, ARCHITECTURE.md, and context.md before implementation. The user's current direction takes precedence when it changes a decision here.

## Product and design

- Build Ranjan Sir as a grade 6–12 study coach with persistent student context, source-linked academic help, a realistic daily plan, and age-appropriate time and sleep protection.
- Use the blue, white, black, and grey direction in Mockups as the initial visual reference, with restrained teal, amber, violet, and coral accents for navigation, icons, buttons, and card backgrounds. Do not copy the former Stitch UI or fixed prototype metrics. The five main screens plus landing, setup, and curation are represented in the runnable frontend preview; the original Review mockup is retired. Mobile layouts are implemented and remain open to formal design review. Keep generated images as references and correct their inconsistent dates, Review answer, and incidental status colors in the implemented UI as specified in PRD.md.
- Make screens responsive and accessible. Explain recommendations in plain language and give students control to correct academic context.
- Treat mockup text and numbers as illustrative until real data and behavior exist.

## Code and data

- New application code is TypeScript. Use the Next.js application and module boundaries in ARCHITECTURE.md.
- Define types and validate data at server boundaries. Avoid any, ignored type errors, and untyped academic records.
- Use PostgreSQL migrations for lasting student state. Do not store live student state in Markdown or process memory.
- Use private file storage for uploads. Keep source/version/page references so academic claims can be checked.
- Keep planning, sleep limits, permissions, and completion rules in deterministic server code. AI output may explain a decision, but cannot override those rules.
- Never present invented syllabus coverage, marks, grades, source citations, or student performance.

## Legacy archive

- Backend/School_Master_Wiki/01_Raw_Sources is historical reference material. Do not modify, move, or delete its contents.
- Backend/School_Master_Wiki/log.md is historical provenance and remains append-only.
- Do not automatically ingest legacy sources. Verify curriculum year, board, grade, rights, and extraction quality first.

## Process

- Keep work scoped to the request. Do not commit or push unless the user explicitly asks.
- For implementation changes, run configured lint, type checks, build, and relevant tests before finishing.
- For documentation-only changes, check links, paths, and consistency between PRD.md, ARCHITECTURE.md, context.md, and README.md.
- If a decision is missing, make a small, reversible choice consistent with the product direction and record it in context.md. Ask only when the choice would materially change scope or risk.
