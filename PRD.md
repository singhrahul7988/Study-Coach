# Ranjan Sir — Product Requirements

Status: Rebuild specification
Updated: 2026-09-29

## 1. Product purpose

Ranjan Sir is a personal study coach for students in grades 6 through 12. It helps a student decide what to study, practise with their own school material, learn from mistakes, and stop at a sensible time. The goal is better learning and grades over time, with a workload the student can sustain.

The coach must remember the student's academic context across sessions. Its advice should use the student's grade, curriculum, timetable, uploaded material, assignments, assessments, past attempts, recurring mistakes, and available time. The student can see and correct the context used for any recommendation.

## 2. Audience and rollout

- Primary user: a student in grades 6–12.
- Secondary user: a guardian who may help a younger student set limits and review a short summary, subject to the student's settings and applicable consent requirements.
- The interface adapts by age: grades 6–8 receive shorter tasks and more planning guidance; grades 9–10 receive more syllabus and exam support; grades 11–12 receive deeper subject planning and more control.
- The first content pathway is CBSE. Accounts and student-owned material work for grades 6–12 from the start. Curated coverage for a grade, board, or subject is advertised only after its sources have been checked.

## 3. Product principles

1. The landing screen introduces Ranjan Sir and starts a guided setup. Once inside, Coach helps the student choose what to study, why, and for how long.
2. Show one main action at a time. A student can shorten, move, or skip a suggested task.
3. Use an age-appropriate sleep window and the student's real commitments when planning. Never reward late-night study with streaks or points.
4. Academic answers and recommendations identify the source document and page or section. If a source is missing or unclear, say so and ask the student to confirm.
5. Help the student think and try again through hints, worked examples, and short checks. Do not silently do the student's homework.
6. Progress reflects demonstrated learning and completed work. Do not present invented scores, estimated grades, or decorative achievements as facts.
7. Student material is private by default. The student can inspect, correct, export, and delete their information.

## 4. Core journey

1. Open the bright, single-viewport landing screen and choose Get started.
2. Enter name, class, board, optional entrance-exam goal, and a gentle, steady, or focused pace. A production profile later adds timetable, assessments, available time, and sleep window.
3. See a short curation transition while a deterministic starting plan is prepared from the setup and reviewed Library material.
4. Enter a fresh Coach conversation. Ask by text or voice input with an optional tab-scoped Deepgram key, falling back to browser recognition where supported. Coach uses available setup and reviewed sources, shows the context it used, and states when a checked academic answer is unavailable.
5. Inspect the suggested task cards in Coach's reply, tick the ones to keep, and create a study plan that opens the Study room.
6. Work in a chat-based Study room with a timer, hints, and source-linked quizzes or short tests when reviewed questions exist. The student explicitly marks tasks done.
7. Add or correct Library material when a source is missing. Later, saved attempts and evidence-based Progress inform the next session across devices.

## 5. Navigation and screens

The landing, setup, and curation screens precede the main navigation. The profile control opens a menu for My profile, Settings, and Sign out. My profile is a dedicated page for editable student details and evidence-based task badges; Settings is a dedicated page for optional demo provider keys. Opening the menu keeps the student on the current screen. The main navigation is Coach, Today, Study, Library, and Progress. Mistake retries belong inside Study; there is no standalone Review screen. Use the blue, white, black, and grey visual direction in Mockups. Those images are design references, not a substitute for functional requirements or accessible implementation.

| Screen | Purpose | Current reference |
| --- | --- | --- |
| Today | Available time, stop time, one priority task, short reviews, deadlines, and plan adjustment | Mockups/1st image.png |
| Library | Manage uploaded academic sources and correct what the coach extracted | Mockups/2nd image.png |
| Coach | Ask by text or voice, inspect context and source excerpts, then select tasks for a study room | Mockups/3d image.png |
| Study | Use a chat-based room with chosen tasks, timer, and source-linked self-checks; Library documents also open in the source viewer | Mockups/4th image.png |
| Progress | Show evidence of learning, recurring errors, upcoming assessments, and next focus | Mockups/6th image.png |

### Current flow and retained mockup references

- Today: Start studying opens the first planned Study task. A source label opens the corresponding Library item. Less time today recalculates the plan, and Resume opens the saved session.
- Library: Add material starts upload and review. Selecting an item opens its source details. Correct this information lets the student edit the context used by the Coach.
- Coach: The student asks a question, reviews the response and suggested plan, ticks tasks, and creates a Study room. Source links open Library.
- Study: The room shows selected tasks and a timer beside chat. A source-linked quiz uses reviewed questions when available, gives a hint, and shows a draft self-check answer without claiming to grade it. The student pauses, ends, and marks tasks done explicitly.
- Progress: A metric opens the attempts behind it. Plan my next session returns to Today with a suggested plan; a Start action opens the relevant Study task.

### Generated mockup corrections for implementation

The original six images remain visual references, but the Review image is retired from the active screen set. Keep the image files as they are; correct sample details when building the working screens:

- Assessment dates shown in retained mockups are inconsistent. When live assessments are connected, derive remaining days from one saved date everywhere.
- Palette: blue, white, black, and grey remain the base. Keep surfaces, tags, chips, buttons, and card backgrounds neutral; reserve accent colors for icons. Coach uses blue, black, and grey for its conversation and main actions. The curation transition uses only blue and white. Meaning never depends on color alone.
- All dates, scores, progress figures, and source labels in the images are sample content. Replace them with saved, source-backed student data.

The design must work on phone, tablet, and desktop. A separate mobile design pass is required.

## 6. Functional requirements

### Profile and schedule

- P1. Create and edit name, grade, board, optional entrance-exam goal, pace, subjects, goals, school/coaching hours, wake time, sleep window, and preferred study times.
- P2. Store upcoming assignments and assessments with dates and source references.
- P3. The student can change today's available time without changing their long-term schedule.

### Study Library

- L1. Accept supported PDFs, images, and text documents, with visible size and format limits.
- L2. Show processing status, detected subject/topic, source date, and extraction confidence where available.
- L3. Let the student correct document details and extracted text. Low-confidence text is marked for review before use.
- L4. Keep document version and page or section location so answers can link back to the original.
- L5. Let the student search, replace, or delete their own material.

### Daily plan

- D1. Build a plan within available time and before the sleep boundary, allowing a break and wind-down buffer.
- D2. Rank tasks using due dates, assessment proximity, recent mistakes, demonstrated understanding, and source availability. Show the reason for each task.
- D3. Support Make it lighter, Add time, Move task, Skip task, and Recalculate.
- D4. Never mark a task done until the student completes or explicitly marks it done.
- D5. A plan and its changes survive refresh and sign-in on another device.

### Coach and study

- C1. Answer a question using relevant approved curriculum material or the student's own sources and show citations.
- C2. Show which profile facts and sources were used. Let the student correct them.
- C3. Ask a clarifying question when the material or request is ambiguous. Separate general guidance from claims grounded in a specific source.
- S1. Show chosen tasks and a timer in a Study chat, with source links and a document viewer reachable from Library. Save answer drafts and elapsed time.
- S2. Offer a hint before a full explanation where this helps learning.
- S3. Check an answer against an explicit answer key or reviewed source when available; otherwise label feedback as provisional.
- S4. Pause, end, or resume a session. The displayed timer must agree with saved session time.

### Study retries and progress

- R1. Record the question, source, attempt, feedback, and reason for a mistake.
- R2. Offer a similar retry in Study and bring difficult topics back on later days.
- G1. Show practice accuracy and recurring mistakes by topic and time period, with links to the underlying attempts.
- G2. Show assessment results entered by the student as entered data, not as a prediction.
- G3. Explain the next recommended focus using evidence from the learning record.

## 7. Data, trust, and safety

- Academic claims must be traceable to a source. Legacy wiki summaries and uploaded documents are not automatically verified.
- Planning limits, ownership checks, and save operations run on the server; a generated coach message cannot override them.
- Student and guardian access must be age appropriate. Collect only data needed for study support and explain who can see it.
- An AI answer must not claim to have graded handwriting, checked a marking scheme, or read a page unless that work actually happened.
- The product supports better study habits and measures learning; it does not promise a particular grade.

## 8. First release and later work

First release: account and student profile, document upload and correction, Today plan, source-aware Coach, focused Study with mistake retries, and evidence-based Progress. Include responsive layouts, accessibility, and persistent data.

Later: handwriting extraction and review, teacher integrations, guardian dashboard, wider verified curriculum library, exam paper generation, and native mobile apps. Each addition requires its own evidence and acceptance criteria.

## 9. Release acceptance

A student can start from the landing page, enter their setup, ask Coach a question, choose tasks, create a timed Study room, upload and review a worksheet, open a cited source, save an attempt, retry a mistake, and see the result in Progress. The plan and data remain after refresh. A shorter available-time setting produces a shorter plan that still respects the sleep window. Missing or uncertain source material is identified honestly. No screen presents sample numbers as live student performance.
