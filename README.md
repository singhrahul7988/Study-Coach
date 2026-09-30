# Ranjan Sir

Ranjan Sir is being rebuilt as a personal study coach for students in grades 6–12. It aims to use each student's own material, schedule, attempts, and mistakes to recommend realistic work and protect time for rest.

## Current status

Open the bright, single-viewport landing page and choose Get started, then choose independent study or the school-connected preview. Independent setup asks for a name, class, board, optional JEE/NEET/other entrance goal, and a gentle, steady, or focused pace. A 3-4 second curation transition prepares a pace-limited starting plan, then Coach opens as a fresh conversation. Students can type or use voice input with a Deepgram key in Settings (or browser speech recognition where supported), inspect the available context, choose tasks in Coach's reply cards, and use Create study plan to open a timed chat-based Study room.

The profile button opens dedicated My profile and Settings pages plus Sign out. My profile has editable study details, an optional personal goal and photo, activity summaries from completed Study room tasks, and evidence-based badges. Profile photos and badge activity are kept in this tab for the demo. Settings manages Gemini and Deepgram keys. Sign out clears the current tab profile, plan, conversation, badge activity, email, and API keys, then returns to the landing page. Uploaded Library files remain saved on this device.

The demo Coach route uses deterministic server rules and may quote matching text from student-reviewed Library sources. It does not call Gemini or generate a full academic explanation. Without a relevant reviewed source, it gives planning guidance and says what is missing. The room can present a source-linked quiz or short test when the Library already contains reviewed practice questions; answers are self-checks, not grades. Demo setup, conversation, and room state live in this browser tab. Today shows the student's current plan or a useful starting state. Progress shows task activity from the student's study room; no invented scores or assessments appear.

Library accepts a student's own PDF, Word .docx, text .txt, and Markdown .md files. A local parser extracts PDF text by page and Word/text content as one section. Students can correct extracted text and open documents in the document-specific Study viewer. Files and review state are saved in browser IndexedDB, not Supabase. Gemini can optionally draft document summaries and practice questions when configured; these drafts require student review. Scanned or image-only PDFs may have no selectable text and have no OCR guarantee.

## Run locally

Use Node.js 22. From the repository root:

```powershell
cd frontend
npm ci
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm run dev
```

Open <http://localhost:3000>. The demo journey uses `/`, `/choose`, `/start`, `/curating`, `/coach`, and `/study`. The main navigation also includes `/today`, `/library`, and `/progress`. The school design preview uses `/school/sign-in`, `/school/overview`, and `/school/student`. School sign-in does not send or save credentials, and the management screens contain no school records. The former `/review` route has been removed.

To enable Gemini document analysis in the local demo, enter a key from [Google AI Studio](https://aistudio.google.com/app/apikey) in Settings. You can also set GEMINI_API_KEY in frontend/.env.local and restart the dev server. `GEMINI_MODEL` defaults to `gemini-3.8-flash` and can be changed there. Profile-entered keys stay in this browser tab and are sent to the same-origin local analysis route when requested. For deployed use, keep the key server-side and never expose or commit it. Without a key, extraction and PDF viewing still work; summaries and questions are unavailable. A live Gemini request cannot be verified without your key. Add a Deepgram key in Settings to transcribe recorded Coach questions; recordings are sent through the local voice route with model-improvement opt-out. Both local provider routes are disabled in production pending sign-in and abuse controls.

Upload limits for this local stage are 10 MB per file, 80 pages per PDF, and 300,000 extracted characters. Files selected for Gemini analysis are sent to Google for processing. Do not upload material you are not allowed to share with that service.

## Supabase and production

`frontend/.env.example` also includes placeholders for Supabase URL, publishable key, private Storage bucket, and server-only database URL. These are reserved for the next phase; entering them does not enable cloud sync. Student sign-in, ownership policies, private Storage, durable records, and background processing are still needed. The document analysis endpoint is deliberately unavailable in production until authenticated ownership and abuse controls are connected. The rest of the app remains a frontend preview.

## Checks and design references

From `frontend/`, run `npm run lint`, `npm run typecheck`, `npm run format:check`, and `npm run build`. With the dev server running on port 3000 and Microsoft Edge installed, `npm run check:ui` tests the guided journey, responsive routes, own-document upload, local persistence, PDF rendering, and selected interactions.

The mockups in `Mockups/` are visual references. `PRD.md` defines the product, `ARCHITECTURE.md` records the intended full system, and `context.md` tracks what is currently built. `Backend/School_Master_Wiki/01_Raw_Sources/` is an untouched historical archive, not application data.