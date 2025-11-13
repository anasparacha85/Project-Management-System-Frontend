# Project — Functionality Summary (so far)

This document summarizes implemented features and important details for the Project Management System frontend at its current state (branch: mybranch).

## Short project overview

- Single-page React application bootstrapped with Vite.
- Uses Redux Toolkit for state management (slices in `src/Slices`).
- UI built with Tailwind CSS. Icons via `lucide-react`.
- Rich-text editing provided by `react-quill`.
- Deployed to Vercel (public folder served from site root).

## Tech stack & scripts

- Node / npm
- Vite (dev server + build)
- React 18
- Redux Toolkit + react-redux
- TailwindCSS
- React Router DOM
- React Quill

Key npm scripts (from `package.json`):

- `npm run dev` — start dev server (Vite)
- `npm run build` — build production bundle
- `npm run preview` — preview built bundle

## High-level feature list (implemented)

The following features have been implemented in the frontend codebase. This list is extracted from pages, modals, slices, and components present under `src/`.

1. Task / Milestone management
   - Task details view with the following sub-features:
     - Title, ID, progress display and editable fields (status, priority, start/due dates).
     - Description using rich-text editor (ReactQuill) with edit/save flow.
     - Save changes and delete task endpoints wired via `ApiService`.
     - Progress bar and overall completion percentage.

2. Comments & Activity feed
   - Fetch and display comments for a task (activity feed) using `ApiServices.GetCommentsByTargetId`.
   - Post a comment flow (textarea + Post Comment button) which POSTs via `ApiServices.PostComment` and refreshes the feed.
   - Plays a comment sound when a comment is posted (audio in `public/sound/comment-sound.mp3`). Note: audio playback has production path considerations (see Known Issues).

3. Subtasks / Checkpoints
   - Fetch subtasks by task id (manager vs employee endpoints) and display checklist UI with completion states.
   - Per-checkpoint navigation to detail pages.

4. Assignments & Team
   - Assign team members to tasks via an Assignees selector component.
   - Displays assignees with avatar, name; manager role can add/remove assignees.

5. Project context & sidebar
   - Project timeline (start/end date) fetch using project details slice.
   - Activity feed and recent updates in sidebar.

6. Pages & routes (observed files)
   - Project pages: project listing, project details, file/document pages
   - Task pages: task detail, task list views
   - Milestones: milestone pages, assignment details, checklists, docs
   - Reports: employee reports, project reports
   - Team management page
   - Auth flows: employee and manager login/signup and logout pages

7. Redux slices & store
   - Slices directory contains: `ProjectSlice`, `TaskSlice`, `SubTaskSlice`, `UserSlice`, `UiSlice` (observed).
   - Central store under `src/store/Store.js`.

8. API client & services
   - `src/apiclient/ApiClient.js` and `src/ApiService/ApiService.js` manage network requests.
   - Common operations: fetch tasks, update task, fetch/post comments, fetch subtasks, project details.

9. Modals
   - Task modal, subtask modal, project creation/edit modals, team add modal and other UI modals under `src/modals/`.

10. Accessibility & UX
   - Uses semantic HTML, visually-hidden icons where needed, and accessible controls where obvious.

## File map (important files / folders)

- `src/` — application source
  - `apiclient/ApiClient.js` — base API client
  - `ApiService/ApiService.js` — high-level API calls
  - `components/` — reusable components (cards, tables, fields)
  - `modals/` — modal dialogs for tasks, subtasks, projects
  - `pages/` — page-level views (dashboard, tasks, projects, reports, auth)
  - `Slices/` — Redux slices
  - `store/Store.js` — Redux store

- `public/` — static assets
  - `sound/comment-sound.mp3` — comment post audio

## How to run (developer flow)

1. Install dependencies

```powershell
cd "d:\ProjectManagement System\frontend"
npm install
```

2. Run dev server

```powershell
npm run dev
```

3. Build for production

```powershell
npm run build
```

4. Preview built site

```powershell
npm run preview
```

## Deployment

- This repo is deployed to Vercel (observed). Put `public/` assets at `public/` and reference them from the site root (e.g. `/sound/comment-sound.mp3`).
- When deploying make sure filenames and casing are correct (Linux production is case-sensitive).

## Known issues and notes

- Audio path: previously code referenced `/public/sound/comment-sound.mp3` which causes 404 in production. The correct public path is `/sound/comment-sound.mp3`. The code has been updated to initialize audio via a ref and call `audio.play()` with error logging.
- Autoplay policy: some browsers block `audio.play()` unless triggered by a user gesture. The comment sound is triggered from a user click in the Post Comment handler (normally allowed), but if you still see blocked play exceptions check the Console for DOMExceptions.
- Bundle size warning: Vite reported some chunks larger than 500 KB during the production build — consider code-splitting large pages to reduce initial bundle size.

## Testing notes

- No automated tests detected in repository (no `test` script in package.json).
- Manual verification steps: create / edit a task, add a comment, inspect network for `comment-sound.mp3` request, check console for playback errors.

## Next suggested improvements

1. Bundle the comment sound via the module system (move into `src/assets` and import) if you prefer hashed assets and bundler-managed URLs.
2. Add unit/integration tests for critical slices (TaskSlice, SubTaskSlice, ApiService mocks).
3. Add code-splitting for heavy pages and lazy-load components to reduce initial bundle size.
4. Add a small UI notification when audio playback fails so users understand why they don't hear sound.

## Contacts / Maintainers

- Primary branch / work on: `mybranch` (repo owner: anasparacha85)
- For questions about backend API surface check `src/ApiService/ApiService.js` and coordinate with the backend team.

---

If you'd like, I can:
- convert the comment sound to a bundled import and update code,
- produce a per-component API contract (Module Design Contract) for major slices,
- or expand this document into a full MDC with diagrams and sequence flows.

Reply with which next step you prefer.
