import { CATEGORY_COLORS, WEEKS, TOTAL_DAYS, getTaskById } from '../data/studyPlan';
import DayTypeBadge from './DayTypeBadge';
import { LetsBeginButton, ScheduleCard, DayStatusBadge, DayDateLine } from './ScheduleWidgets';
import { useTracking, useNow } from '../hooks/useTracking';
import { timeAgo, formatDateKey, formatDuration, pluralDays } from '../utils/time';
import { Flame, CheckCircle2, Clock, TrendingUp, ChevronRight, Star, AlertTriangle, Zap, Target, CalendarCheck2, ListTodo, BarChart3 } from 'lucide-react';

function ProgressRing({ pct, size = 80, stroke = 8, color = '#3b82f6', label, sublabel }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1f2937" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text
          x={size / 2} y={size / 2 + 5}
          textAnchor="middle" fill="white"
          style={{ transform: 'rotate(90deg)', transformOrigin: `${size/2}px ${size/2}px`, fontSize: '14px', fontWeight: 700 }}
        >
          {pct}%
        </text>
      </svg>
      <span className="text-xs font-semibold" style={{ color }}>{label}</span>
      {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color = 'text-blue-400', bg = 'bg-blue-500/10' }) {
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
        <Icon size={20} className={color} />
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}

function TodayTask({ task, isCompleted, onClick }) {
  const colors = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.DSA;
  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:border-gray-600 ${
        isCompleted ? 'bg-gray-900/30 border-gray-800/50 opacity-60' : 'bg-gray-900 border-gray-800 hover:bg-gray-800/50'
      }`}
    >
      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 ${
        isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-600'
      }`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-xs px-1.5 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}>
            {task.category}
          </span>
          <span className="text-xs text-gray-500">{task.estimatedTime}</span>
          {task.must && <span className="text-xs text-red-400 font-medium">MUST</span>}
        </div>
        <p className={`text-sm font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>
          {task.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{task.description}</p>
      </div>
    </div>
  );
}

function MiniDayStrip({ studyPlan, completed, onDayClick, schedule }) {
  const visibleDays = studyPlan.slice(0, 14);
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">First 2 Weeks Quick View</h3>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {visibleDays.map(day => {
          const done = day.tasks.filter(t => completed.has(t.id)).length;
          const total = day.tasks.length;
          const pct = done / total;
          const status = schedule.days?.[day.day]?.status;
          const cats = [...new Set(day.tasks.map(t => t.category))];
          return (
            <button
              key={day.day}
              onClick={() => onDayClick(day.day)}
              className="flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-gray-800 transition-all group"
            >
              <span className={`text-xs ${status === 'overdue' ? 'text-red-400' : status === 'early' ? 'text-emerald-300' : 'text-gray-500'}`}>D{day.day}</span>
              <div className="relative w-8 h-8">
                <svg width="32" height="32" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="16" cy="16" r="12" fill="none" stroke="#1f2937" strokeWidth="4" />
                  <circle
                    cx="16" cy="16" r="12"
                    fill="none"
                    stroke={status === 'overdue' ? '#ef4444' : pct === 1 ? '#10b981' : pct > 0 ? '#3b82f6' : '#374151'}
                    strokeWidth="4"
                    strokeDasharray={2 * Math.PI * 12}
                    strokeDashoffset={2 * Math.PI * 12 * (1 - pct)}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {done === total && total > 0 ? '✓' : done}
                </span>
              </div>
              <div className="flex gap-0.5">
                {cats.map(c => (
                  <div key={c} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[c]?.hex }} />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Schedule Status Panel ────────────────────────────────────────────────────

function WeekRow({ week, studyPlan, completed, schedule, onDayClick }) {
  const wDays = studyPlan.filter(d => d.week === week.id);
  if (!wDays.length) return null;

  const total = wDays.length;
  const done = wDays.filter(d => d.tasks.every(t => completed.has(t.id))).length;
  const pct = Math.round((done / total) * 100);

  // Count statuses for this week
  const counts = wDays.reduce((acc, d) => {
    const s = schedule.days[d.day]?.status;
    if (s) acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const overdueCount = counts.overdue || 0;
  const earlyCount = counts.early || 0;
  const lateCount = counts.late || 0;
  const isCurrentWeek = !!(counts.today);
  const isFuture = done === 0 && !isCurrentWeek && !overdueCount;

  // Date range from schedule
  const firstInfo = schedule.days[wDays[0].day];
  const lastInfo = schedule.days[wDays[wDays.length - 1].day];
  const dateRange = firstInfo && lastInfo
    ? `${formatDateKey(firstInfo.scheduledDate, { day: 'numeric', month: 'short' })} – ${formatDateKey(lastInfo.scheduledDate, { day: 'numeric', month: 'short' })}`
    : week.title;

  // Row tint
  const rowTint = overdueCount > 0 ? 'border-l-red-500 bg-red-950/10'
    : isCurrentWeek ? 'border-l-blue-500 bg-blue-950/10'
    : done === total ? 'border-l-emerald-500 bg-emerald-950/10'
    : isFuture ? 'border-l-gray-700'
    : 'border-l-amber-500/60 bg-amber-950/5';

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2 px-3 py-2.5 border-l-4 rounded-r-lg ${rowTint}`}>
      {/* Week label */}
      <div className="w-16 flex-shrink-0">
        <span className={`text-xs font-bold ${isCurrentWeek ? 'text-blue-300' : 'text-gray-400'}`}>W{week.id}</span>
        <p className="text-[10px] text-gray-600 whitespace-nowrap">{dateRange}</p>
      </div>

      {/* Progress bar */}
      <div className="flex-1 min-w-0">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              overdueCount > 0 ? 'bg-red-500' : done === total ? 'bg-emerald-500' : isCurrentWeek ? 'bg-blue-500' : 'bg-gray-600'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-500 mt-0.5 truncate">{week.theme}</p>
      </div>

      {/* Right: done count + status chips */}
      <div className="flex items-center gap-2 sm:flex-shrink-0 flex-wrap">
        <span className="text-xs text-gray-300 font-mono">{done}/{total}</span>
        {isCurrentWeek && <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-blue-600/20 text-blue-300 border border-blue-600/30">active</span>}
        {overdueCount > 0 && (
          <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-red-600/20 text-red-300 border border-red-600/30">
            {overdueCount} missed
          </span>
        )}
        {lateCount > 0 && (
          <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-amber-600/20 text-amber-300 border border-amber-600/30">
            {lateCount} late
          </span>
        )}
        {earlyCount > 0 && (
          <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-600/20 text-emerald-300 border border-emerald-600/30">
            ⚡ {earlyCount} early
          </span>
        )}
        {isFuture && <span className="text-[11px] text-gray-600">upcoming</span>}
        {done === total && !isCurrentWeek && <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-600/20 text-emerald-300 border border-emerald-500/30">✓ done</span>}
      </div>
    </div>
  );
}

function ScheduleStatusPanel({ schedule, studyPlan, completed, onDayClick }) {
  if (!schedule.started) return null;

  const daysCompleted = studyPlan.filter(d => d.tasks.every(t => completed.has(t.id))).length;
  const expectedCompleted = Math.min(Math.max(schedule.expectedDay - 1, 0), TOTAL_DAYS);
  const completedPct = Math.round((daysCompleted / TOTAL_DAYS) * 100);
  const expectedPct = Math.round((expectedCompleted / TOTAL_DAYS) * 100);

  const isBehind = schedule.daysBehind > 0 || schedule.behindMinutes > 0;
  const isAhead = schedule.daysAhead > 0 || schedule.aheadMinutes > 0;

  // Build behind/ahead label
  const behindParts = [schedule.daysBehind > 0 && pluralDays(schedule.daysBehind), schedule.behindMinutes > 0 && formatDuration(schedule.behindMinutes)].filter(Boolean);
  const aheadParts = [schedule.daysAhead > 0 && pluralDays(schedule.daysAhead), schedule.aheadMinutes > 0 && formatDuration(schedule.aheadMinutes)].filter(Boolean);

  const overdueDays = studyPlan.filter(d => schedule.days[d.day]?.status === 'overdue');

  // Hours breakdown
  const plannedSoFar = schedule.dueMinutes + schedule.todayMinutes;
  const doneMins = schedule.doneMinutes;
  const hoursDiff = doneMins - schedule.dueMinutes;

  // Panel header colours
  const panelColor = schedule.notStartedYet ? { bg: 'bg-gray-900 border-gray-800', icon: <Target size={20} className="text-gray-400" />, pill: 'bg-gray-800 text-gray-300 border-gray-700' }
    : schedule.finished ? { bg: 'bg-emerald-950/30 border-emerald-700/40', icon: <CheckCircle2 size={20} className="text-emerald-400" />, pill: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30' }
    : isBehind ? { bg: 'bg-red-950/25 border-red-800/40', icon: <AlertTriangle size={20} className="text-red-400" />, pill: 'bg-red-600/20 text-red-300 border-red-600/30' }
    : isAhead ? { bg: 'bg-emerald-950/25 border-emerald-800/40', icon: <Zap size={20} className="text-emerald-400" />, pill: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30' }
    : { bg: 'bg-blue-950/25 border-blue-800/40', icon: <CalendarCheck2 size={20} className="text-blue-400" />, pill: 'bg-blue-600/20 text-blue-300 border-blue-600/30' };

  return (
    <div className={`card border ${panelColor.bg} overflow-hidden`}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 pt-5 pb-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{panelColor.icon}</div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white">
                {schedule.finished ? 'Plan complete!'
                  : schedule.notStartedYet ? `Plan starts in ${pluralDays(schedule.startsIn)}`
                  : isBehind ? `Behind schedule`
                  : isAhead ? `Ahead of schedule`
                  : 'On schedule'}
              </h3>
              {!schedule.finished && !schedule.notStartedYet && (isBehind || isAhead) && (
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${panelColor.pill}`}>
                  {isBehind ? `${behindParts.join(' · ')} behind` : `${aheadParts.join(' · ')} ahead`}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {!schedule.notStartedYet && !schedule.finished
                ? `Expected Day ${Math.min(schedule.expectedDay, TOTAL_DAYS)} · currently on Day ${schedule.currentDay} of ${TOTAL_DAYS}`
                : schedule.finished
                ? `All ${TOTAL_DAYS} days complete · ${formatDuration(doneMins)} of study tracked`
                : `Starts ${formatDateKey(schedule.startDate)}`}
            </p>
          </div>
        </div>

        {/* Finish dates */}
        <div className="flex items-center gap-5 text-xs flex-wrap">
          <div className="text-center">
            <p className="text-gray-500 mb-0.5">Started</p>
            <p className="text-gray-200 font-medium">{formatDateKey(schedule.startDate)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 mb-0.5">Planned finish</p>
            <p className="text-gray-200 font-medium">{formatDateKey(schedule.originalFinish)}</p>
          </div>
          {schedule.projectedFinish && (
            <div className="text-center">
              <p className="text-gray-500 mb-0.5">Projected finish</p>
              <p className={`font-semibold ${schedule.finishSlip > 0 ? 'text-red-300' : schedule.finishSlip < 0 ? 'text-emerald-300' : 'text-gray-200'}`}>
                {formatDateKey(schedule.projectedFinish)}
                {schedule.finishSlip !== 0 && (
                  <span className="ml-1 text-[11px]">({schedule.finishSlip > 0 ? '+' : ''}{schedule.finishSlip}d)</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-5 space-y-5">
        {/* ── Progress timeline ── */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-400 flex items-center gap-1"><BarChart3 size={12} /> Day progress</span>
            <span className="text-xs text-gray-500">{daysCompleted} / {TOTAL_DAYS} days complete · {completedPct}%</span>
          </div>
          <div className="relative h-4 bg-gray-800 rounded-full overflow-visible">
            {/* Actual completed */}
            <div
              className={`h-full rounded-full transition-all duration-700 ${isBehind ? 'bg-blue-600' : isAhead ? 'bg-emerald-500' : 'bg-blue-500'}`}
              style={{ width: `${completedPct}%` }}
            />
            {/* Expected marker */}
            {!schedule.notStartedYet && !schedule.finished && expectedPct !== completedPct && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/60 rounded-full"
                style={{ left: `clamp(0%, ${expectedPct}%, 100%)` }}
                title={`Expected: Day ${schedule.expectedDay}`}
              />
            )}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-gray-600">Day 1</span>
            {!schedule.notStartedYet && !schedule.finished && expectedPct !== completedPct && (
              <span
                className="text-[10px] text-gray-500"
                style={{ position: 'relative', left: `calc(${expectedPct}% - 40px)` }}
              >
                ↑ expected
              </span>
            )}
            <span className="text-[10px] text-gray-600">Day {TOTAL_DAYS}</span>
          </div>
        </div>

        {/* ── Hours breakdown ── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-900 rounded-lg px-3 py-2.5 text-center">
            <p className="text-[11px] text-gray-500 mb-1">Planned up to today</p>
            <p className="text-base font-bold text-gray-200">{formatDuration(plannedSoFar)}</p>
          </div>
          <div className="bg-gray-900 rounded-lg px-3 py-2.5 text-center">
            <p className="text-[11px] text-gray-500 mb-1">Work completed</p>
            <p className="text-base font-bold text-white">{formatDuration(doneMins)}</p>
          </div>
          <div className={`rounded-lg px-3 py-2.5 text-center ${hoursDiff >= 0 ? 'bg-emerald-950/40 border border-emerald-800/40' : 'bg-red-950/40 border border-red-800/40'}`}>
            <p className="text-[11px] text-gray-500 mb-1">{hoursDiff >= 0 ? 'Ahead by' : 'Behind by'}</p>
            <p className={`text-base font-bold ${hoursDiff >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
              {formatDuration(Math.abs(hoursDiff))}
            </p>
          </div>
        </div>

        {/* ── Per-week breakdown ── */}
        <div>
          <p className="text-xs text-gray-500 flex items-center gap-1 mb-2"><ListTodo size={12} /> Week-by-week progress</p>
          <div className="space-y-1.5">
            {WEEKS.map(week => (
              <WeekRow
                key={week.id}
                week={week}
                studyPlan={studyPlan}
                completed={completed}
                schedule={schedule}
                onDayClick={onDayClick}
              />
            ))}
          </div>
        </div>

        {/* ── Overdue days ── */}
        {overdueDays.length > 0 && (
          <div>
            <p className="text-xs text-red-400 flex items-center gap-1 mb-2"><AlertTriangle size={12} /> Missed days — finish these to get back on track</p>
            <div className="space-y-1.5">
              {overdueDays.map(day => {
                const info = schedule.days[day.day];
                const doneCount = day.tasks.filter(t => completed.has(t.id)).length;
                return (
                  <button
                    key={day.day}
                    onClick={() => onDayClick(day.day)}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-red-800/40 bg-red-950/10 hover:bg-red-950/25 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xs font-bold text-red-300 flex-shrink-0">D{day.day}</span>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-200 truncate">{day.theme}</p>
                        <p className="text-[11px] text-gray-500">{formatDateKey(info.scheduledDate)} · {doneCount}/{day.tasks.length} tasks done</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-red-600/20 text-red-300 border border-red-600/30 whitespace-nowrap">
                        {pluralDays(info.overdueBy)} overdue
                      </span>
                      <ChevronRight size={12} className="text-gray-600" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard({ stats, completed, studyPlan, onDayClick, schedule, onBegin }) {
  const { tracking } = useTracking();
  const now = useNow(60000);
  const last      = tracking.lastVisited;
  const isResume  = tracking.sessionIsResume;
  const gapMs     = tracking.sessionGapMs;
  const overallPct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const currentDay = studyPlan.find(d => !d.tasks.every(t => completed.has(t.id))) || studyPlan[studyPlan.length - 1];
  const todayTasks = currentDay?.tasks || [];
  const todayDone = todayTasks.filter(t => completed.has(t.id)).length;

  const daysCompleted = studyPlan.filter(d => d.tasks.every(t => completed.has(t.id))).length;

  const sprintWeek = currentDay.week;

  // ── Session banner helpers ────────────────────────────────────────────────

  // Time left for current day: sum of estimated minutes on incomplete tasks
  const completedMin = todayTasks
    .filter(t => completed.has(t.id))
    .reduce((s, t) => s + t.estimatedMinutes, 0);
  const remainingMin = Math.max(0, currentDay.plannedMinutes - completedMin);
  const remainingPct = currentDay.plannedMinutes > 0
    ? Math.round((completedMin / currentDay.plannedMinutes) * 100) : 0;

  const fmtMin = (m) => m < 60 ? `${m}m` : `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}`;

  const lastTaskTitle = last?.taskId && getTaskById(last.taskId) ? getTaskById(last.taskId).title : null;
  const gapText = gapMs !== null
    ? gapMs < 60_000        ? 'just now'
    : gapMs < 3_600_000     ? `${Math.floor(gapMs / 60_000)}m ago`
    : gapMs < 86_400_000    ? `${Math.floor(gapMs / 3_600_000)}h ${Math.floor((gapMs % 3_600_000) / 60_000)}m ago`
    :                         `${Math.floor(gapMs / 86_400_000)}d ago`
    : null;

  return (
    <div className="space-y-6">
      {schedule.started ? (
        <div className="space-y-2">
          <ScheduleCard schedule={schedule} onChangeStart={onBegin} />

          {/* ── Session banner ───────────────────────────────────────────── */}
          {last && isResume && (
            /* Resume: same calendar day — show remaining work and pick-up button */
            <div className="rounded-lg border border-emerald-800/35 bg-emerald-950/25 px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-emerald-400 text-xs font-bold whitespace-nowrap">↩ Resume</span>
                  <span className="text-xs text-gray-400">
                    Day {currentDay.day} · back {gapText}
                  </span>
                </div>
                <button
                  onClick={() => onDayClick(currentDay.day)}
                  className="text-xs px-3 py-1 rounded-md bg-emerald-700/40 text-emerald-300 hover:bg-emerald-700/60 whitespace-nowrap flex-shrink-0"
                >
                  Continue →
                </button>
              </div>

              {/* Remaining-time row */}
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  {remainingMin === 0 ? (
                    <span className="text-xs text-emerald-400 font-medium">✓ All tasks done for today!</span>
                  ) : (
                    <>
                      <span className="text-xs text-gray-400">
                        <span className="text-white font-semibold">{fmtMin(remainingMin)}</span>
                        {' '}remaining today
                        <span className="text-gray-600 ml-1">({fmtMin(completedMin)} of {fmtMin(currentDay.plannedMinutes)} done)</span>
                      </span>
                      <span className="text-xs text-gray-500">{remainingPct}% complete</span>
                    </>
                  )}
                </div>
                {/* Progress bar */}
                <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${remainingMin === 0 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${remainingPct}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {last && !isResume && gapMs !== null && (
            /* New session: gap ≥ 24 h — show last session info + today's day nudge */
            <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-gray-800/30 border border-gray-700/30">
              <div className="min-w-0">
                <span className="text-xs text-gray-500">
                  Last session {gapText}
                  {last.day !== currentDay.day && ` · was on Day ${last.day}`}
                </span>
                {remainingMin > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    Day {currentDay.day} needs <span className="text-white">{fmtMin(remainingMin)}</span> of work
                  </p>
                )}
              </div>
              <button
                onClick={() => onDayClick(currentDay.day)}
                className="text-xs px-3 py-1 rounded-md bg-blue-700/30 text-blue-400 hover:bg-blue-700/50 whitespace-nowrap flex-shrink-0"
              >
                Day {currentDay.day} →
              </button>
            </div>
          )}

          {last && gapMs === null && (
            /* First ever open — plain last-visited line */
            <button onClick={() => onDayClick(last.day)} className="text-xs text-gray-500 hover:text-gray-300">
              Last visited: Day {last.day}{lastTaskTitle ? ` · ${lastTaskTitle}` : ''} · {timeAgo(last.at, now)} →
            </button>
          )}
        </div>
      ) : (
        <div className="card p-5 flex flex-wrap items-center justify-between gap-4 border-blue-900/40 bg-blue-950/20">
          <div>
            <h3 className="text-sm font-semibold text-white">Ready to start the plan?</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Click Let's Begin to give every day a date. After that the tracker marks missed days in red, shows how far
              behind or ahead you are, and turns on task timers.
            </p>
          </div>
          <LetsBeginButton onClick={onBegin} large />
        </div>
      )}

      {/* Hero Banner */}
      <div className="card p-6 bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950/30 border-blue-900/30">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Main progress ring */}
          <div className="flex items-center gap-6">
            <ProgressRing pct={overallPct} size={100} stroke={10} color="#3b82f6" label="Overall" sublabel={`${stats.done}/${stats.total} tasks`} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-0.5 rounded-full font-medium">
                  Week {sprintWeek} of {WEEKS.length}
                </span>
                <span className="text-xs bg-amber-600/20 text-amber-400 border border-amber-600/30 px-2 py-0.5 rounded-full font-medium">
                  Day {currentDay.day} of {TOTAL_DAYS}
                </span>
                <DayTypeBadge day={currentDay} showBudget />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {overallPct < 10 ? (schedule.started ? 'Off to a Start 🚀' : "Let's Begin! 🚀") :
                 overallPct < 30 ? "Building Momentum 💪" :
                 overallPct < 60 ? "Great Progress! 🔥" :
                 overallPct < 90 ? "Almost There! ⚡" : "Interview Ready! 🎯"}
              </h2>
              <p className="text-sm text-gray-400">{currentDay.theme}</p>
            </div>
          </div>

          {/* Category rings */}
          <div className="flex items-center gap-5 lg:ml-auto">
            {Object.entries(stats.byCategory).map(([cat, { total, done }]) => (
              <ProgressRing
                key={cat}
                pct={total > 0 ? Math.round((done / total) * 100) : 0}
                size={72}
                stroke={7}
                color={CATEGORY_COLORS[cat]?.hex}
                label={cat}
                sublabel={`${done}/${total}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Flame} value={stats.streak} label="Day Streak" color="text-orange-400" bg="bg-orange-500/10" />
        <StatCard icon={CheckCircle2} value={daysCompleted} label="Days Completed" color="text-green-400" bg="bg-green-500/10" />
        <StatCard icon={Clock} value={`${TOTAL_DAYS - daysCompleted}`} label="Days Remaining" color="text-blue-400" bg="bg-blue-500/10" />
        <StatCard icon={TrendingUp} value={`${overallPct}%`} label="Plan Completed" color="text-violet-400" bg="bg-violet-500/10" />
      </div>

      {/* Schedule Status Panel */}
      <ScheduleStatusPanel
        schedule={schedule}
        studyPlan={studyPlan}
        completed={completed}
        onDayClick={onDayClick}
      />

      {/* Today's Tasks + Mini strip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's tasks */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Day {currentDay.day} Tasks
                {todayDone === todayTasks.length && todayTasks.length > 0 && (
                  <span className="ml-2 text-green-400 text-xs">✓ Complete!</span>
                )}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{currentDay.theme}</p>
              {schedule.started && (
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <DayDateLine info={schedule.days[currentDay.day]} />
                  <DayStatusBadge info={schedule.days[currentDay.day]} />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <DayTypeBadge day={currentDay} showBudget />
              <span className="text-xs text-gray-400">{todayDone}/{todayTasks.length}</span>
              <button
                onClick={() => onDayClick(currentDay.day)}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-0.5"
              >
                Open <ChevronRight size={12} />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {todayTasks.map(task => (
              <TodayTask
                key={task.id}
                task={task}
                isCompleted={completed.has(task.id)}
                onClick={() => onDayClick(currentDay.day)}
              />
            ))}
          </div>
        </div>

        {/* Upcoming days + category breakdown */}
        <div className="space-y-3">
          {/* Category breakdown table */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Category Progress</h3>
            <div className="space-y-3">
              {Object.entries(stats.byCategory).map(([cat, { total, done }]) => {
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                const colors = CATEGORY_COLORS[cat];
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${colors.text}`}>{cat}</span>
                      <span className="text-xs text-gray-500">{done}/{total} · {pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: colors.hex }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming days preview */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Upcoming Days</h3>
            <div className="space-y-2">
              {studyPlan.slice(currentDay.day - 1, currentDay.day + 3).map(day => {
                const done = day.tasks.filter(t => completed.has(t.id)).length;
                const isCurrentDay = day.day === currentDay.day;
                return (
                  <button
                    key={day.day}
                    onClick={() => onDayClick(day.day)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all hover:border-gray-600 ${
                      isCurrentDay ? 'border-blue-700 bg-blue-950/30' : 'border-gray-800 hover:bg-gray-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isCurrentDay ? 'text-blue-400' : 'text-gray-500'}`}>
                        D{day.day}
                      </span>
                      <span className="text-xs text-gray-300 truncate max-w-[200px]">{day.theme}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {schedule.started && <DayDateLine info={schedule.days[day.day]} />}
                      <span className="text-xs text-gray-500">{done}/{day.tasks.length}</span>
                      {isCurrentDay && <span className="text-xs text-blue-400 font-medium">Today</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mini Day Strip */}
      <MiniDayStrip studyPlan={studyPlan} completed={completed} onDayClick={onDayClick} schedule={schedule} />

      {/* Quick Reference */}
      <div className="card p-4 border-gray-800/60">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">☕</span>
            <h3 className="text-sm font-semibold text-white">Java DSA Quick Reference</h3>
          </div>
          <a
            href="/cheatsheet.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
          >
            <span>Open Cheat Sheet</span>
            <ChevronRight size={12} />
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { badge: 'Part 1', label: 'Java Reference', items: 'Strings · Arrays · Collections · Bits · Pitfalls', color: 'bg-blue-500/10 border-blue-500/20 text-blue-300' },
            { badge: 'Part 2', label: 'Complexity Guide', items: 'n ≤ 10 → O(n!) · n ≤ 10⁵ → O(n log n) · n ≤ 10⁹ → O(log n)', color: 'bg-violet-500/10 border-violet-500/20 text-violet-300' },
            { badge: 'Part 3', label: 'Pattern Selection', items: '21 patterns · keywords → algorithm mapping', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' },
            { badge: 'Part 4', label: 'Math Foundations', items: 'GCD · Primes · Sieve · Fast Pow · nCr · Catalan', color: 'bg-amber-500/10 border-amber-500/20 text-amber-300' },
          ].map(({ badge, label, items, color }) => (
            <a
              key={badge}
              href="/cheatsheet.html"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col gap-1 p-2.5 rounded-lg border text-left transition-all hover:scale-[1.02] hover:shadow-lg ${color}`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{badge}</span>
              <span className="text-xs font-semibold text-white">{label}</span>
              <span className="text-[10px] text-gray-400 leading-snug">{items}</span>
            </a>
          ))}
        </div>
      </div>

      {/* MUST-DO highlight */}
      <div className="card p-4 border-red-900/30 bg-red-950/10">
        <div className="flex items-center gap-2 mb-3">
          <Star size={14} className="text-red-400" />
          <h3 className="text-sm font-semibold text-white">MUST-DO Tasks (Upcoming)</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {studyPlan
            .slice(currentDay.day - 1, currentDay.day + 6)
            .flatMap(d => d.tasks)
            .filter(t => t.must && !completed.has(t.id))
            .slice(0, 6)
            .map(task => (
              <div key={task.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-900 border border-gray-800">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs text-gray-400 block">Day {task.day} · {task.category}</span>
                  <span className="text-xs text-white truncate block">{task.title}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
