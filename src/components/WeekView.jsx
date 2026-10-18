import { CATEGORY_COLORS, WEEKS, TOTAL_DAYS, DAY_BUDGET, formatMinutes } from '../data/studyPlan';
import { CheckCircle2 } from 'lucide-react';
import DayTypeBadge from './DayTypeBadge';
import { DayStatusBadge, DayDateLine, LetsBeginButton, dayCardTone } from './ScheduleWidgets';
import { formatDateKey, formatDuration } from '../utils/time';

function DayCard({ day, completed, onClick, info }) {
  const done = day.tasks.filter(t => completed.has(t.id)).length;
  const total = day.tasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const isComplete = done === total;
  const hasStarted = done > 0;
  const cats = [...new Set(day.tasks.map(t => t.category))];

  return (
    <button
      onClick={onClick}
      className={`card p-3 text-left w-full hover:border-gray-600 hover:scale-[1.02] transition-all duration-200 group relative overflow-hidden ${
        dayCardTone(info) || (isComplete ? 'border-emerald-800/60 bg-emerald-950/20' : '')
      }`}
    >
      {/* Completion glow */}
      {isComplete && (
        <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${isComplete ? 'text-emerald-400' : hasStarted ? 'text-blue-400' : 'text-gray-500'}`}>
            Day {day.day}
          </span>
          {isComplete && <CheckCircle2 size={12} className="text-emerald-400" />}
        </div>
        <span className="text-xs text-gray-600">{done}/{total}</span>
      </div>

      <div className="mb-2">
        <DayTypeBadge day={day} />
      </div>

      {info && (
        <div className="mb-2 flex flex-col items-start gap-1">
          <DayDateLine info={info} />
          <DayStatusBadge info={info} compact />
          {info.remainingMinutes > 0 && info.status === 'overdue' && (
            <span className="text-xs text-red-400">{formatDuration(info.remainingMinutes)} of work pending</span>
          )}
        </div>
      )}

      {/* Theme */}
      <p className="text-xs text-gray-300 font-medium leading-snug mb-2 line-clamp-2">
        {day.theme}
      </p>

      {/* Category dots */}
      <div className="flex items-center gap-1 mb-2">
        {cats.map(c => (
          <span
            key={c}
            className="text-xs px-1.5 py-0.5 rounded border"
            style={{
              backgroundColor: CATEGORY_COLORS[c]?.hex + '20',
              color: CATEGORY_COLORS[c]?.hex,
              borderColor: CATEGORY_COLORS[c]?.hex + '40',
            }}
          >
            {c}
          </span>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: isComplete ? '#10b981' : '#3b82f6',
          }}
        />
      </div>
    </button>
  );
}

function WeekHeader({ week, studyPlan, completed, schedule }) {
  const weekDays = studyPlan.filter(d => d.week === week.id);
  const totalTasks = weekDays.flatMap(d => d.tasks).length;
  const doneTasks = weekDays.flatMap(d => d.tasks).filter(t => completed.has(t.id)).length;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const isComplete = doneTasks === totalTasks && totalTasks > 0;
  const plannedMinutes = weekDays.reduce((s, d) => s + d.plannedMinutes, 0);
  const infos = schedule.started ? weekDays.map(d => schedule.days[d.day]) : [];
  const overdue = infos.filter(i => i.status === 'overdue');
  const early = infos.filter(i => i.status === 'early').length;
  const pendingOverdue = overdue.reduce((s, i) => s + i.remainingMinutes, 0);

  return (
    <div className={`mb-3 p-3 rounded-xl border ${isComplete ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-gray-900/50 border-gray-800'}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">{week.title}</h3>
            {isComplete && <CheckCircle2 size={14} className="text-emerald-400" />}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{week.theme}</p>
          {infos.length > 0 && (
            <p className="text-xs mt-1 flex flex-wrap gap-x-3">
              <span className="text-gray-400">{formatDateKey(infos[0].scheduledDate)} – {formatDateKey(infos[infos.length - 1].scheduledDate)}</span>
              {overdue.length > 0 && <span className="text-red-400">{overdue.length} missed day{overdue.length > 1 ? 's' : ''} · {formatDuration(pendingOverdue)} pending</span>}
              {early > 0 && <span className="text-emerald-300">⚡ {early} day{early > 1 ? 's' : ''} finished early</span>}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-white">{pct}%</div>
          <div className="text-xs text-gray-500">{doneTasks}/{totalTasks} · {formatMinutes(plannedMinutes)} planned</div>
        </div>
      </div>
      <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: isComplete ? '#10b981' : '#3b82f6' }}
        />
      </div>
    </div>
  );
}

export default function WeekView({ studyPlan, completed, onDayClick, stats, schedule, onBegin }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">{TOTAL_DAYS}-Day Study Plan</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {stats.done} tasks done · {TOTAL_DAYS - studyPlan.filter(d => d.tasks.every(t => completed.has(t.id))).length} days remaining
            {' · '}Weekdays {DAY_BUDGET.weekday.hours} · Weekends {DAY_BUDGET.weekend.hours}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!schedule.started && <LetsBeginButton onClick={onBegin} />}
          {Object.entries(CATEGORY_COLORS).map(([cat, c]) => (
            <div key={cat} className="hidden sm:flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hex }} />
              <span className="text-xs text-gray-400">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {WEEKS.map(week => {
          const weekDays = studyPlan.filter(d => d.week === week.id);
          return (
            <div key={week.id}>
              <WeekHeader week={week} studyPlan={studyPlan} completed={completed} schedule={schedule} />
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {weekDays.map(day => (
                  <DayCard
                    key={day.day}
                    day={day}
                    completed={completed}
                    info={schedule.days?.[day.day]}
                    onClick={() => onDayClick(day.day)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
