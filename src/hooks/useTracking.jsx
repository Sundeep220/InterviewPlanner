import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'ipt-tracking-v1';

const EMPTY = {
  startDate: null,
  planStartedAt: null,
  tasks: {},
  days: {},
  activeTimer: null,
  lastVisited: null,
  // ── Session fields ──────────────────────────────────────────────────────────
  lastClosedAt: null,     // ISO — set by beforeunload handler (or heartbeat)
  sessionOpenedAt: null,  // ISO — set when the app opens
  sessionIsResume: false, // true when gap from lastClosed < 12 h
  sessionGapMs: null,     // ms between lastClosedAt and sessionOpenedAt (null = first ever open)
};

const RESUME_MS = 24 * 60 * 60 * 1000; // 24 hours — within the same calendar day

const load = () => {
  try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
  catch { return EMPTY; }
};

const nowIso = () => new Date().toISOString();

// ─── Timer helpers ────────────────────────────────────────────────────────────

/** Close the running timer at `atIso` (ISO string). Banks earned ms up to that moment. */
const closeTimerAt = (s, atIso) => {
  if (!s.activeTimer) return s;
  const { taskId, startedAt } = s.activeTimer;
  const task = s.tasks[taskId] || {};
  const earned = Math.max(0, new Date(atIso).getTime() - new Date(startedAt).getTime());
  return {
    ...s,
    activeTimer: null,
    tasks: {
      ...s.tasks,
      [taskId]: { ...task, trackedMs: (task.trackedMs || 0) + earned, ...(earned > 0 ? { lastWorkedAt: atIso } : {}) },
    },
  };
};

/** Close the running timer right now, optionally banking elapsed time. */
const closeTimer = (s, save) => {
  if (!s.activeTimer) return s;
  return save ? closeTimerAt(s, nowIso()) : { ...s, activeTimer: null };
};

// ─── Day helpers ──────────────────────────────────────────────────────────────

const touchDay    = (s, day, patch) => ({ ...s, days: { ...s.days, [day]: { ...s.days[day], ...patch } } });
const markDayStarted = (s, day)     => (s.days[day]?.startedAt ? s : touchDay(s, day, { startedAt: nowIso() }));

// ─── Context ──────────────────────────────────────────────────────────────────

const TrackingContext = createContext(null);

export function TrackingProvider({ children }) {
  const [state, setState] = useState(load);

  // Keep a ref so the beforeunload handler always sees the latest state
  // without capturing a stale closure.
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  // Persist to localStorage on every state change.
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);

  // Keep multiple open tabs in sync.
  useEffect(() => {
    const onStorage = (e) => { if (e.key === STORAGE_KEY) setState(load()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // ── On mount: session-start + resume/new-session timer handling ─────────────
  useEffect(() => {
    setState(prev => {
      const nowMs  = Date.now();
      const now    = new Date(nowMs).toISOString();
      const closed = prev.lastClosedAt;
      const gapMs  = closed ? nowMs - new Date(closed).getTime() : null;
      const isResume = gapMs !== null && gapMs < RESUME_MS;

      let next = { ...prev, sessionOpenedAt: now, sessionIsResume: isResume, sessionGapMs: gapMs };

      if (prev.activeTimer) {
        if (isResume) {
          // Gap < 12 h — the user just stepped away briefly.
          // Bank earned time up to `lastClosedAt` (don't count the gap),
          // then restart the timer from now.
          const { taskId, day, startedAt } = prev.activeTimer;
          const earned = closed
            ? Math.max(0, new Date(closed).getTime() - new Date(startedAt).getTime())
            : 0;
          const task = prev.tasks[taskId] || {};
          next = {
            ...next,
            activeTimer: { taskId, day, startedAt: now },
            tasks: {
              ...next.tasks,
              [taskId]: {
                ...task,
                trackedMs: (task.trackedMs || 0) + earned,
                ...(earned > 0 ? { lastWorkedAt: closed } : {}),
              },
            },
          };
        } else {
          // Gap ≥ 12 h (or first ever open with a stale timer) — new session.
          // Bank earned time up to `lastClosedAt` (or the timer start if no close was recorded),
          // then stop the timer.
          const { taskId, startedAt } = prev.activeTimer;
          const cutoff = closed || startedAt;
          const earned = Math.max(0, new Date(cutoff).getTime() - new Date(startedAt).getTime());
          const task = prev.tasks[taskId] || {};
          next = {
            ...next,
            activeTimer: null,
            tasks: {
              ...next.tasks,
              [taskId]: {
                ...task,
                trackedMs: (task.trackedMs || 0) + earned,
                ...(earned > 0 ? { lastWorkedAt: cutoff } : {}),
              },
            },
          };
        }
      }

      return next;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps — intentionally runs once on mount

  // ── Heartbeat: update lastClosedAt every minute (crash-safety) ──────────────
  // If the browser crashes (beforeunload never fires), the most recently
  // persisted state will have a lastClosedAt within 1 minute of the crash.
  useEffect(() => {
    const tick = () => {
      setState(s => ({ ...s, lastClosedAt: nowIso() }));
    };
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // ── beforeunload: bank the timer and record close time synchronously ─────────
  // We write directly to localStorage here because setState won't flush
  // before the page is torn down.
  useEffect(() => {
    const handler = () => {
      const s = stateRef.current;
      if (!s) return;
      const now = nowIso();
      // Bank active timer up to this exact moment, then record close time.
      let final = s.activeTimer ? closeTimerAt(s, now) : s;
      final = { ...final, lastClosedAt: now };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(final)); } catch {}
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  // ── Action creators ───────────────────────────────────────────────────────────

  const beginPlan = useCallback((startDate) => {
    setState(s => ({ ...s, startDate, planStartedAt: s.planStartedAt || nowIso() }));
  }, []);

  const visitDay = useCallback((day) => {
    const at = nowIso();
    setState(s => ({
      ...touchDay(s, day, { lastVisitedAt: at, prevVisitedAt: s.days[day]?.lastVisitedAt }),
      lastVisited: { day, taskId: null, at },
    }));
  }, []);

  const visitTask = useCallback((taskId, day) => {
    const at = nowIso();
    setState(s => ({
      ...s,
      tasks: { ...s.tasks, [taskId]: { ...s.tasks[taskId], lastVisitedAt: at, prevVisitedAt: s.tasks[taskId]?.lastVisitedAt } },
      lastVisited: { day, taskId, at },
    }));
  }, []);

  const recordMark = useCallback((taskIds, done, day) => {
    const at = nowIso();
    setState(s => {
      let next = s.activeTimer && taskIds.includes(s.activeTimer.taskId) ? closeTimer(s, true) : s;
      const tasks = { ...next.tasks };
      taskIds.forEach(id => {
        const { completedAt, ...rest } = tasks[id] || {};
        tasks[id] = done ? { ...rest, completedAt: completedAt || at, lastMarkedAt: at } : { ...rest, lastMarkedAt: at };
      });
      next = { ...next, tasks };
      return done ? markDayStarted(next, day) : next;
    });
  }, []);

  const startTimer = useCallback((taskId, day) => {
    setState(s => markDayStarted({ ...closeTimer(s, true), activeTimer: { taskId, day, startedAt: nowIso() } }, day));
  }, []);

  const stopTimer = useCallback((save = true) => setState(s => closeTimer(s, save)), []);

  const value = useMemo(() => ({
    tracking: state,
    beginPlan, visitDay, visitTask, recordMark, startTimer, stopTimer,
  }), [state, beginPlan, visitDay, visitTask, recordMark, startTimer, stopTimer]);

  return <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>;
}

export const useTracking = () => useContext(TrackingContext);

export const getTrackedMs = (tracking, taskId, now = Date.now()) => {
  const base = tracking.tasks[taskId]?.trackedMs || 0;
  const t = tracking.activeTimer;
  return t?.taskId === taskId ? base + Math.max(0, now - new Date(t.startedAt).getTime()) : base;
};

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
