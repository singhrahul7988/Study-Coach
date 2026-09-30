# Ranjan Sir — Project Context

Updated: 2026-09-30
Status: A responsive landing-to-Coach-to-Study demo journey is runnable. Own-document parsing is available locally; account and database integration have not started.

## Product direction

Ranjan Sir is a personal study coach for grades 6–12. It should use a student's academic material, schedule, attempts, and mistakes to recommend realistic study work, provide source-linked help, protect an age-appropriate sleep window, and show evidence of learning. PRD.md defines behavior and ARCHITECTURE.md defines the planned system.

## Decisions in force

- The primary navigation order is Coach, Today, Study, Library, and Progress on desktop and mobile. The root route is now a bright single-viewport landing page; Today moved to /today.
- The landing waveform is replaced with floating plan, progress, and Library feature cards based on the latest visual reference. The cards explain the journey without invented scores, task completions, or dates. Tall phones show one readable plan card below the CTA; shorter phones prioritize the CTA. Motion is subtle and respects reduced-motion settings.

- The frontend is a Next.js and TypeScript application in `frontend/`, using the supplied portrait logo, a blue and white surface and action palette. Primary text is near-black and supporting text is grey; navigation and feature icons use blue, teal, violet, amber, and coral accents only on the icons. Coach actions and its chat use blue. Curation now uses a compact five-step blue and white status panel. The current step stays visible beside the progress bar on short phones, and the class and pace summary sits inside the panel. Each completion follows real profile, Library, or Coach work; the last step waits for the room transition. The layout adapts to narrow phones and reduces motion when requested.
- Library and Study no longer show a fabricated worksheet. Students can add PDF, `.docx`, `.txt`, and `.md` sources; PDF and Word/text extraction runs in a local server route. PDF pages render in Study. The original file, extracted text, and review state persist in browser IndexedDB on this device.
- Gemini is optional and uses either a server-only environment key or a tab-scoped key entered in Settings for the local demo. It drafts summaries, topics, and source-linked practice questions. Extracted text and AI output require student review. Scanned PDFs can be visually rendered but currently lack OCR-backed extraction.
- My profile now follows the supplied full-width identity, two-column details/activity, and horizontal badge layout. Activity cards show only recorded task completions, study days, completed rooms, and dates; the page never presents invented accuracy or hours. Optional personal goals and PNG/JPG/WebP photos are stored in this browser tab; the photo appears in the header and clears on sign out. Corrupt saved activity entries are skipped individually so valid history remains visible; an unexpected profile load failure shows a retry instead of an indefinite loading state.
- My profile now opens on a read-only summary with Edit details on demand. Activity totals appear once, badge cards have room to read, and a new student sees a focused next action and first-badge preview instead of zero-filled charts.
- The badge carousel now uses colored, layered hexagonal emblems, subtle per-badge card tints, and distinct earned, in-progress, and locked states, following the latest supplied badge reference. Five legible cards show at common desktop widths; smaller layouts show fewer. Progress and status use only recorded task and study-day activity.
- Settings is a focused key-management page: it no longer repeats My profile navigation or implementation-focused copy. It explains Gemini document help, Deepgram voice input, and temporary key use in student-facing language.
- The profile button opens a menu for My profile, Settings, and Sign out without leaving the current screen. My profile and Settings each open dedicated responsive pages. My profile edits student details and optional email and shows evidence-based badges for completed Study room tasks. Badge activity is tab-scoped, cleared on sign out, and avoids streak pressure. Settings manages Gemini and Deepgram keys. Sign out clears the current tab profile, plan, conversation, email, and API keys, then returns to the landing page; IndexedDB Library files remain on this device. My profile edits name, optional email, class, board, entrance goal, and pace; Settings edits demo-only Gemini and Deepgram keys. Keys and email remain in session storage for this tab, and keys are sent through same-origin local routes only when the student requests analysis or records a voice question. Deepgram transcription requests opt out of model improvement. The local provider routes are disabled in production until student sign-in, ownership checks, and rate limits are added. Supabase environment placeholders do not enable cloud storage or sync.
- Today keeps its greeting, starting plan, and two support cards within common desktop viewport heights by reducing excess vertical spacing; at 981-1040px it retains two columns. Its support links change color on hover without underlining.
- Today now shows the student's selected study-room tasks or a starting prompt. Progress shows only tasks the student actually chose and marked done; fabricated preview scores and assessments were removed. Coach uses the student's setup and reviewed Library excerpts without claiming unsourced academic answers.
- Coach's composer uses three icon-led suggestion pills, an expandable set of extra prompts, and a blue and white input row. At narrow widths, suggestions scroll horizontally; expanded extras use a short internal scroll area so the input stays visible.
- Coach shows a simple Your Coach heading above the conversation. Redundant class, goal, pace, and source chips were removed from this header; the same setup remains available through the profile control, settings, plan, and source-aware replies.
- The Coach side panel is a compact starting outline with the real starter task durations, then a short selected-task and source summary after a reply. It does not stretch to the chat height.
- Coach replies now place selectable, pace-limited task cards inside the conversation. The latest reply keeps the Create study plan action, which saves the selected tasks and opens the timed Study room; the side panel shows a short session summary. Topic wording is derived only from the student question or a matching reviewed source. The transparent Ranjan Sir portrait is used for Coach messages in both chats.
- Demo setup, Coach messages, and the room timer stay in this browser tab through session storage. The Coach route calculates pace-limited tasks in server code and returns exact source excerpts when relevant. It does not call Gemini or another external AI provider. The long-term design uses Supabase PostgreSQL for durable records, Auth for identity, private Storage for uploads, and a background worker for processing. Planning and sleep limits will be deterministic server rules.
- Do not reintroduce the old FastAPI flow, Vite frontend, prompt files, or Markdown student database.

- White and pale blue remain the main surfaces, blue is the action color, black and grey are the text hierarchy, and distinct feature colors appear on icons only. The landing remains one viewport tall; mobile setup and Study surfaces reveal their next action sooner.

- The standalone Review screen and route have been removed. The sidebar now has a smaller brand, a bottom-aligned collapse control, and tighter navigation spacing. Review as a learning activity remains planned within Study and Progress.
- The desktop sidebar is now an inset, rounded rail with a soft shadow and no hard brand or edge dividers. Its brand center aligns with the sticky topbar center at 42 px; the logo/nav icon centers and brand/nav text starts align exactly in expanded state, and the icon/toggle centers align when collapsed. The topbar remains 84 px high for Coach, Study empty, and account viewport calculations.

- Get started now opens a path choice at /choose. Independent study continues through /start. The school branch has /school/sign-in, /school/overview, and /school/student as four reviewable screens including the choice page. School sign-in accepts no credentials into a backend or browser storage; the management preview is openly reachable because it contains only empty states and no student records. This small, reversible preview uses the existing 266 px sidebar slot, 46 px navigation rows, 84 px header, blue actions, and neutral surfaces. Student and staff authorization, school data contracts, and actual scheduling are deferred until the design is reviewed.

## Repository map

- `frontend/src/app/`: landing, setup, curation, five main page routes, screen styles, and the local document and Coach routes.
- `frontend/src/components/`: shared shell, screens, and PDF page renderer.
- `frontend/src/lib/server/`: extraction, optional Gemini document analysis, and deterministic demo planning.
- `frontend/src/lib/documentStore.ts`: browser IndexedDB document storage.
- `frontend/src/types/`: typed document, preview, and demo journey models.
- `frontend/public/pdf.worker.min.mjs`: PDF.js browser renderer worker.
- `frontend/.env.example`: server-only Gemini settings and future Supabase placeholders.
- `Mockups/`: unchanged desktop references.
- `Backend/School_Master_Wiki/01_Raw_Sources/`: untouched historical source archive.

## Next work

1. Add student authentication, ownership checks, private Supabase Storage, durable records, and rate limits; then enable the analysis endpoint in production.
2. Add OCR or a reviewed multimodal extraction path for scanned PDFs and images; confirm answer quality with real school documents.
3. Connect the demo journey to authenticated student records, full source-grounded Coach answers, saved Study attempts, mistake retries, and evidence-based Progress.
4. Add deterministic planning and sleep protection, then complete mobile and accessibility review.

See README.md for local setup and checks.