# CODEBUDDY.md This file provides guidance to CodeBuddy when working with code in this repository.

## Repository Status
- The repository now contains a Next.js App Router project scaffolded with TypeScript, Tailwind CSS, and ESLint.
- A complete single-page `Whack-a-Mole` game is implemented with modular game logic and reusable UI components.

## Verified Development Commands
Run commands from the repository root:

- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Lint the codebase: `npm run lint`
- Build production bundle: `npm run build`
- Start production server: `npm run start`

## High-Level Architecture
The app follows a simple UI + logic + persistence split.

- `app/layout.tsx`: Root layout, metadata, and global shell.
- `app/page.tsx`: Main game orchestration (state machine, timers, round lifecycle, and event wiring).
- `components/game-hud.tsx`: Score, time, and best-score display.
- `components/mole-grid.tsx`: Interactive 3×3 mole-hole grid and hit feedback rendering.
- `components/game-controls.tsx`: Start/restart control actions bound to game status.
- `lib/game-config.ts`: Game constants and shared status type.
- `lib/game-engine.ts`: Pure helper logic (hole generation, random non-repeat selection, hit validation, score comparison).
- `lib/high-score.ts`: Browser-safe `localStorage` wrappers for loading/saving best score.

### Data Flow Overview
1. User starts or restarts a round.
2. Timer + spawn loops begin; a random active hole is selected each tick.
3. Valid clicks on active moles increment score once per spawn.
4. On timer end, loops stop and final score is compared to persisted best score.
5. Best score is saved to `localStorage` and shown in HUD and end panel.
