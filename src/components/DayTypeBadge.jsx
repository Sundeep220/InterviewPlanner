import { DAY_BUDGET, formatMinutes } from '../data/studyPlan';

export default function DayTypeBadge({ day, showBudget = false }) {
  const budget = DAY_BUDGET[day.type];
  const isWeekend = day.type === 'weekend';
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${
        isWeekend
          ? 'bg-fuchsia-600/20 text-fuchsia-300 border-fuchsia-600/30'
          : 'bg-gray-800 text-gray-400 border-gray-700'
      }`}
      title={`${budget.label} budget: ${budget.hours}`}
    >
      {isWeekend ? 'Weekend' : 'Weekday'} · {formatMinutes(day.plannedMinutes)}
      {showBudget && <span className="text-gray-500"> / {budget.hours}</span>}
    </span>
  );
}
