import { ExternalLink, PlayCircle, Lock } from 'lucide-react';
import { getProblemLinks } from '../data/problemLinks';

const PLATFORM_STYLE = {
  LeetCode: 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20',
  NeetCode: 'bg-teal-500/10 text-teal-300 border-teal-500/30 hover:bg-teal-500/20',
  GFG: 'bg-green-600/10 text-green-300 border-green-600/30 hover:bg-green-600/20',
  Code360: 'bg-orange-500/10 text-orange-300 border-orange-500/30 hover:bg-orange-500/20',
  LintCode: 'bg-sky-500/10 text-sky-300 border-sky-500/30 hover:bg-sky-500/20',
  YouTube: 'bg-red-500/10 text-red-300 border-red-500/30 hover:bg-red-500/20',
  GitHub: 'bg-gray-500/10 text-gray-200 border-gray-500/30 hover:bg-gray-500/20',
  AlgoMaster: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20',
  'Tech Interview Handbook': 'bg-violet-500/10 text-violet-300 border-violet-500/30 hover:bg-violet-500/20',
  Article: 'bg-gray-500/10 text-gray-300 border-gray-500/30 hover:bg-gray-500/20',
};

export function PlatformChip({ link }) {
  const video = link.kind === 'video';
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      title={link.premium ? 'LeetCode Premium — use the free version next to it' : link.url}
      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border transition-colors whitespace-nowrap ${PLATFORM_STYLE[link.platform] || PLATFORM_STYLE.Article}`}
    >
      {video ? <PlayCircle size={11} /> : link.premium ? <Lock size={10} /> : <ExternalLink size={10} />}
      {video ? 'Video' : link.platform}
    </a>
  );
}

export function SectionTitle({ icon: Icon, children, count }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      {Icon && <Icon size={13} className="text-gray-400" />}
      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{children}</span>
      {count != null && <span className="text-[11px] text-gray-500">({count})</span>}
    </div>
  );
}

/** Problems become rows with platform links; items without any link render as a plain checklist. */
export function ProblemList({ items }) {
  const rows = items.map(label => ({ label, links: getProblemLinks(label) }));
  const problems = rows.filter(r => r.links.length);
  const checklist = rows.filter(r => !r.links.length);

  return (
    <>
      {problems.length > 0 && (
        <ol className="divide-y divide-gray-800/80 rounded-lg border border-gray-800 bg-gray-950/40">
          {problems.map(({ label, links }, i) => (
            <li key={label} className="flex flex-col sm:flex-row sm:items-center gap-2 px-3 py-2">
              <span className="flex items-start gap-2.5 flex-1 min-w-0">
                <span className="text-[11px] text-gray-500 font-mono w-4 text-right mt-0.5 flex-shrink-0">{i + 1}</span>
                <span className="text-sm text-gray-100 leading-snug">{label}</span>
              </span>
              <span className="flex flex-wrap gap-1.5 sm:justify-end pl-6 sm:pl-0">
                {links.map(link => <PlatformChip key={link.url} link={link} />)}
              </span>
            </li>
          ))}
        </ol>
      )}
      {checklist.length > 0 && (
        <ul className={`space-y-1.5 ${problems.length ? 'mt-3' : ''}`}>
          {checklist.map(({ label }) => (
            <li key={label} className="flex items-start gap-2 text-sm text-gray-200 leading-snug">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-500 flex-shrink-0" />
              {label}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function ResourceList({ resources }) {
  return (
    <div className="flex flex-wrap gap-2">
      {resources.map(r => (
        <a
          key={r.url}
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-colors ${PLATFORM_STYLE[r.platform] || PLATFORM_STYLE.Article}`}
        >
          {r.platform === 'YouTube' ? <PlayCircle size={12} /> : <ExternalLink size={11} />}
          <span className="text-gray-100">{r.label}</span>
          <span className="opacity-70">· {r.platform}</span>
        </a>
      ))}
    </div>
  );
}

// Splits the task notes into readable bullet points; "Watch:" sentences are surfaced as pitfalls.
export function splitNotes(text) {
  const parts = text.split(/(?<=[.!?])\s+(?=[A-Z"'(])/).map(s => s.trim()).filter(Boolean);
  return {
    points: parts.filter(p => !/^Watch:/i.test(p)),
    pitfalls: parts.filter(p => /^Watch:/i.test(p)).map(p => p.replace(/^Watch:\s*/i, '')),
  };
}
