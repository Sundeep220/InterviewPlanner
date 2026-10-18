import { useState, useCallback, useMemo, useEffect } from 'react';
import { studyPlan, getAllTasks, getTaskById, CATEGORY_COLORS, TOTAL_DAYS, DAY_BUDGET } from './data/studyPlan';
import { useTracking, useNow } from './hooks/useTracking';
import { computeSchedule } from './utils/schedule';
import { LetsBeginButton, BeginPlanModal, SchedulePill, ActiveTimerChip, DayStatusBadge, DayDateLine, dayCardTone } from './components/ScheduleWidgets';
import Dashboard from './components/Dashboard';
import WeekView from './components/WeekView';
import DayDetail from './components/DayDetail';
import CustomView from './components/CustomView';
import DayTypeBadge from './components/DayTypeBadge';
import { LayoutDashboard, Calendar, List, Target, FolderPlus, BookOpen } from 'lucide-react';

// Task IDs used to be prefixed with the day number ("d12-lld-..."). Plan days were reshuffled,
// so map legacy IDs onto the stable, day-independent IDs to keep earlier progress.
function migrateLegacyIds(ids) {
  const known = new Set(getAllTasks().map(t => t.id));
  return ids.map(id => {
    if (known.has(id)) return id;
    const stripped = id.replace(/^d\d+-/, '');
    return known.has(stripped) ? stripped : id;
  });
}

function useProgress() {
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('ipt-completed-v1');
      const migrated = migrateLegacyIds(saved ? JSON.parse(saved) : []);
      localStorage.setItem('ipt-completed-v1', JSON.stringify([...new Set(migrated)]));
      return new Set(migrated);
    } catch {
      return new Set();
    }
  });

  const toggleTask = useCallback((taskId) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      localStorage.setItem('ipt-completed-v1', JSON.stringify([...next]));
      return next;
    });
  }, []);

  const markAllDay = useCallback((dayNum, tasks, done) => {
    setCompleted(prev => {
      const next = new Set(prev);
      tasks.forEach(t => done ? next.add(t.id) : next.delete(t.id));
      localStorage.setItem('ipt-completed-v1', JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { completed, toggleTask, markAllDay };
}

function useCustomSections() {
  const [sections, setSections] = useState(() => {
    try {
      const saved = localStorage.getItem('ipt-custom-sections-v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const updateSections = useCallback((updater) => {
    setSections(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem('ipt-custom-sections-v1', JSON.stringify(next));
      return next;
    });
  }, []);

  return [sections, updateSections];
}

function useStats(completed) {
  return useMemo(() => {
    const all = getAllTasks();
    const doneCount = all.filter(t => completed.has(t.id)).length;
    const byCategory = { DSA: { total: 0, done: 0 }, LLD: { total: 0, done: 0 }, HLD: { total: 0, done: 0 }, Behavioral: { total: 0, done: 0 } };
    all.forEach(t => {
      if (byCategory[t.category]) {
        byCategory[t.category].total++;
        if (completed.has(t.id)) byCategory[t.category].done++;
      }
    });

    // Streak: count consecutive completed days from day 1
    let streak = 0;
    for (const day of studyPlan) {
      const dayDone = day.tasks.every(t => completed.has(t.id));
      if (dayDone) streak++;
      else break;
    }

    // Current day (first incomplete day)
    const currentDay = studyPlan.find(d => !d.tasks.every(t => completed.has(t.id)))?.day || TOTAL_DAYS;

    return { total: all.length, done: doneCount, byCategory, streak, currentDay };
  }, [completed]);
}

export default function App() {
  const { completed, toggleTask, markAllDay } = useProgress();
  const stats = useStats(completed);
  const [sections, updateSections] = useCustomSections();
  const [view, setView] = useState(() => localStorage.getItem('ipt-view-v1') || 'dashboard');
  const [selectedDay, setSelectedDay] = useState(() => Number(localStorage.getItem('ipt-selected-day-v1')) || null);
  useEffect(() => {
    localStorage.setItem('ipt-view-v1', view);
    localStorage.setItem('ipt-selected-day-v1', selectedDay ?? '');
  }, [view, selectedDay]);
  const [showBegin, setShowBegin] = useState(false);
  const { tracking, recordMark, visitDay } = useTracking();
  const minuteTick = useNow(30000);
  const schedule = useMemo(
    () => computeSchedule({ studyPlan, completed, tracking, now: new Date(minuteTick) }),
    [completed, tracking, minuteTick],
  );

  const handleToggleTask = (taskId) => {
    const task = getTaskById(taskId);
    if (task) recordMark([taskId], !completed.has(taskId), task.day);
    toggleTask(taskId);
  };

  const handleMarkAllDay = (dayNum, tasks, done) => {
    recordMark(tasks.map(t => t.id), done, dayNum);
    markAllDay(dayNum, tasks, done);
  };

  const handleDayClick = (dayNum) => {
    visitDay(dayNum);
    setSelectedDay(dayNum);
    setView('day');
  };

  const handleBack = () => {
    setSelectedDay(null);
    setView('weeks');
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Target size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">Interview Prep Tracker</h1>
              <p className="text-xs text-gray-500 whitespace-nowrap" title={`Weekdays ${DAY_BUDGET.weekday.hours} · Weekends ${DAY_BUDGET.weekend.hours}`}>
                {TOTAL_DAYS}-Day SDE-2 Plan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Progress pill */}
            <div className="hidden 2xl:flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-4 py-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-semibold text-white">{stats.done}/{stats.total}</span>
              <span className="text-xs text-gray-500">tasks done</span>
            </div>
            {schedule.started ? <SchedulePill schedule={schedule} /> : <LetsBeginButton onClick={() => setShowBegin(true)} />}
            <ActiveTimerChip onOpenDay={handleDayClick} />
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setView('dashboard')}
              className={`nav-btn ${view === 'dashboard' ? 'nav-btn-active' : 'nav-btn-inactive'}`}
            >
              <span className="hidden sm:inline">Dashboard</span>
              <LayoutDashboard size={16} className="sm:hidden" />
            </button>
            <button
              onClick={() => setView('weeks')}
              className={`nav-btn ${view === 'weeks' || view === 'day' ? 'nav-btn-active' : 'nav-btn-inactive'}`}
            >
              <span className="hidden sm:inline">Week View</span>
              <Calendar size={16} className="sm:hidden" />
            </button>
            <button
              onClick={() => setView('all')}
              className={`nav-btn ${view === 'all' ? 'nav-btn-active' : 'nav-btn-inactive'}`}
            >
              <span className="hidden sm:inline">All Days</span>
              <List size={16} className="sm:hidden" />
            </button>
            <button
              onClick={() => setView('custom')}
              className={`nav-btn ${view === 'custom' ? 'nav-btn-active' : 'nav-btn-inactive'}`}
            >
              <span className="hidden sm:inline flex items-center gap-1">Custom {sections.length > 0 && <span className="ml-1 text-xs bg-blue-500 text-white rounded-full w-4 h-4 inline-flex items-center justify-center">{sections.length}</span>}</span>
              <FolderPlus size={16} className="sm:hidden" />
            </button>
            <a
              href="/cheatsheet.html"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-btn nav-btn-inactive flex items-center gap-1.5"
              title="Open Java DSA Cheat Sheet in a new tab"
            >
              <BookOpen size={14} />
              <span className="hidden sm:inline">Cheat Sheet</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {view === 'dashboard' && (
          <Dashboard
            stats={stats}
            completed={completed}
            studyPlan={studyPlan}
            onDayClick={handleDayClick}
            schedule={schedule}
            onBegin={() => setShowBegin(true)}
          />
        )}

        {view === 'weeks' && (
          <WeekView
            studyPlan={studyPlan}
            completed={completed}
            onDayClick={handleDayClick}
            stats={stats}
            schedule={schedule}
            onBegin={() => setShowBegin(true)}
          />
        )}

        {view === 'day' && selectedDay && (
          <DayDetail
            dayNum={selectedDay}
            completed={completed}
            toggleTask={handleToggleTask}
            markAllDay={handleMarkAllDay}
            onBack={handleBack}
            onNavigate={handleDayClick}
            schedule={schedule}
            onBegin={() => setShowBegin(true)}
          />
        )}

        {view === 'all' && (
          <AllDaysView
            studyPlan={studyPlan}
            completed={completed}
            onDayClick={handleDayClick}
            schedule={schedule}
          />
        )}

        {view === 'custom' && (
          <CustomView
            sections={sections}
            updateSections={updateSections}
            completed={completed}
            toggleTask={toggleTask}
          />
        )}
      </main>
      {showBegin && <BeginPlanModal onClose={() => setShowBegin(false)} />}
    </div>
  );
}

function AllDaysView({ studyPlan, completed, onDayClick, schedule }) {
  const [filterCat, setFilterCat] = useState('All');
  const categories = ['All', 'DSA', 'LLD', 'HLD', 'Behavioral'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">All {TOTAL_DAYS} Days</h2>
        <div className="flex gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filterCat === c
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {studyPlan.map(day => {
          const filteredTasks = filterCat === 'All' ? day.tasks : day.tasks.filter(t => t.category === filterCat);
          if (filteredTasks.length === 0) return null;
          const doneTasks = day.tasks.filter(t => completed.has(t.id)).length;
          const pct = Math.round((doneTasks / day.tasks.length) * 100);
          const isComplete = doneTasks === day.tasks.length;
          const info = schedule.days?.[day.day];

          return (
            <div
              key={day.day}
              onClick={() => onDayClick(day.day)}
              className={`card p-4 cursor-pointer hover:border-gray-700 hover:bg-gray-900/80 transition-all group ${dayCardTone(info)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold w-12 ${isComplete ? 'text-green-400' : 'text-gray-400'}`}>
                    Day {day.day}
                  </span>
                  <span className="text-sm text-gray-500">Week {day.week}</span>
                  <DayTypeBadge day={day} />
                  <span className="text-sm text-white font-medium">{day.theme}</span>
                </div>
                <div className="flex items-center gap-3">
                  <DayDateLine info={info} />
                  <DayStatusBadge info={info} />
                  <span className="text-xs text-gray-500">{doneTasks}/{day.tasks.length}</span>
                  <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: isComplete ? '#10b981' : '#3b82f6' }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-blue-400 transition-colors">→</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 ml-15">
                {filteredTasks.map(task => (
                  <span
                    key={task.id}
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      completed.has(task.id)
                        ? 'bg-gray-800/50 text-gray-600 border-gray-700 line-through'
                        : `${CATEGORY_COLORS[task.category]?.bg} ${CATEGORY_COLORS[task.category]?.text} ${CATEGORY_COLORS[task.category]?.border}`
                    }`}
                  >
                    {task.category}: {task.title.length > 35 ? task.title.slice(0, 35) + '…' : task.title}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
