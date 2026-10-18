// Dates are handled as local calendar keys ("YYYY-MM-DD") so day boundaries follow the user's timezone.
const pad = (n) => String(n).padStart(2, '0');

export const toDateKey = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const fromDateKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (key, n) => {
  const d = fromDateKey(key);
  d.setDate(d.getDate() + n);
  return toDateKey(d);
};

// Whole calendar days from a to b (positive when b is later). Uses UTC to ignore DST shifts.
export const diffDays = (a, b) => {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
};

export const formatDateKey = (key, opts = { weekday: 'short', day: 'numeric', month: 'short' }) =>
  fromDateKey(key).toLocaleDateString(undefined, opts);

export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export const formatDuration = (minutes) => {
  const m = Math.max(0, Math.round(minutes));
  const h = Math.floor(m / 60);
  return h ? `${h}h${m % 60 ? ` ${m % 60}m` : ''}` : `${m}m`;
};

export const formatClock = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
};

export const timeAgo = (iso, now = Date.now()) => {
  const mins = Math.floor((now - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

export const pluralDays = (n) => `${n} day${n === 1 ? '' : 's'}`;

// Returns true for Saturday (6) or Sunday (0)
export const isWeekendDate = (key) => {
  const dow = fromDateKey(key).getDay();
  return dow === 0 || dow === 6;
};

// First calendar date >= fromKey whose type matches planType ('weekday' | 'weekend').
// Advances at most 7 days (guaranteed to find one in any week).
export const nextDateOfType = (fromKey, planType) => {
  let d = fromKey;
  for (let i = 0; i < 8; i++) {
    if ((planType === 'weekend') === isWeekendDate(d)) return d;
    d = addDays(d, 1);
  }
  return fromKey; // unreachable
};
