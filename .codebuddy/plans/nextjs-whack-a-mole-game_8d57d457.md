---
name: nextjs-whack-a-mole-game
overview: Scaffold a new Next.js app in this empty repository and implement a playable whack-a-mole game with score, timer, random mole behavior, and restart flow.
design:
  architecture:
    framework: react
    component: shadcn
  styleKeywords:
    - Arcade Modern
    - Glassmorphism Light
    - High Contrast Feedback
    - Micro Animations
  fontSystem:
    fontFamily: Poppins
    heading:
      size: 32px
      weight: 700
    subheading:
      size: 20px
      weight: 600
    body:
      size: 16px
      weight: 400
  colorSystem:
    primary:
      - "#7C3AED"
      - "#06B6D4"
      - "#F59E0B"
    background:
      - "#0F172A"
      - "#111827"
      - "#1F2937"
    text:
      - "#F9FAFB"
      - "#D1D5DB"
      - "#FFFFFF"
    functional:
      - "#22C55E"
      - "#EF4444"
      - "#F59E0B"
      - "#38BDF8"
todos:
  - id: scaffold-nextjs-app
    content: Initialize Next.js TypeScript app with Tailwind in workspace root
    status: completed
  - id: implement-game-engine
    content: Create game constants, random spawn logic, timer, and score rules in lib modules
    status: completed
    dependencies:
      - scaffold-nextjs-app
  - id: build-game-ui
    content: Build page and components for HUD, mole grid, controls, and end-state panel
    status: completed
    dependencies:
      - implement-game-engine
  - id: add-persistence-and-feedback
    content: Integrate localStorage high score and hit/spawn visual feedback interactions
    status: completed
    dependencies:
      - build-game-ui
  - id: verify-and-document-commands
    content: Validate dev/build/lint workflow and update CODEBUDDY.md with actual architecture and commands
    status: completed
    dependencies:
      - add-persistence-and-feedback
---

## User Requirements

Build a complete **Whack-a-Mole game** in this workspace using Next.js.
The repository is currently empty except `CODEBUDDY.md`, so the implementation should include initial project scaffolding and a playable browser game page.

## Product Overview

A single-page arcade game where players click appearing moles within a time limit to earn points.
The UI should be clear, fast, and game-like: visible score/timer, interactive mole holes, and obvious start/restart flow.

## Core Features

- Start, play, and restart one full timed game loop.
- Random mole appearance across a fixed grid (e.g., 3×3), with no unfair instant repeats when possible.
- Score system for successful hits; optional miss handling kept simple and consistent.
- Real-time game HUD: current score, remaining time, game state.
- End-of-game summary with final score and replay action.
- Local best score persistence in browser storage.
- Responsive layout for desktop-first web with usable mobile behavior.

## Tech Stack Selection

- **Framework**: Next.js (App Router) + React + TypeScript
- **Styling**: Tailwind CSS (project default for fast, consistent UI composition)
- **State**: React hooks (`useState`, `useEffect`, `useRef`) for deterministic timer/game-loop control
- **Persistence**: `localStorage` for high score

## Implementation Approach

Implement a single game page with a small, explicit game-state model (`idle`, `running`, `ended`) and a timed loop that periodically selects active mole positions.
Core decisions:

1. Keep logic client-side for minimal latency and simplicity.
2. Separate pure game utilities (random selection, score/time constants) from UI rendering.
3. Use interval/timeout refs with strict cleanup to avoid duplicate timers and memory leaks.

Performance & reliability:

- Grid updates are **O(n)** per tick (`n = hole count`, small constant like 9), negligible runtime cost.
- Avoid unnecessary re-renders by updating only essential state and using stable callbacks.
- Ensure all timers are cleared on unmount/restart to prevent race conditions.

## Implementation Notes (Execution Details)

- Keep game logic in dedicated module(s), not inline in JSX, to reduce regression risk.
- Guard `localStorage` reads/writes in client context only.
- Prevent multi-click score inflation on same mole appearance (mark hit once per spawn).
- Preserve compatibility with standard Next.js dev/build flows; avoid unrelated tooling changes.

## Architecture Design

- **UI Layer**: Page + presentational components (HUD, grid, control panel, result panel)
- **Game Logic Layer**: Tick scheduling, random mole selection, scoring/time transitions
- **Persistence Layer**: High-score read/write utility

Data flow:
User starts game → game loop emits active hole → click event validates hit → score/time updates → timer ends → result + stored best score.

## Directory Structure Summary

New Next.js project initialized in `/Users/chapman/Desktop/temp/nextjs/simple_game`, with game-specific modules added.

- `/Users/chapman/Desktop/temp/nextjs/simple_game/package.json` **[NEW]**: scripts and dependencies for Next.js app lifecycle.
- `/Users/chapman/Desktop/temp/nextjs/simple_game/next.config.*` **[NEW]**: framework runtime configuration.
- `/Users/chapman/Desktop/temp/nextjs/simple_game/tsconfig.json` **[NEW]**: TypeScript configuration.
- `/Users/chapman/Desktop/temp/nextjs/simple_game/app/layout.tsx` **[NEW]**: root layout and global shell.
- `/Users/chapman/Desktop/temp/nextjs/simple_game/app/page.tsx` **[NEW]**: main whack-a-mole page composition and state orchestration.
- `/Users/chapman/Desktop/temp/nextjs/simple_game/app/globals.css` **[NEW]**: global and game-theme styles.
- `/Users/chapman/Desktop/temp/nextjs/simple_game/components/game-hud.tsx` **[NEW]**: score, timer, best score display.
- `/Users/chapman/Desktop/temp/nextjs/simple_game/components/mole-grid.tsx` **[NEW]**: interactive hole grid rendering and click handling.
- `/Users/chapman/Desktop/temp/nextjs/simple_game/components/game-controls.tsx` **[NEW]**: start/restart controls and difficulty toggles (if included).
- `/Users/chapman/Desktop/temp/nextjs/simple_game/lib/game-config.ts` **[NEW]**: constants (duration, tick speed, grid size).
- `/Users/chapman/Desktop/temp/nextjs/simple_game/lib/game-engine.ts` **[NEW]**: pure helper logic for mole selection and scoring rules.
- `/Users/chapman/Desktop/temp/nextjs/simple_game/lib/high-score.ts` **[NEW]**: localStorage wrapper with safe client guards.

## Design Approach

Desktop-first modern arcade style with clean cards, vivid accent colors, and clear visual feedback for hits.
Single-screen layout with structured blocks and low-friction interactions:

1. **Top Navigation**: game title and compact navigation identity.
2. **Status Panel**: score, timer, best score in prominent badges.
3. **Game Grid Block**: 3×3 holes with animated mole pop-up states and hit feedback.
4. **Control Block**: start/restart primary actions and optional difficulty selector.
5. **Bottom Navigation/Footer**: simple persistent bar for context and credits.
Use subtle motion (hover/tap transitions, spawn animations) to make gameplay feel responsive without visual noise.