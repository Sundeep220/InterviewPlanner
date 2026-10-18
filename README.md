# PrepForge

A personal study dashboard for a **35-day Java interview plan** covering DSA, Low-Level Design (LLD), High-Level Design (HLD), and Behavioral topics — built with React, Vite, and Tailwind CSS.

---

## Table of Contents

1. [What is this?](#what-is-this)
2. [Features](#features)
   - [35-Day Study Plan](#1-35-day-study-plan)
   - [Smart Schedule & Ahead/Behind View](#2-smart-schedule--aheadbehind-view)
   - [Day-of-Week Alignment](#3-day-of-week-alignment)
   - [Task Timers](#4-task-timers)
   - [Session Management](#5-session-management)
   - [Problem Links](#6-problem-links)
   - [Java DSA Cheat Sheet](#7-java-dsa-cheat-sheet)
   - [Week & Custom Views](#8-week--custom-views)
3. [Running Locally](#running-locally)
4. [Project Structure](#project-structure)

---

## What is this?

If you have a Java interview coming up and want to follow a structured 35-day plan, this tracker keeps everything in one place. Open it in your browser, click **Let's Begin**, pick a start date, and it builds a personal calendar for you — weekday days (4–5 h of content) on Mon–Fri, weekend days (8–12 h of content) on Sat–Sun, no matter which day you start.

Everything is stored in your browser's `localStorage`. No account, no server, no sign-up.

---

## Features

### 1. 35-Day Study Plan

The plan is split into 5 weeks across four subject areas:

| Week | Focus |
|------|-------|
| Week 1 | Math · Arrays · Two Pointers · Sliding Window · Prefix Sum · LLD L0–L1 · HLD Basics |
| Week 2 | Binary Search · Stack · Deque · Linked List · Trees · LLD L1–L2 · HLD Infra |
| Week 3 | Trees · Heap · Backtracking · Graphs · LLD L2–L3 · HLD Designs |
| Week 4 | Union-Find · Shortest Paths · Trie · Greedy · DP · LLD L3–L4 · HLD Systems |
| Week 5 | DP · Bits · Matrix · Strings · LLD L4–L5 · Full Mock Rounds |

Each day has a list of tasks with:
- **Category** (DSA / LLD / HLD / Behavioral)
- **Estimated time** so you know roughly how long each task takes
- **Problem links** to LeetCode, NeetCode, and fallback platforms
- **Difficulty** (Easy / Medium / Hard / Review / Mock)
- **MUST-DO flag** on tasks that are most interview-critical

**How to use:** Click any day tile → see that day's tasks → tick a task when done.

---

### 2. Smart Schedule & Ahead/Behind View

Once you click **Let's Begin**, every day in the plan gets a real calendar date. The tracker then continuously monitors how you're doing.

The **Schedule Status Panel** in the Dashboard shows:

- A **status headline** in colour — "Behind schedule · 2 days · 5h 30m" (red), "Ahead" (green), "On track" (blue)
- **Planned vs projected finish dates** — the date the plan was supposed to end vs the date it will actually end at your current pace
- A **day progress timeline bar** — Day 1 → Day 35 with a marker showing where you *should* be today
- **Hours breakdown tiles** — planned hours up to today / work completed / how far ahead or behind in minutes
- A **week-by-week grid** — one row per week showing missed days, late days, early days, mini progress bar
- An **overdue days list** — every missed day is clickable and tells you how many tasks remain

**How to use:** Just keep ticking tasks off. The panel recalculates every time you open the app.

---

### 3. Day-of-Week Alignment

The schedule is **type-aware**: weekday plan days (Mon–Fri content, ~4–5 h) only ever land on actual calendar Mon–Fri, and weekend plan days (Sat–Sun content, ~8–12 h) only ever land on actual Sat–Sun.

This means **you can start on any day of the week** and the plan automatically slots each day into the right kind of calendar day. Starting on Wednesday? Days 1–3 land on Wed/Thu/Fri, then Day 4 (weekday content) jumps to Monday — skipping the weekend — and the first weekend-content day lands on Saturday.

**How to use:** In the "Let's Begin" modal, pick any date. The modal shows a live preview: "Day 1 starts Wed 23 Jul · Plan finishes by Sat 6 Sep". No manual adjustment needed.

---

### 4. Task Timers

Every task has a **▶ Start** timer button. Clicking it:
- Starts a stopwatch for that task
- The running time accumulates in `trackedMs` in your browser storage
- Only one timer runs at a time — starting a new one auto-saves the previous

**How to use:** Open a day → find a task → click **▶ Start** when you begin → click **■ Stop** when done (or mark the task complete, which also stops the timer).

Time tracked is shown per task and rolls forward across sessions.

---

### 5. Session Management

The app is smart about browser open/close cycles:

| Scenario | What happens |
|----------|-------------|
| You close the app | Close timestamp is saved; active timer is banked to that moment |
| You reopen within 24 hours | **Resume mode** — timer restarts from where you left off (gap not counted as study time) |
| You reopen after 24+ hours | **New session** — timer stays stopped; schedule recalculates based on elapsed calendar days |

**Resume banner (< 24 h gap):**

When you reopen within 24 h the Dashboard shows a green `↩ Resume` banner with:
- Which day you were on
- How long ago you closed the app
- **Remaining time for today** — e.g. "2h 15m remaining today (1h 30m of 3h 45m done)" with a progress bar
- A **Continue →** button that jumps straight to that day

**New session banner (≥ 24 h gap):**

Shows "Last session 2d ago · Day 3 needs 3h 45m of work" with a **Day 3 →** button.

**How to use:** Just open and close the app normally. Everything is automatic.

---

### 6. Problem Links

Every DSA task shows clickable platform links in priority order:

1. **LeetCode** — always shown first if the problem is free
2. **NeetCode** — shown second (video walkthrough + solution)
3. **Naukri / Code360 / LintCode / GFG** — shown only when LeetCode is premium/paywalled

For premium LeetCode problems (#159, #269, #305, #340, #505, #727) LeetCode is skipped entirely and the best free alternative is shown first.

A **YouTube search link** is also added to every problem so you can find video explanations instantly.

**How to use:** Inside any day's task view, click any platform chip to open the problem in a new tab.

---

### 7. Java DSA Cheat Sheet

A separate page at `/cheatsheet.html` (opens in a new tab, never leaves the tracker). Reachable from the header **📖 Cheat Sheet** button in the top navigation.

The cheat sheet has four parts:

**Part 1 — Java Reference**
Seven sections of ready-to-paste Java: Strings, Arrays, Collections, Comparators, Numbers & Bit Tricks, Character API, and a Pitfalls section covering the most common interview bugs.

**Part 2 — Input Size → Complexity Guide**
A table mapping input size (n ≤ 10 to n ≤ 10⁹) to the maximum complexity you can afford — so you know in seconds whether your O(n²) idea will TLE.

**Part 3 — Pattern Selection Guide**
21-row table: "Signal / keywords in the problem → which pattern to reach for → complexity". Use it during mock rounds to stop guessing.

**Part 4 — Math Foundations**
12 sections, each with:
- **Theory** (blue card) — what the concept is and why it works
- **When to use** (green card) — interview signals
- **Example trace** (violet card) — step-by-step worked example
- **Java code** — copy-ready implementation

Sections cover: Division & Modulo, GCD & LCM, Prime Check & Factorization, Sieve of Eratosthenes, Fast Exponentiation, Modular Arithmetic, Pascal's Triangle / nCr, Catalan Numbers, Fibonacci, Digit Manipulation, Power-of-k Check, Combinatorics.

**Cheat sheet features:**
- Sticky sidebar with 24 nav items; active section highlights as you scroll
- Copy button on every code block (one click → clipboard)
- Dark GitHub-style code blocks
- "Close tab" button — closes the cheat sheet without touching the tracker

---

### 8. Week & Custom Views

Besides the Dashboard, two additional views are available:

**Week View** — shows all 7 days of a given week in a grid. Click any week from the Dashboard to jump here.

**Custom View** — a filtered view showing tasks by category (DSA / LLD / HLD / Behavioral), difficulty, or completion status across the entire plan. Useful for reviewing all Hard problems or all unfinished LLD tasks in one place.

---

## Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

### Steps

```bash
# 1. Clone or download the project
git clone <your-repo-url>
cd InterviewPrepTracker

# 2. Install dependencies (one time only)
npm install

# 3. Start the development server
npm run dev
```

The app opens at **http://localhost:5173**

The cheat sheet is at **http://localhost:5173/cheatsheet.html**

### Other commands

```bash
# Build for production (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview
```

### First run checklist

1. Open http://localhost:5173
2. Click **Let's Begin** → pick your start date → click **Start plan**
3. The plan is now live — each day has a real calendar date
4. Click any day tile to see its tasks
5. Click **▶ Start** on a task to start the timer
6. Tick the checkbox when a task is done
7. Open **📖 Cheat Sheet** (top nav) anytime to reference Java snippets

---

## Project Structure

```
InterviewPrepTracker/
├── src/
│   ├── main.jsx                  # React entry point
│   ├── App.jsx                   # Root layout, routing between views
│   ├── index.css                 # Global Tailwind styles
│   │
│   ├── data/
│   │   ├── studyPlan.js          # All 35 days, tasks, estimates
│   │   └── problemLinks.js       # LeetCode/NeetCode/fallback URL logic
│   │
│   ├── hooks/
│   │   └── useTracking.jsx       # All persistence: timers, completions, sessions
│   │
│   ├── utils/
│   │   ├── schedule.js           # Ahead/behind calculation, day-date alignment
│   │   └── time.js               # Date helpers (addDays, diffDays, weekday check)
│   │
│   ├── components/
│   │   ├── Dashboard.jsx         # Main overview: stats, schedule, resume banner
│   │   ├── DayDetail.jsx         # Single-day task list with timers
│   │   ├── WeekView.jsx          # 7-day week grid
│   │   ├── CustomView.jsx        # Filtered cross-plan task view
│   │   ├── ProblemLinks.jsx      # Platform chips (LC → NC → fallback)
│   │   ├── ScheduleWidgets.jsx   # Schedule card, pills, begin modal
│   │   └── DayTypeBadge.jsx      # Weekday / Weekend badge
│   │
│   └── cheatsheet/
│       ├── main.jsx              # Cheat sheet React entry
│       └── CheatSheet.jsx        # Full cheat sheet component (Parts 1–4)
│
├── cheatsheet.html               # Vite entry for the cheat sheet page
├── index.html                    # Vite entry for the main app
├── vite.config.js                # Multi-page build config
├── tailwind.config.js
└── package.json
```

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI components |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| localStorage | All data persistence (no backend) |

---

## Data & Privacy

All your progress (completed tasks, timer data, start date, session info) is stored **only in your browser's `localStorage`**. Nothing is sent anywhere. Clearing site data in your browser will reset the tracker.
