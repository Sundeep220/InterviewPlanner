import { useState } from 'react';
import { Play, Square, X, Rocket, AlertTriangle, Zap, CheckCircle2, CalendarDays, Timer } from 'lucide-react';
import { useTracking, useNow, getTrackedMs } from '../hooks/useTracking';
import { getTaskById, TOTAL_DAYS, studyPlan as PLAN } from '../data/studyPlan';
import { formatClock, formatDateKey, formatDuration, pluralDays, toDateKey, nextDateOfType } from '../utils/time';
import { computeDayDates } from '../utils/schedule';

export function LetsBeginButton({ onClick, large = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:from-blue-500 hover:to-violet-500 transition-all ${
        large ? 'px-5 py-2.5 text-sm' : 'px-3 py-1.5 text-xs'
      }`}
    >
      <Rocket size={large ? 16 : 14} /> Let's Begin
    </button>
  );
}

export function BeginPlanModal({ onClose }) {
  const { tracking, beginPlan } = useTracking();
  const [date, setDate] = useState(tracking.startDate || toDateKey());

  // Compute where Day 1 actually lands given the chosen start date
  const dayDates   = date ? computeDayDates(date, PLAN) : null;
  const day1Date   = dayDates ? dayDates[PLAN[0].day] : null;
  const lastDate   = dayDates ? dayDates[PLAN[PLAN.length - 1].day] : null;
  const day1Offset = day1Date ? Math.round(
    (new Date(day1Date + 'T00:00') - new Date(date + 'T00:00')) / 86400000
  ) : 0;

  // Day-of-week label for a date key
  const dow = (key) => new Date(key + 'T00:00').toLocaleDateString(undefined, { weekday: 'long' });

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="card p-5 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-bold text-white mb-1">
          {tracking.startDate ? 'Change plan start date' : "Let's begin the plan"}
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Weekday study days (4–5 h) are placed on Mon–Fri and weekend study days (8–12 h) are placed on
          Sat–Sun automatically — no matter which day you start on. Pick any date and see the live preview below.
        </p>

        <label className="text-xs text-gray-500 block mb-1">Start date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
        />

        {day1Date && (
          <div className="mt-3 rounded-lg border border-[#30363d] bg-[#0d1117] divide-y divide-[#21262d] text-xs">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-gray-500">Day 1 starts</span>
              <span className="text-white font-medium">
                {formatDateKey(day1Date, { weekday: 'short', day: 'numeric', month: 'short' })}
                {day1Offset > 0 && (
                  <span className="ml-1.5 text-amber-400">(first {dow(date)} is wrong type — shifts {day1Offset}d)</span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-gray-500">Plan finishes by</span>
              <span className="text-white font-medium">
                {formatDateKey(lastDate, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        )}

        {day1Offset > 0 && (
          <p className="text-xs text-sky-400 mt-2">
            ℹ Day 1 has weekday content, so it's auto-placed on the next weekday ({formatDateKey(day1Date, { weekday: 'long', day: 'numeric', month: 'short' })}).
          </p>
        )}

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-3 py-1.5 text-xs rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700">
            Cancel
          </button>
          <button
            onClick={() => { if (date) { beginPlan(date); onClose(); } }}
            className="px-4 py-1.5 text-xs rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500"
          >
            {tracking.startDate ? 'Save' : 'Start plan'}
          </button>
        </div>
      </div>
    </div>
  );
}

const behindText = (s) => [s.daysBehind > 0 && pluralDays(s.daysBehind), s.behindMinutes > 0 && formatDuration(s.behindMinutes)].filter(Boolean).join(' · ');
const aheadText = (s) => [s.daysAhead > 0 && pluralDays(s.daysAhead), s.aheadMinutes > 0 && formatDuration(s.aheadMinutes)].filter(Boolean).join(' · ');

export function SchedulePill({ schedule }) {
  if (!schedule.started) return null;
  let cls = 'bg-emerald-600/15 text-emerald-300 border-emerald-600/30', text = 'On track';
  if (schedule.finished) text = 'Plan complete';
  else if (schedule.notStartedYet) { cls = 'bg-gray-800 text-gray-300 border-gray-700'; text = `Starts in ${pluralDays(schedule.startsIn)}`; }
  else if (behindText(schedule)) { cls = 'bg-red-600/15 text-red-300 border-red-600/30'; text = `Behind ${behindText(schedule)}`; }
  else if (aheadText(schedule)) { cls = 'bg-emerald-600/15 text-emerald-300 border-emerald-600/30'; text = `Ahead ${aheadText(schedule)}`; }
  return <span className={`hidden md:inline text-xs px-3 py-1 rounded-full border font-medium whitespace-nowrap ${cls}`}>{text}</span>;
}

export function ScheduleCard({ schedule, onChangeStart }) {
  const behind = behindText(schedule);
  const ahead = aheadText(schedule);
  return (
    <div className={`card p-4 ${behind ? 'border-red-900/50 bg-red-950/10' : ahead ? 'border-emerald-900/50 bg-emerald-950/10' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {behind ? <AlertTriangle size={20} className="text-red-400" /> : ahead ? <Zap size={20} className="text-emerald-400" /> : <CheckCircle2 size={20} className="text-blue-400" />}
          <div>
            <p className={`text-sm font-semibold ${behind ? 'text-red-300' : ahead ? 'text-emerald-300' : 'text-white'}`}>
              {schedule.finished ? 'Plan complete 🎯'
                : schedule.notStartedYet ? `Plan starts ${formatDateKey(schedule.day1Date)} (in ${pluralDays(schedule.startsIn)})`
                : behind ? `You are behind schedule by ${behind}`
                : ahead ? `You are ahead of schedule by ${ahead} — faster than planned!`
                : 'You are on track'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {!schedule.notStartedYet && !schedule.finished && <>Today should be Day {Math.min(schedule.expectedDay, TOTAL_DAYS)} · you're on Day {schedule.currentDay} · </>}
              Work due before today {formatDuration(schedule.dueMinutes)} · completed {formatDuration(schedule.doneMinutes)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div><span className="text-gray-500 block">Started</span><span className="text-gray-200">{formatDateKey(schedule.startDate)}</span></div>
          <div><span className="text-gray-500 block">Planned finish</span><span className="text-gray-200">{formatDateKey(schedule.originalFinish)}</span></div>
          {schedule.projectedFinish && (
            <div>
              <span className="text-gray-500 block">Projected finish</span>
              <span className={schedule.finishSlip > 0 ? 'text-red-300' : schedule.finishSlip < 0 ? 'text-emerald-300' : 'text-gray-200'}>
                {formatDateKey(schedule.projectedFinish)}
                {schedule.finishSlip !== 0 && ` (${schedule.finishSlip > 0 ? '+' : ''}${schedule.finishSlip}d)`}
              </span>
            </div>
          )}
          <button onClick={onChangeStart} className="text-gray-500 hover:text-gray-300 underline underline-offset-2">Change start</button>
        </div>
      </div>
    </div>
  );
}

const STATUS_STYLE = {
  overdue: 'bg-red-600/20 text-red-300 border-red-600/40',
  today: 'bg-blue-600/20 text-blue-300 border-blue-600/40',
  upcoming: 'bg-gray-800 text-gray-400 border-gray-700',
  done: 'bg-emerald-600/20 text-emerald-300 border-emerald-600/40',
  early: 'bg-emerald-500/25 text-emerald-200 border-emerald-400/50',
  late: 'bg-amber-600/20 text-amber-300 border-amber-600/40',
};

export function DayStatusBadge({ info, compact = false }) {
  if (!info) return null;
  const label = (compact ? {
    overdue: `Missed +${info.overdueBy}d`,
    today: 'Today',
    upcoming: 'Upcoming',
    done: 'On time',
    early: `⚡ ${info.earlyBy}d early`,
    late: `${info.lateBy}d late`,
  } : {
    overdue: `Missed · overdue ${pluralDays(info.overdueBy)}`,
    today: 'Today',
    upcoming: 'Upcoming',
    done: 'Done on time',
    early: `⚡ Done ${pluralDays(info.earlyBy)} early`,
    late: `Done ${pluralDays(info.lateBy)} late`,
  })[info.status];
  return <span className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${STATUS_STYLE[info.status]}`}>{label}</span>;
}

export const dayCardTone = (info) =>
  !info ? '' : info.status === 'overdue' ? 'border-red-700/70 bg-red-950/20' : info.status === 'early' ? 'border-emerald-500/70 bg-emerald-950/30 ring-1 ring-emerald-500/30' : info.status === 'today' ? 'border-blue-700/70' : '';

export function DayDateLine({ info }) {
  if (!info) return null;
  const moved = !info.completedDate && info.projectedDate !== info.scheduledDate;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
      <CalendarDays size={11} />
      <span className={moved ? 'line-through text-gray-600' : ''}>{formatDateKey(info.scheduledDate)}</span>
      {moved && <span className={info.shiftedBy > 0 ? 'text-red-300' : 'text-emerald-300'}>→ {formatDateKey(info.projectedDate)}</span>}
      {info.completedDate && info.completedDate !== info.scheduledDate && <span className="text-gray-500">(done {formatDateKey(info.completedDate)})</span>}
    </span>
  );
}

export function ActiveTimerChip({ onOpenDay }) {
  const { tracking, stopTimer } = useTracking();
  const now = useNow(1000);
  const timer = tracking.activeTimer;
  if (!timer) return null;
  const task = getTaskById(timer.taskId);
  const elapsed = now - new Date(timer.startedAt).getTime();

  return (
    <div className="flex items-center gap-2 bg-blue-950/60 border border-blue-700/50 rounded-full pl-3 pr-1 py-1">
      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      <button onClick={() => onOpenDay(timer.day)} className="text-xs text-blue-200 max-w-[140px] truncate hidden lg:inline hover:underline" title={task?.title}>
        D{timer.day} · {task?.title || 'Task'}
      </button>
      <span className="text-xs font-mono text-white">{formatClock(elapsed)}</span>
      <button onClick={() => stopTimer(true)} title="Stop & save time" className="p-1 rounded-full hover:bg-blue-800 text-blue-200"><Square size={12} /></button>
      <button onClick={() => stopTimer(false)} title="Discard (I was just looking)" className="p-1 rounded-full hover:bg-gray-800 text-gray-400"><X size={12} /></button>
    </div>
  );
}

export function TaskTimer({ task }) {
  const { tracking, startTimer, stopTimer } = useTracking();
  const now = useNow(1000);
  const running = tracking.activeTimer?.taskId === task.id;
  const trackedMin = getTrackedMs(tracking, task.id, now) / 60000;
  const left = task.estimatedMinutes - trackedMin;

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {running ? (
        <>
          <span className="font-mono text-white bg-blue-950/60 border border-blue-700/50 rounded px-2 py-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {formatClock(now - new Date(tracking.activeTimer.startedAt).getTime())}
          </span>
          <button onClick={() => stopTimer(true)} className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-600 text-white hover:bg-blue-500"><Square size={10} /> Stop & save</button>
          <button onClick={() => stopTimer(false)} className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-800 text-gray-300 hover:bg-gray-700"><X size={10} /> Discard</button>
        </>
      ) : (
        <button onClick={() => startTimer(task.id, task.day)} className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700">
          <Play size={10} /> {trackedMin > 0 ? 'Resume timer' : 'Start timer'}
        </button>
      )}
      <span className="flex items-center gap-1 text-gray-500">
        <Timer size={11} /> {formatDuration(trackedMin)} spent / {formatDuration(task.estimatedMinutes)} est
        {' · '}
        <span className={left < 0 ? 'text-red-400' : 'text-gray-400'}>{left < 0 ? `${formatDuration(-left)} over` : `${formatDuration(left)} left`}</span>
      </span>
    </div>
  );
}
