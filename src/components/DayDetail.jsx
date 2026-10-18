import { useState } from 'react';
import { getDayData, CATEGORY_COLORS, TOTAL_DAYS } from '../data/studyPlan';
import DayTypeBadge from './DayTypeBadge';
import { DayStatusBadge, DayDateLine, TaskTimer, LetsBeginButton } from './ScheduleWidgets';
import { useTracking, useNow, getTrackedMs } from '../hooks/useTracking';
import { formatDateTime, formatDuration, timeAgo } from '../utils/time';
import { getProblemLinks, getTaskResources } from '../data/problemLinks';
import { ProblemList, ResourceList, SectionTitle, splitNotes } from './ProblemLinks';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, ChevronDown, ChevronUp, Clock, BookOpen, Lightbulb, AlertTriangle, Code2, ListChecks, Link2 } from 'lucide-react';

const DIFF_COLORS = {
  Easy: 'text-green-400 bg-green-500/10 border-green-500/20',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  Hard: 'text-red-400 bg-red-500/10 border-red-500/20',
  Theory: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Mock: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  Review: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
};

function TaskCard({ task, isCompleted, onToggle, started }) {
  const [expanded, setExpanded] = useState(false);
  const { tracking, visitTask } = useTracking();
  const meta = tracking.tasks[task.id] || {};
  const toggleExpanded = () => {
    if (!expanded) visitTask(task.id, task.day);
    setExpanded(!expanded);
  };
  const colors = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.DSA;
  const linkedCount = task.problems.filter(p => getProblemLinks(p).length).length;
  const resources = getTaskResources(task);
  const { points, pitfalls } = splitNotes(task.description || '');
  const isProblemSet = linkedCount > 0;
  const stop = (e) => e.stopPropagation();

  return (
    <div className={`card border-l-4 transition-all duration-200 overflow-hidden ${
      isCompleted ? 'opacity-75' : expanded ? 'border-gray-700 shadow-lg shadow-black/30' : 'hover:border-gray-700'
    }`} style={{ borderLeftColor: colors.hex }}>
      {/* Header: click anywhere to expand */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={toggleExpanded}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpanded(); } }}
        className="p-4 cursor-pointer select-none"
      >
        <div className="flex items-start gap-3">
          <button
            onClick={e => { stop(e); onToggle(); }}
            title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            className={`mt-0.5 flex-shrink-0 transition-all duration-200 ${
              isCompleted ? 'text-green-400' : 'text-gray-600 hover:text-blue-400 hover:scale-110'
            }`}
          >
            {isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colors.bg} ${colors.text} ${colors.border}`}>{task.category}</span>
              {task.subcategory && <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">{task.subcategory}</span>}
              {task.difficulty && <span className={`text-xs px-2 py-0.5 rounded-full border ${DIFF_COLORS[task.difficulty] || DIFF_COLORS.Theory}`}>{task.difficulty}</span>}
              {task.must && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-medium">⚡ MUST</span>}
            </div>

            <h4 className={`text-[15px] font-semibold leading-snug ${isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>{task.title}</h4>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Clock size={12} /> {task.estimatedTime}</span>
              {isProblemSet
                ? <span className="flex items-center gap-1"><ListChecks size={12} /> {linkedCount} problem{linkedCount > 1 ? 's' : ''} with links</span>
                : task.problems.length > 0 && <span className="flex items-center gap-1"><ListChecks size={12} /> {task.problems.length} checklist items</span>}
              {resources.length > 0 && <span className="flex items-center gap-1"><Link2 size={12} /> {resources.length} resource{resources.length > 1 ? 's' : ''}</span>}
              {meta.completedAt && <span className="text-emerald-400">✓ Done {formatDateTime(meta.completedAt)}</span>}
            </div>

            {started && !isCompleted && (
              <div className="mt-2.5" onClick={stop}>
                <TaskTimer task={task} />
              </div>
            )}
          </div>

          <span className={`mt-0.5 flex-shrink-0 flex items-center gap-1 text-xs ${expanded ? 'text-gray-300' : 'text-gray-500'}`}>
            <span className="hidden sm:inline">{expanded ? 'Hide' : 'Details'}</span>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-800 bg-gray-950/30 px-4 sm:px-5 py-4 space-y-5">
          {points.length > 0 && (
            <section>
              <SectionTitle icon={Lightbulb}>Key ideas</SectionTitle>
              <ul className="space-y-1.5">
                {points.map(p => (
                  <li key={p} className="flex items-start gap-2 text-sm text-gray-200 leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.hex }} />
                    {p}
                  </li>
                ))}
              </ul>
              {pitfalls.map(p => (
                <div key={p} className="mt-3 flex items-start gap-2 text-sm text-amber-200 bg-amber-500/10 border border-amber-500/25 rounded-lg px-3 py-2">
                  <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-amber-400" />
                  <span><span className="font-semibold">Watch out:</span> {p}</span>
                </div>
              ))}
            </section>
          )}

          {task.problems.length > 0 && (
            <section>
              <SectionTitle icon={isProblemSet ? Code2 : ListChecks} count={task.problems.length}>{isProblemSet ? 'Problems' : 'Checklist'}</SectionTitle>
              <ProblemList items={task.problems} />
            </section>
          )}

          {resources.length > 0 && (
            <section>
              <SectionTitle icon={BookOpen}>Study resources</SectionTitle>
              <ResourceList resources={resources} />
            </section>
          )}

          {(meta.prevVisitedAt || meta.lastWorkedAt || meta.lastMarkedAt || meta.trackedMs > 0) && (
            <section className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 border-t border-gray-800 pt-3">
              {meta.prevVisitedAt && <span>Previously opened {timeAgo(meta.prevVisitedAt)}</span>}
              {meta.lastWorkedAt && <span>Last worked {formatDateTime(meta.lastWorkedAt)}</span>}
              {meta.lastMarkedAt && <span>Last marked {formatDateTime(meta.lastMarkedAt)}</span>}
              {meta.trackedMs > 0 && <span>Time spent {formatDuration(meta.trackedMs / 60000)}</span>}
            </section>
          )}

          <button
            onClick={onToggle}
            className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isCompleted ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white' : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            {isCompleted ? '↩ Mark as Incomplete' : '✓ Mark as Complete'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function DayDetail({ dayNum, completed, toggleTask, markAllDay, onBack, onNavigate, schedule, onBegin }) {
  const [filterCat, setFilterCat] = useState('All');
  const { tracking } = useTracking();
  const now = useNow(1000);
  const dayData = getDayData(dayNum);
  if (!dayData) return null;
  const info = schedule.days?.[dayNum];
  const dayMeta = tracking.days[dayNum] || {};
  const trackedMin = dayData.tasks.reduce((s, t) => s + getTrackedMs(tracking, t.id, now), 0) / 60000;

  const { day, week, theme, tasks } = dayData;
  const doneTasks = tasks.filter(t => completed.has(t.id)).length;
  const allDone = doneTasks === tasks.length;
  const pct = Math.round((doneTasks / tasks.length) * 100);

  const cats = [...new Set(tasks.map(t => t.category))];

  const filteredTasks = filterCat === 'All' ? tasks : tasks.filter(t => t.category === filterCat);

  const catCounts = tasks.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ChevronLeft size={16} />
          Back to Week View
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dayNum > 1 && onNavigate(dayNum - 1)}
            disabled={dayNum <= 1}
            className="p-1.5 rounded-lg border border-gray-800 hover:border-gray-600 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-gray-400 px-2">Day {dayNum} / {TOTAL_DAYS}</span>
          <button
            onClick={() => dayNum < TOTAL_DAYS && onNavigate(dayNum + 1)}
            disabled={dayNum >= TOTAL_DAYS}
            className="p-1.5 rounded-lg border border-gray-800 hover:border-gray-600 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Day Header Card */}
      <div className={`card p-5 mb-4 ${allDone ? 'border-emerald-800/60 bg-emerald-950/20' : 'border-gray-800'}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-0.5 rounded-full">
                Week {week}
              </span>
              <span className="text-xs bg-gray-800 text-gray-400 border border-gray-700 px-2 py-0.5 rounded-full">
                Day {day}
              </span>
              <DayTypeBadge day={dayData} showBudget />
              <DayStatusBadge info={info} />
              {allDone && (
                <span className="text-xs bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={10} /> Complete!
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-white mb-1">{theme}</h2>
            <div className="flex items-center gap-3">
              {cats.map(c => (
                <span key={c} className="text-xs" style={{ color: CATEGORY_COLORS[c]?.hex }}>
                  {catCounts[c]} {c} task{catCounts[c] > 1 ? 's' : ''}
                </span>
              ))}
            </div>
            {schedule.started ? (
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                <DayDateLine info={info} />
                <span>Planned {formatDuration(dayData.plannedMinutes)}</span>
                <span className={info.status === 'overdue' ? 'text-red-400' : ''}>Remaining {formatDuration(info.remainingMinutes)}</span>
                <span>Time tracked {formatDuration(trackedMin)}</span>
                {dayMeta.startedAt && <span>Started {formatDateTime(dayMeta.startedAt)}</span>}
                {dayMeta.prevVisitedAt && <span>Previous visit {timeAgo(dayMeta.prevVisitedAt, now)}</span>}
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                <LetsBeginButton onClick={onBegin} /> Start the plan to get dates, timers and catch-up tracking.
              </div>
            )}
          </div>

          {/* Progress circle */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="relative w-16 h-16">
              <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="32" cy="32" r="26" fill="none" stroke="#1f2937" strokeWidth="6" />
                <circle
                  cx="32" cy="32" r="26"
                  fill="none"
                  stroke={allDone ? '#10b981' : '#3b82f6'}
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 26}
                  strokeDashoffset={2 * Math.PI * 26 * (1 - pct / 100)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                {pct}%
              </span>
            </div>
            <span className="text-xs text-gray-500">{doneTasks}/{tasks.length}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: allDone ? '#10b981' : '#3b82f6' }}
          />
        </div>

        {/* Action buttons */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => markAllDay(dayNum, tasks, true)}
            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 hover:bg-emerald-600/30 transition-all"
          >
            ✓ Mark All Complete
          </button>
          <button
            onClick={() => markAllDay(dayNum, tasks, false)}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 transition-all"
          >
            ↩ Mark All Incomplete
          </button>
        </div>
      </div>

      {/* Category Filter */}
      {cats.length > 1 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-500">Filter:</span>
          <button
            onClick={() => setFilterCat('All')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filterCat === 'All' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            All ({tasks.length})
          </button>
          {cats.map(c => {
            const colors = CATEGORY_COLORS[c];
            return (
              <button
                key={c}
                onClick={() => setFilterCat(c)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                  filterCat === c
                    ? `${colors.bg} ${colors.text} ${colors.border}`
                    : 'border-transparent text-gray-500 hover:text-white'
                }`}
              >
                {c} ({catCounts[c]})
              </button>
            );
          })}
        </div>
      )}

      {/* Tasks */}
      <div className="space-y-3">
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            isCompleted={completed.has(task.id)}
            onToggle={() => toggleTask(task.id)}
            started={schedule.started}
          />
        ))}
      </div>

      {/* Day complete banner */}
      {allDone && (
        <div className="mt-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/40 text-center">
          <div className="text-2xl mb-1">🎉</div>
          <p className="text-sm font-semibold text-emerald-400">Day {day} Complete!</p>
          <p className="text-xs text-gray-400 mt-1">
            {dayNum < TOTAL_DAYS ? `Move on to Day ${dayNum + 1} →` : 'You finished the entire plan! 🏆'}
          </p>
          {dayNum < TOTAL_DAYS && (
            <button
              onClick={() => onNavigate(dayNum + 1)}
              className="mt-3 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-all"
            >
              Go to Day {dayNum + 1} →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
