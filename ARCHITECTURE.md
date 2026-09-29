# Ranjan Sir — Technical Architecture

Status: Rebuild architecture decision
Updated: 2026-09-29
Related product requirements: PRD.md

## 1. Decision

Build one TypeScript application with Next.js for the responsive frontend and server routes. Use Supabase PostgreSQL for durable student and study records, Supabase Auth for student identity, and a private Supabase Storage bucket for uploaded files. Use a background worker for document extraction and other slow jobs. Keep external AI services behind a small provider interface. Start as a modular application; do not introduce microservices.

The old FastAPI flow, Markdown student records, prompt directory, and generated wiki are not runtime inputs for the rebuild.

## 2. System boundary

Browser → Next.js pages and server routes → domain services → Supabase PostgreSQL and private Storage.

A background worker reads uploaded documents, extracts text, identifies pages, and reports uncertain fields for student review. The Coach service selects relevant reviewed material and asks an AI provider for a response with citations. The planner computes task order and time limits in ordinary application code before the Coach explains the plan.

Next.js supports server route handlers in TypeScript: https://nextjs.org/docs/app/getting-started/route-handlers

## 3. Application modules

- Identity: accounts, sign-in, student ownership, guardian relationships, and access checks.
- Student context: grade, board, subjects, goals, timetable, available time, and sleep window.
- Library: uploads, source versions, extraction review, search, and deletion.
- Curriculum: verified board/grade/topic mappings and source provenance.
- Planning: assignments, assessments, task ranking, daily plans, changes, and completion.
- Study: sessions, answer drafts, hints, answer checks, and elapsed time.
- Review: mistakes, retry attempts, and later review scheduling.
- Progress: topic evidence, assessment history, and next-focus summaries.
- Coach: conversations, relevant-source selection, citations, uncertainty, and provider calls.

Each module owns its validation, business rules, and data access. Shared UI components and shared typed contracts are kept separate from feature logic.

## 4. Data model

Start with relational records for Account, StudentProfile, GuardianLink, Subject, Assessment, Assignment, Availability, SourceDocument, SourceVersion, SourcePage, Topic, StudyPlan, PlanTask, StudySession, Question, Attempt, Mistake, ReviewSchedule, Conversation, Message, and ActivityEvent.

Every student-owned record has an owner identifier. Source-backed questions, feedback, and recommendations store document/version and page or section references. Save the reason and inputs used for a plan so it can be inspected later. Use database migrations for every schema change.

PostgreSQL can support the initial text search over reviewed source text: https://www.postgresql.org/docs/current/textsearch.html. Add another search system only after measuring a clear need.

## 5. Document and Coach flow

1. Check the upload type and size, save the original privately, and create a processing record.
2. A worker extracts page text and metadata. Keep page boundaries and the original file.
3. Mark low-confidence or conflicting extraction for review. Only approved text is eligible for source-backed answers.
4. Search only sources the student can access. Return short relevant excerpts with source identifiers.
5. The Coach prepares an age-appropriate answer and citations. Validate the response shape and reject citations to sources that were not retrieved.
6. Log the question, selected sources, response status, and errors without placing private document text in routine logs.

Uploaded files and extracted text are data, not instructions to the Coach. Prompt text cannot grant access, change a study limit, or overwrite a source.

## 6. Planning rules

The server calculates time available from the student's commitments and sleep window. It ranks eligible tasks using deadline, assessment relevance, recent errors, demonstrated understanding, and a review schedule. It fits work within the time budget and keeps a buffer. Every task receives a short explanation.

A generated message may explain or suggest alternatives, but the saved plan, completion status, and time boundary come from validated server actions. The student can override a suggestion, and the change is recorded.

## 7. Frontend structure

Use a single-viewport landing page, setup form, and short curation transition before the responsive app shell. The shell contains Coach, Today, Study, Library, and Progress. Coach leads to a chat-based Study room; mistake retries take place there. Keep feature screens and their data calls together. Use reusable controls for source citations, task cards, timers, document viewers, question inputs, and status messages. Use neutral white, grey, and black surfaces and labels, accent icons, blue Coach actions, and a blue-and-white curation waveform as recorded in PRD.md.

Keep server data on the server and fetch it through typed interfaces. Keep only short-lived interaction state in the browser. Save answer drafts; queue safe offline drafts where possible and clearly show sync status. Meet WCAG 2.2 AA where applicable and test keyboard and small-screen use.

## 8. Security and privacy

Require authentication for student records and private files. Check ownership on every read and write, including Coach retrieval. Give guardians only explicit, age-appropriate access. Encrypt traffic and stored files, define retention and deletion behavior, and keep provider credentials on the server. Review school or teacher material permissions before enabling sharing.

Keep the Supabase project URL and publishable key in `frontend/.env.local` for future client integration. Keep `DATABASE_URL` server-only. Create the `student-pdfs` bucket as private with PDF and size restrictions, then add per-student database and Storage policies before enabling uploads. A publishable key does not identify an individual student; Supabase Auth and ownership policies must do that. Do not use a server secret key in browser code.

The API must validate requests and return clear errors. Rate-limit expensive Coach and upload operations. Record security-relevant changes without logging private answer text unnecessarily.

## 9. Verification and operations

Run formatting, lint, TypeScript checks, build, and targeted automated tests in CI. Test the full upload-to-plan-to-study-to-retry journey. Test that sleep boundaries and document permissions cannot be bypassed. Observe upload failures, extraction quality, Coach citation validity, response time, and cost. Use development and production data separately.

## 10. Legacy material policy

Backend/School_Master_Wiki/01_Raw_Sources is a read-only historical source archive. It is not the application's database and is not imported automatically. Its 2025–26 material requires grade, year, licence, and content checks before use. Backend/School_Master_Wiki/log.md is retained as provenance. The six original desktop mockups remain design references; the standalone Review mockup is retired from the active screen set. Responsive mobile adaptations are implemented in the frontend preview; a formal mobile design review remains. The implemented Today and Progress screens use available student activity and empty states in place of the mockups' sample dates, scores, and assessments; the generated image files remain unchanged.

The runnable Next.js preview has a landing page, demo setup, curation transition, five main navigation screens, and a chat-based Study room. Library and the document-specific Study view accept a student's own PDF, .docx, .txt, and .md files locally. A Node route validates uploads, extracts PDF text by page with PDF.js and Word text with Mammoth, and can ask Gemini for a structured summary and practice questions. The browser stores the original file, extracted text, and review state in IndexedDB; Study renders original PDF pages with PDF.js. Gemini quotes are checked against extracted page text, and mismatches are marked for review. The demo profile, optional email, tab-scoped Gemini and Deepgram keys, Coach conversation, and chosen room live in browser session storage. The profile menu navigates to dedicated My profile and Settings pages and offers Sign out. The profile page shows badges derived from completed Study room tasks in tab-scoped session storage; they do not represent verified learning outcomes. In the local demo, Sign out clears tab-scoped profile, plan, conversation, badge activity, email, and provider keys; IndexedDB Library files remain on the device. The profile page edits student details and optional email; the Settings page edits provider keys. Local same-origin routes accept a key only for a student-initiated document analysis or voice transcription; Deepgram requests opt out of model improvement. These browser-entered keys are for the local demo, not production. A validated same-origin Coach route applies deterministic pace, class, and entrance-goal rules and returns matching reviewed source excerpts without calling an external AI provider. This is a prototype: there is no Supabase connection, student authentication, private cloud storage, OCR guarantee, durable study history, or production document-analysis endpoint yet. The production route remains disabled until authenticated ownership and abuse controls are implemented. The next phase is database migrations, private storage, and account integration.
