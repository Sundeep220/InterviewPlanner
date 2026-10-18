import { addDays, diffDays, toDateKey, nextDateOfType } from './time.js';

/**
 * Derives the whole schedule purely from stored timestamps + "now", so the status is correct
 * whenever the app is opened — nothing has to keep running in the background.
 *
 * Day assignment is TYPE-AWARE:
 *   - Weekday plan days  (Mon–Fri content, 4–5 h) always land on calendar Mon–Fri.
 *   - Weekend plan days  (Sat–Sun content, 8–12 h) always land on calendar Sat–Sun.
 *
 * This means the plan automatically re-aligns when you start on any day of the week —
 * if you start on Wednesday, Day 6 (the first "weekend" day) becomes the upcoming Saturday,
 * not the coming Tuesday.
 *
 * - scheduledDate: the aligned calendar date for this plan day. Never moves.
 * - projectedDate: adaptive. First incomplete day pins to today (or next matching type from today);
 *   every later incomplete day follows in the same type-aware order.
 */

/**
 * Builds a { dayNumber → YYYY-MM-DD } map that respects weekday/weekend alignment.
 * Starting from startDate, each plan day is assigned to the earliest available calendar
 * date of the right type (skipping mis-typed days).
 */
export function computeDayDates(startDate, studyPlan) {
  const map = {};
  let cursor = startDate;
  for (const d of studyPlan) {
    cursor = nextDateOfType(cursor, d.type);
    map[d.day] = cursor;
    cursor = addDays(cursor, 1);
  }
  return map;
}

export function computeSchedule({ studyPlan, completed, tracking, now = new Date() }) {
  const { startDate } = tracking;
  if (!startDate) return { started: false };

  const today = toDateKey(now);

  // Build type-aware date mapping: each plan day → its real calendar date
  const dayDates = computeDayDates(startDate, studyPlan);
  const day1Date = dayDates[studyPlan[0].day];
  const lastDate  = dayDates[studyPlan[studyPlan.length - 1].day];

  // How many plan days have their scheduled date on or before today?
  const scheduledSoFar = studyPlan.filter(d => dayDates[d.day] <= today).length;
  const notStartedYet  = day1Date > today;
  const startsIn       = Math.max(0, diffDays(today, day1Date));
  // expectedDay = the plan day you should be on right now
  const expectedDay    = notStartedYet ? 0 : Math.min(scheduledSoFar, studyPlan.length + 1);

  const firstIncomplete = studyPlan.find(d => !d.tasks.every(t => completed.has(t.id)));
  const currentDay = firstIncomplete ? firstIncomplete.day : studyPlan.length + 1;

  // Projected dates start from today (or day1Date if plan hasn't begun yet)
  let nextProjected = notStartedYet ? day1Date : today;
  let dueMinutes = 0, todayMinutes = 0, doneMinutes = 0;

  const days = {};
  for (const d of studyPlan) {
    const scheduledDate = dayDates[d.day];
    const doneTasks = d.tasks.filter(t => completed.has(t.id));
    const doneMins  = doneTasks.reduce((s, t) => s + t.estimatedMinutes, 0);
    const isComplete = doneTasks.length === d.tasks.length;
    const stamps = doneTasks.map(t => tracking.tasks[t.id]?.completedAt).filter(Boolean).sort();
    const completedDate = isComplete && stamps.length === d.tasks.length
      ? toDateKey(new Date(stamps[stamps.length - 1])) : null;

    let projectedDate = scheduledDate;
    if (!isComplete) {
      // Advance to next calendar date of the right type (skip mis-typed days)
      projectedDate  = nextDateOfType(nextProjected, d.type);
      nextProjected  = addDays(projectedDate, 1);
    }

    const scheduleDiff = diffDays(scheduledDate, today);
    let status;
    if (isComplete) {
      const delta = completedDate ? diffDays(scheduledDate, completedDate) : 0;
      status = delta < 0 ? 'early' : delta > 0 ? 'late' : 'done';
      days[d.day] = { scheduledDate, projectedDate: completedDate || scheduledDate, completedDate, status, earlyBy: Math.max(0, -delta), lateBy: Math.max(0, delta), remainingMinutes: 0, doneMinutes: doneMins };
    } else {
      status = scheduleDiff > 0 ? 'overdue' : d.day === currentDay && !notStartedYet ? 'today' : 'upcoming';
      days[d.day] = { scheduledDate, projectedDate, completedDate: null, status, overdueBy: Math.max(0, scheduleDiff), shiftedBy: Math.max(0, diffDays(scheduledDate, projectedDate)), remainingMinutes: d.plannedMinutes - doneMins, doneMinutes: doneMins };
    }

    if (scheduleDiff > 0) dueMinutes += d.plannedMinutes;
    else if (scheduleDiff === 0) todayMinutes += d.plannedMinutes;
    doneMinutes += doneMins;
  }

  const originalFinish  = lastDate;
  const projectedFinish = firstIncomplete ? addDays(nextProjected, -1) : null;

  return {
    started: true,
    startDate,
    day1Date,
    today,
    notStartedYet,
    startsIn,
    expectedDay,
    currentDay,
    finished: !firstIncomplete,
    daysBehind:    Math.max(0, expectedDay - currentDay),
    daysAhead:     Math.max(0, currentDay - 1 - expectedDay),
    behindMinutes: Math.max(0, dueMinutes - doneMinutes),
    aheadMinutes:  Math.max(0, doneMinutes - dueMinutes - todayMinutes),
    dueMinutes, todayMinutes, doneMinutes,
    originalFinish,
    projectedFinish,
    finishSlip: projectedFinish ? diffDays(originalFinish, projectedFinish) : 0,
    days,
  };
}
