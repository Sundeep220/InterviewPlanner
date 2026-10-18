import { useState, useRef } from 'react';
import { Plus, Upload, Trash2, ChevronDown, ChevronUp, CheckCircle2, Circle, Download, X, FileJson } from 'lucide-react';
import { CATEGORY_COLORS } from '../data/studyPlan';
import { getProblemUrl } from '../data/problemLinks';

const PRESET_COLORS = [
  '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b',
  '#ef4444', '#06b6d4', '#f97316', '#84cc16',
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Theory', 'Mock', 'Review'];
const CATEGORIES = ['DSA', 'LLD', 'HLD', 'Behavioral', 'Custom'];

const EMPTY_TASK = {
  title: '', category: 'Custom', subcategory: '', description: '',
  difficulty: 'Medium', estimatedTime: '45 min', problems: '', must: false,
};
const EMPTY_SECTION = { name: '', description: '', color: '#3b82f6' };

function genId(prefix = 'c') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const SAMPLE_JSON = {
  name: 'SQL Roadmap',
  description: 'SQL from basics to advanced query optimization',
  color: '#f59e0b',
  tasks: [
    {
      title: 'Basic SELECT & Filtering',
      subcategory: 'Basics',
      category: 'Custom',
      description: 'SELECT, WHERE, ORDER BY, LIMIT, DISTINCT, aliases',
      difficulty: 'Easy',
      estimatedTime: '45 min',
      problems: ['HackerRank: Basic SELECT', 'Mode Analytics: SQL Basics'],
      must: true,
    },
    {
      title: 'JOINs (INNER, LEFT, RIGHT, FULL)',
      subcategory: 'Joins',
      category: 'Custom',
      description: 'Understanding different join types and when to use each',
      difficulty: 'Medium',
      estimatedTime: '60 min',
      problems: ['HackerRank: The Report', 'LeetCode #175 Combine Two Tables'],
      must: true,
    },
  ],
};

// ─── Task Row ────────────────────────────────────────────────────────────────
function TaskRow({ task, isCompleted, onToggle, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[task.category] || { bg: 'bg-gray-700/30', text: 'text-gray-300', border: 'border-gray-600/40', hex: '#6b7280' };

  return (
    <div className={`rounded-lg border transition-all ${isCompleted ? 'border-gray-800/40 opacity-60' : 'border-gray-800 hover:border-gray-700'}`}>
      <div className="flex items-center gap-3 p-3">
        <button onClick={onToggle} className={`flex-shrink-0 transition-all ${isCompleted ? 'text-green-400' : 'text-gray-600 hover:text-blue-400'}`}>
          {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <span className={`text-xs px-1.5 py-0.5 rounded border ${catColor.bg} ${catColor.text} ${catColor.border}`}>{task.category}</span>
            {task.subcategory && <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">{task.subcategory}</span>}
            <span className={`text-xs px-1.5 py-0.5 rounded border ${
              task.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
              task.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
              'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
            }`}>{task.difficulty}</span>
            {task.must && <span className="text-xs text-red-400">⚡ MUST</span>}
          </div>
          <p className={`text-sm font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>{task.title}</p>
          <p className="text-xs text-gray-600">{task.estimatedTime}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => setExpanded(!expanded)} className="text-gray-600 hover:text-gray-400 p-1">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button onClick={onDelete} className="text-gray-700 hover:text-red-400 p-1 transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t border-gray-800/60 space-y-2">
          {task.description && <p className="text-xs text-gray-400 mt-2">{task.description}</p>}
          {task.problems?.length > 0 && (
            <ul className="space-y-0.5 mt-1">
              {task.problems.map((p, i) => {
                const url = getProblemUrl(p);
                return (
                  <li key={i} className="text-xs text-gray-400 flex gap-1.5">
                    <span className="text-gray-600 font-mono flex-shrink-0">{i + 1}.</span>
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline underline-offset-2 transition-colors">{p}</a>
                    ) : (
                      <span>{p}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Add Task Form ────────────────────────────────────────────────────────────
function AddTaskForm({ onAdd, onClose }) {
  const [form, setForm] = useState(EMPTY_TASK);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAdd({
      id: genId('task'),
      ...form,
      problems: form.problems ? form.problems.split('\n').map(s => s.trim()).filter(Boolean) : [],
    });
    setForm(EMPTY_TASK);
  };

  const inputCls = 'w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-600';
  const labelCls = 'text-xs text-gray-400 mb-1 block';

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900/70 border border-gray-700 rounded-xl p-4 space-y-3 mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-white">Add Task</span>
        <button type="button" onClick={onClose} className="text-gray-600 hover:text-gray-400"><X size={14} /></button>
      </div>

      <div>
        <label className={labelCls}>Title *</label>
        <input className={inputCls} placeholder="e.g. SQL Window Functions" value={form.title} onChange={e => set('title', e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Category</label>
          <select className={inputCls} value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Difficulty</label>
          <select className={inputCls} value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Subcategory</label>
          <input className={inputCls} placeholder="e.g. Joins" value={form.subcategory} onChange={e => set('subcategory', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Time Estimate</label>
          <input className={inputCls} placeholder="45 min" value={form.estimatedTime} onChange={e => set('estimatedTime', e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <input className={inputCls} placeholder="Brief notes..." value={form.description} onChange={e => set('description', e.target.value)} />
      </div>

      <div>
        <label className={labelCls}>Problems / Resources (one per line)</label>
        <textarea className={`${inputCls} resize-none h-16`} placeholder={'LeetCode #1 Two Sum\nHackerRank: Basic SQL'} value={form.problems} onChange={e => set('problems', e.target.value)} />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-3.5 h-3.5 accent-red-500" checked={form.must} onChange={e => set('must', e.target.checked)} />
          <span className="text-xs text-gray-400">Mark as MUST-DO</span>
        </label>
        <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-500 transition-all font-medium">
          Add Task
        </button>
      </div>
    </form>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ section, completed, toggleTask, onDelete, onAddTask, onDeleteTask }) {
  const [expanded, setExpanded] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  const tasks = section.tasks || [];
  const done = tasks.filter(t => completed.has(t.id)).length;
  const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div className="card border-gray-800 overflow-hidden">
      {/* Section header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-3 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: section.color }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{section.name}</h3>
                <span className="text-xs text-gray-500">{done}/{tasks.length} · {pct}%</span>
              </div>
              {section.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{section.description}</p>}
              <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden w-48">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: section.color }} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setAddOpen(!addOpen)}
              className="text-xs px-2 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600/30 transition-all flex items-center gap-1"
            >
              <Plus size={11} /> Task
            </button>
            <button onClick={() => setExpanded(!expanded)} className="text-gray-600 hover:text-gray-400 p-1.5">
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            <button onClick={() => onDelete(section.id)} className="text-gray-700 hover:text-red-400 p-1.5 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Task list + add form */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2 border-t border-gray-800/60 pt-3">
          {tasks.length === 0 && !addOpen && (
            <p className="text-xs text-gray-600 py-2 text-center">No tasks yet. Click "+ Task" to add one.</p>
          )}
          {tasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              isCompleted={completed.has(task.id)}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => onDeleteTask(section.id, task.id)}
            />
          ))}
          {addOpen && (
            <AddTaskForm
              onAdd={(task) => { onAddTask(section.id, task); setAddOpen(false); }}
              onClose={() => setAddOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main CustomView ──────────────────────────────────────────────────────────
export default function CustomView({ sections, updateSections, completed, toggleTask }) {
  const [newSecOpen, setNewSecOpen] = useState(false);
  const [secForm, setSecForm] = useState(EMPTY_SECTION);
  const [importError, setImportError] = useState('');
  const fileRef = useRef();

  const setSecField = (k, v) => setSecForm(p => ({ ...p, [k]: v }));

  const handleAddSection = (e) => {
    e.preventDefault();
    if (!secForm.name.trim()) return;
    updateSections(prev => [...prev, { id: genId('sec'), ...secForm, tasks: [] }]);
    setSecForm(EMPTY_SECTION);
    setNewSecOpen(false);
  };

  const handleDeleteSection = (id) => {
    if (!confirm('Delete this section and all its tasks?')) return;
    updateSections(prev => prev.filter(s => s.id !== id));
  };

  const handleAddTask = (sectionId, task) => {
    updateSections(prev => prev.map(s => s.id === sectionId ? { ...s, tasks: [...s.tasks, task] } : s));
  };

  const handleDeleteTask = (sectionId, taskId) => {
    updateSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, tasks: s.tasks.filter(t => t.id !== taskId) } : s
    ));
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportError('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        // Support single section or array of sections
        const entries = Array.isArray(data) ? data : [data];
        const newSections = entries.map(d => ({
          id: genId('sec'),
          name: d.name || 'Imported Section',
          description: d.description || '',
          color: d.color || '#3b82f6',
          tasks: (d.tasks || []).map(t => ({
            id: genId('task'),
            title: t.title || 'Untitled',
            category: t.category || 'Custom',
            subcategory: t.subcategory || '',
            description: t.description || '',
            difficulty: t.difficulty || 'Medium',
            estimatedTime: t.estimatedTime || '45 min',
            problems: Array.isArray(t.problems) ? t.problems : (t.problems ? [t.problems] : []),
            must: !!t.must,
          })),
        }));
        updateSections(prev => [...prev, ...newSections]);
        fileRef.current.value = '';
      } catch {
        setImportError('Invalid JSON format. Check the sample template.');
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = () => {
    const blob = new Blob([JSON.stringify(SAMPLE_JSON, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'sample-roadmap.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const totalCustomTasks = sections.flatMap(s => s.tasks).length;
  const totalCustomDone = sections.flatMap(s => s.tasks).filter(t => completed.has(t.id)).length;

  const inputCls = 'w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-600';

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Custom Roadmaps</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {sections.length === 0
              ? 'Add your own topics, roadmaps, or study tracks'
              : `${sections.length} section${sections.length > 1 ? 's' : ''} · ${totalCustomDone}/${totalCustomTasks} tasks done`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadSample}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-800 text-gray-400 border border-gray-700 hover:text-white hover:border-gray-600 text-xs transition-all"
          >
            <Download size={13} /> Sample JSON
          </button>
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-600/30 hover:bg-violet-600/30 text-xs transition-all cursor-pointer">
            <Upload size={13} /> Import JSON
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
          <button
            onClick={() => setNewSecOpen(!newSecOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-500 transition-all"
          >
            <Plus size={13} /> New Section
          </button>
        </div>
      </div>

      {importError && (
        <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-700/40 text-xs text-red-400 flex items-center justify-between">
          {importError}
          <button onClick={() => setImportError('')}><X size={12} /></button>
        </div>
      )}

      {/* New Section Form */}
      {newSecOpen && (
        <form onSubmit={handleAddSection} className="card p-4 mb-4 border-blue-900/40 bg-blue-950/10 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-white">New Section</span>
            <button type="button" onClick={() => setNewSecOpen(false)} className="text-gray-600 hover:text-gray-400"><X size={15} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Section Name *</label>
              <input className={inputCls} placeholder="e.g. SQL Roadmap, System Design, Python" value={secForm.name} onChange={e => setSecField('name', e.target.value)} required />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Description (optional)</label>
              <input className={inputCls} placeholder="Brief description" value={secForm.description} onChange={e => setSecField('description', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button
                  key={c} type="button"
                  onClick={() => setSecField('color', c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${secForm.color === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 font-medium transition-all">
              Create Section
            </button>
          </div>
        </form>
      )}

      {/* Import hint */}
      {sections.length === 0 && !newSecOpen && (
        <div className="card p-8 border-dashed text-center space-y-3">
          <FileJson size={32} className="text-gray-700 mx-auto" />
          <div>
            <p className="text-sm font-medium text-gray-400">No custom sections yet</p>
            <p className="text-xs text-gray-600 mt-1">Create a new section manually or import a JSON roadmap file</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setNewSecOpen(true)} className="px-4 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-500">
              + New Section
            </button>
            <span className="text-xs text-gray-600">or</span>
            <button onClick={handleDownloadSample} className="px-4 py-2 bg-gray-800 text-gray-300 text-xs rounded-lg hover:bg-gray-700">
              Download Sample JSON
            </button>
          </div>
        </div>
      )}

      {/* Section Cards */}
      <div className="space-y-3">
        {sections.map(section => (
          <SectionCard
            key={section.id}
            section={section}
            completed={completed}
            toggleTask={toggleTask}
            onDelete={handleDeleteSection}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}
