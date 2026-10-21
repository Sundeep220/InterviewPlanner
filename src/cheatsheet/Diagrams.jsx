// src/cheatsheet/Diagrams.jsx
// Visual diagram components for the PrepForge Java DSA Cheat Sheet
// Each component is self-contained and uses only Tailwind + inline SVG.

// ─── Shared primitives ────────────────────────────────────────────────────────

function DiagramWrap({ title, children, note }) {
  return (
    <div className="my-3 rounded-xl border border-[#21262d] overflow-hidden">
      {title && (
        <div className="bg-[#0d1117] px-4 py-2 border-b border-[#21262d] flex items-center gap-2">
          <span className="text-gray-500">📊</span>
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-gray-500">{title}</p>
        </div>
      )}
      <div className="bg-[#010409] px-4 py-4 flex flex-col items-center gap-2">
        {children}
        {note && (
          <p className="text-[11px] text-gray-600 italic text-center self-stretch">{note}</p>
        )}
      </div>
    </div>
  );
}

/** Single array cell */
function AC({ v, hi = false, active = false, dim = false, warn = false, sm = false }) {
  const base = sm ? 'w-7 h-7 text-[11px]' : 'w-9 h-9 text-[13px]';
  const color = hi      ? 'bg-blue-500/20 border-blue-400 text-blue-200'
              : active  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
              : warn    ? 'bg-red-500/20 border-red-400 text-red-300'
              : dim     ? 'bg-transparent border-gray-700/30 text-gray-700'
              :           'bg-gray-800/60 border-[#374151] text-gray-300';
  return (
    <div className={`${base} ${color} flex items-center justify-center font-mono font-semibold rounded border flex-shrink-0`}>
      {v}
    </div>
  );
}

// ─── 1. Big-O Growth Chart ────────────────────────────────────────────────────

export function BigOChart() {
  const W = 500, H = 230;
  const P = { l: 32, r: 120, t: 18, b: 32 };
  const pw = W - P.l - P.r;
  const ph = H - P.t - P.b;
  const N = 12;       // x-axis: n = 1..12
  const Y_MAX = 250;  // display ceiling

  // Visual scale factors — curves are illustrative, not true values.
  // They are chosen so all 6 curves are clearly visible and in the right order.
  const curves = [
    { label: 'O(1)',       fn: ()  => 4,                                   color: '#10b981' },
    { label: 'O(log n)',   fn: n   => 4.5 * Math.log2(Math.max(n, 1)),    color: '#3b82f6' },
    { label: 'O(n)',       fn: n   => 5   * n,                              color: '#8b5cf6' },
    { label: 'O(n log n)', fn: n   => 3.6 * n * Math.log2(Math.max(n,1)), color: '#f59e0b' },
    { label: 'O(n²)',      fn: n   => 2.3 * n * n,                         color: '#ef4444' },
    { label: 'O(2ⁿ)',      fn: n   => 0.85 * Math.pow(2, n),               color: '#ec4899' },
  ];

  const tx = n  => P.l + ((n - 1) / (N - 1)) * pw;
  const ty = v  => P.t + ph * (1 - Math.min(Math.max(v, 0), Y_MAX) / Y_MAX);

  return (
    <DiagramWrap
      title="Big-O Growth Rates — illustrative scale"
      note="O(2ⁿ) shoots off the chart by n=9. Even O(n²) becomes painful at n=10⁴. Always check Part 2 table before coding."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxWidth: W }}>
        {/* Grid */}
        {[0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} x1={P.l} y1={ty(Y_MAX * f)} x2={W - P.r} y2={ty(Y_MAX * f)}
            stroke="#1f2937" strokeWidth="1" strokeDasharray="4 5" />
        ))}
        {[3, 5, 7, 9, 11].map(n => (
          <line key={n} x1={tx(n)} y1={P.t} x2={tx(n)} y2={H - P.b}
            stroke="#1f2937" strokeWidth="1" strokeDasharray="4 5" />
        ))}
        {/* Axes */}
        <line x1={P.l} y1={P.t} x2={P.l} y2={H - P.b} stroke="#4b5563" strokeWidth="1.5" />
        <line x1={P.l} y1={H - P.b} x2={W - P.r} y2={H - P.b} stroke="#4b5563" strokeWidth="1.5" />
        {/* X labels */}
        {[1, 3, 5, 7, 9, 11].map(n => (
          <text key={n} x={tx(n)} y={H - P.b + 13} fill="#6b7280" fontSize="9" textAnchor="middle">{n}</text>
        ))}
        <text x={P.l + pw / 2} y={H - 1} fill="#6b7280" fontSize="9" textAnchor="middle">n →</text>
        <text fill="#6b7280" fontSize="9" textAnchor="middle"
          transform={`translate(10, ${P.t + ph / 2}) rotate(-90)`}>ops ↑</text>

        {/* Curves */}
        {curves.map(({ label, fn, color }) => {
          const pts = [];
          for (let n = 1; n <= N; n++) {
            const v = fn(n);
            if (v > Y_MAX * 1.08) break;
            pts.push(`${tx(n).toFixed(1)},${ty(v).toFixed(1)}`);
          }
          return pts.length >= 2 && (
            <polyline key={label} points={pts.join(' ')}
              fill="none" stroke={color} strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" />
          );
        })}

        {/* Right-side legend */}
        {curves.map(({ label, fn, color }, i) => {
          const legendY = P.t + 10 + i * 22;
          const lx = W - P.r + 12;
          return (
            <g key={label}>
              <line x1={lx} y1={legendY + 4} x2={lx + 14} y2={legendY + 4} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
              <text x={lx + 18} y={legendY + 8} fill={color} fontSize="10"
                fontFamily="'JetBrains Mono','Fira Code',ui-monospace,monospace">{label}</text>
            </g>
          );
        })}
      </svg>
    </DiagramWrap>
  );
}

// ─── 2. Two Pointers ──────────────────────────────────────────────────────────

export function TwoPointersDiagram() {
  const arr = [1, 3, 5, 6, 8, 9, 11];
  const target = 14;
  // State shown: L=1 (3), R=5 (9) → 3+9=12 < 14 → move L right
  const L = 1, R = 5;
  const sum = arr[L] + arr[R];

  return (
    <DiagramWrap
      title={`Two Pointers — pair-sum on sorted array, target = ${target}`}
      note="Each pointer moves at most n steps total → O(n) despite looking like O(n²)."
    >
      <div className="flex gap-1 mb-1">
        {arr.map((v, i) => (
          <AC key={i} v={v} hi={i === L} active={i === R} />
        ))}
      </div>
      {/* Pointer arrows */}
      <div className="flex gap-1">
        {arr.map((_, i) => (
          <div key={i} className="w-9 text-center text-[11px] font-mono font-bold">
            {i === L ? <span className="text-blue-400">L</span>
           : i === R ? <span className="text-emerald-400">R</span>
           : null}
          </div>
        ))}
      </div>
      <div className="font-mono text-[12.5px] text-gray-300 mt-1 space-y-0.5 self-start">
        <div>arr[L] + arr[R] = {arr[L]} + {arr[R]} = <span className="text-white font-bold">{sum}</span></div>
        <div className="text-amber-400">
          {sum < target ? `${sum} < ${target}  →  L++  (need a larger left value)` :
           sum > target ? `${sum} > ${target}  →  R--  (sum too large)` :
           `${sum} = ${target}  →  ✓ found!`}
        </div>
      </div>
    </DiagramWrap>
  );
}

// ─── 3. Sliding Window ────────────────────────────────────────────────────────

export function SlidingWindowDiagram() {
  const arr = [4, 2, 1, 7, 8, 1, 2, 8, 1, 0];
  const k = 3;
  const windows = [
    { s: 0 },
    { s: 2 },
    { s: 4 },
    { s: 7 },
  ];

  return (
    <DiagramWrap
      title={`Sliding Window — max sum subarray of fixed size k = ${k}`}
      note="Add rightmost element, remove leftmost → each slide costs O(1) → O(n) total vs O(nk) brute force."
    >
      <div className="space-y-2.5 w-full">
        {windows.map(({ s }, wi) => {
          const sum = arr.slice(s, s + k).reduce((a, b) => a + b, 0);
          const isMax = sum === 16;
          return (
            <div key={wi} className="flex items-center gap-2.5">
              <span className="text-[10px] text-gray-600 w-4 text-right flex-shrink-0">{wi + 1}.</span>
              <div className="flex gap-1">
                {arr.map((v, i) => (
                  <AC key={i} v={v}
                    hi={i >= s && i < s + k}
                    dim={i < s || i >= s + k}
                    sm
                  />
                ))}
              </div>
              <span className="font-mono text-[11px] text-gray-400 flex-shrink-0">
                sum = <span className={isMax ? 'text-emerald-400 font-bold' : 'text-gray-300'}>{sum}</span>
                {isMax && <span className="text-emerald-500 ml-1">← max</span>}
              </span>
            </div>
          );
        })}
      </div>
    </DiagramWrap>
  );
}

// ─── 4. Prefix Sum ────────────────────────────────────────────────────────────

export function PrefixSumDiagram() {
  const arr = [3, 1, 4, 1, 5, 9, 2, 6];
  const prefix = [0, ...arr];
  for (let i = 1; i < prefix.length; i++) prefix[i] += prefix[i - 1];
  // prefix = [0, 3, 4, 8, 9, 14, 23, 25, 31]

  const l = 2, r = 5; // query: sum from index l to r
  const ans = prefix[r + 1] - prefix[l];

  return (
    <DiagramWrap
      title="Prefix Sum — any range sum in O(1) after O(n) build"
      note={`sum(${l}, ${r}) = prefix[${r + 1}] − prefix[${l}] = ${prefix[r+1]} − ${prefix[l]} = ${ans}`}
    >
      <div className="w-full space-y-1.5 font-mono text-[12px]">
        {/* arr row */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500 w-14 text-right text-[10.5px]">arr</span>
          <div className="flex gap-1">
            {arr.map((v, i) => <AC key={i} v={v} hi={i >= l && i <= r} sm />)}
          </div>
          <span className="text-[10px] text-gray-600">index 0…{arr.length - 1}</span>
        </div>
        {/* prefix row */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500 w-14 text-right text-[10.5px]">prefix</span>
          <div className="flex gap-1">
            {prefix.map((v, i) => (
              <AC key={i} v={v}
                active={i === l || i === r + 1}
                dim={i !== l && i !== r + 1}
                sm
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-600">index 0…{prefix.length - 1}</span>
        </div>
        {/* formula */}
        <div className="pl-16 pt-1 text-[12px] space-y-0.5">
          <div className="text-gray-400">
            sum(<span className="text-blue-300">{l}</span>, <span className="text-blue-300">{r}</span>) = prefix[<span className="text-emerald-300">{r + 1}</span>] − prefix[<span className="text-emerald-300">{l}</span>]
            = {prefix[r + 1]} − {prefix[l]} = <span className="text-white font-bold">{ans}</span>
          </div>
        </div>
      </div>
    </DiagramWrap>
  );
}

// ─── 5. Binary Search Halving ─────────────────────────────────────────────────

export function BinarySearchDiagram() {
  const arr = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91, 99, 103, 120, 145, 160];
  const target = 56;

  // Simulate
  const steps = [];
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    steps.push({ lo, mid, hi, val: arr[mid] });
    if (arr[mid] === target) break;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }

  const colors = ['border-violet-400/70 bg-violet-500/10 text-violet-300',
                   'border-amber-400/70 bg-amber-500/10 text-amber-300',
                   'border-sky-400/70 bg-sky-500/10 text-sky-300',
                   'border-emerald-400/70 bg-emerald-500/10 text-emerald-300'];

  return (
    <DiagramWrap
      title={`Binary Search — finding ${target} in ${arr.length} elements`}
      note={`Search space halves each step: 16 → 8 → 4 → 2 → ... = log₂(${arr.length}) = ${steps.length} steps`}
    >
      <div className="space-y-3 w-full">
        {steps.map(({ lo, mid, hi, val }, si) => (
          <div key={si} className="space-y-1">
            <div className="text-[10px] text-gray-500 font-mono">
              Step {si + 1}: lo={lo} hi={hi} mid={mid} → arr[{mid}]={val}
              <span className="text-amber-400 ml-2">
                {val < target ? `< ${target} → lo = ${mid + 1}` :
                 val > target ? `> ${target} → hi = ${mid - 1}` : `= ${target} ✓ found`}
              </span>
            </div>
            <div className="flex gap-0.5 flex-wrap">
              {arr.map((v, i) => {
                const inRange = i >= lo && i <= hi;
                const isMid   = i === mid;
                return (
                  <div key={i}
                    className={`w-7 h-7 flex items-center justify-center text-[10px] font-mono rounded border transition-colors
                      ${isMid   ? colors[si] :
                        inRange ? 'bg-gray-800/50 border-[#374151] text-gray-400' :
                                  'bg-transparent border-transparent text-gray-700/40'}`}
                  >
                    {inRange || isMid ? v : '·'}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </DiagramWrap>
  );
}

// ─── 6. Monotonic Stack ───────────────────────────────────────────────────────

export function MonotonicStackDiagram() {
  const arr = [3, 1, 4, 1, 5, 9, 2, 6];
  // Next Greater Element
  const nge = new Array(arr.length).fill(-1);
  const stk = [];
  for (let i = 0; i < arr.length; i++) {
    while (stk.length && arr[stk[stk.length - 1]] < arr[i]) {
      nge[stk.pop()] = arr[i];
    }
    stk.push(i);
  }

  return (
    <DiagramWrap
      title="Monotonic Stack — Next Greater Element for each value"
      note="Each element is pushed once and popped at most once → O(n) total across all loop iterations (amortized O(1) per element)."
    >
      <div className="w-full space-y-2 font-mono text-[12px]">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-[10.5px] w-20 text-right flex-shrink-0">input</span>
          <div className="flex gap-1">{arr.map((v, i) => <AC key={i} v={v} sm />)}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-[10.5px] w-20 text-right flex-shrink-0">next&nbsp;greater</span>
          <div className="flex gap-1">
            {nge.map((v, i) => <AC key={i} v={v === -1 ? '−' : v} active={v !== -1} dim={v === -1} sm />)}
          </div>
        </div>
        <div className="pl-[88px] text-[11px] text-gray-500 space-y-0.5 mt-1">
          <div>• arr[5]=9 pops 1, 4, 1, 3 → their next-greater is 9</div>
          <div>• arr[7]=6 pops 2 → next-greater of 2 is 6</div>
          <div>• Remaining in stack (9, 6) have no next-greater → <span className="text-white">-1</span></div>
        </div>
      </div>
    </DiagramWrap>
  );
}

// ─── 7. Stack & Queue ─────────────────────────────────────────────────────────

export function StackQueueDiagram() {
  const stackItems  = ['D  ← top (push/pop)', 'C', 'B', 'A  ← bottom'];
  const queueItems  = ['A  ← head (poll)', 'B', 'C', 'D  ← tail (offer)'];

  return (
    <DiagramWrap title="Stack (LIFO) vs Queue (FIFO) — both use ArrayDeque">
      <div className="flex gap-8 justify-center flex-wrap w-full">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[11px] text-blue-400 font-semibold">Stack — LIFO</span>
          <span className="text-[10px] text-amber-400 font-mono">stack.push(x)  stack.pop()</span>
          {stackItems.map((item, i) => (
            <div key={i}
              className={`w-52 px-3 py-1.5 rounded border font-mono text-[11.5px]
                ${i === 0 ? 'bg-blue-500/15 border-blue-500/40 text-blue-300' :
                  'bg-gray-800/50 border-[#374151] text-gray-400'}`}
            >{item}</div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[11px] text-emerald-400 font-semibold">Queue — FIFO</span>
          <span className="text-[10px] text-amber-400 font-mono">queue.offer(x)  queue.poll()</span>
          {queueItems.map((item, i) => (
            <div key={i}
              className={`w-52 px-3 py-1.5 rounded border font-mono text-[11.5px]
                ${i === 0 ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' :
                  i === queueItems.length - 1 ? 'bg-violet-500/15 border-violet-500/40 text-violet-300' :
                  'bg-gray-800/50 border-[#374151] text-gray-400'}`}
            >{item}</div>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-gray-600 italic text-center mt-1">
        Never use <code className="text-sky-300">Stack</code> (synchronized, slow) or <code className="text-sky-300">LinkedList</code> for queues — always prefer <code className="text-sky-300">ArrayDeque</code>.
      </p>
    </DiagramWrap>
  );
}

// ─── 8. Sieve of Eratosthenes Grid ────────────────────────────────────────────

export function SieveDiagram() {
  const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]);
  const nums   = Array.from({ length: 30 }, (_, i) => i + 2); // 2..31

  return (
    <DiagramWrap
      title="Sieve of Eratosthenes — primes up to 31"
      note="Start marking from p² because smaller multiples (2p, 3p, …) are already crossed off by smaller primes."
    >
      <div className="flex flex-wrap gap-1.5 justify-center" style={{ maxWidth: 310 }}>
        {nums.map(n => (
          <div key={n}
            className={`w-9 h-9 flex items-center justify-center text-[13px] font-mono font-semibold rounded border
              ${primes.has(n)
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-200'
                : 'bg-gray-800/20 border-gray-700/25 text-gray-600 line-through decoration-red-500/60 decoration-1'}`}
          >{n}</div>
        ))}
      </div>
      <div className="flex gap-5 mt-2 text-[11px]">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/50 flex-shrink-0" />
          <span className="text-blue-400">Prime</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-gray-800/20 border border-gray-700/25 flex-shrink-0" />
          <span className="text-gray-500 line-through decoration-red-500/60">Composite</span>
        </span>
      </div>
    </DiagramWrap>
  );
}

// ─── 9. Fast Power Bit Trace ──────────────────────────────────────────────────

export function FastPowerDiagram() {
  // 3^13, 13 = 1101₂  (bits LSB→MSB: 1, 0, 1, 1)
  const BASE = 3, EXP = 13;
  const rows = [];
  let result = 1, base = BASE, exp = EXP;
  while (exp > 0) {
    const bit = exp & 1;
    const rBefore = result;
    const bBefore  = base;
    if (bit) result = result * base;
    base  = base * base;
    exp >>= 1;
    rows.push({ bit, base: bBefore, rBefore, multiply: !!bit, rAfter: result });
  }

  return (
    <DiagramWrap
      title={`Fast Power — ${BASE}^${EXP} via binary exponentiation (${EXP} = 1101₂)`}
      note={`4 squarings + 3 multiplications = 7 ops total vs ${EXP - 1} ops for naive repeated multiplication.`}
    >
      <div className="w-full overflow-x-auto">
        <table className="text-[12px] font-mono w-full min-w-[400px]">
          <thead>
            <tr className="border-b border-[#21262d] text-[10px] text-gray-500">
              <th className="text-left py-1.5 px-2 font-semibold">Bit</th>
              <th className="text-left py-1.5 px-2 font-semibold">base</th>
              <th className="text-left py-1.5 px-2 font-semibold">result (before)</th>
              <th className="text-left py-1.5 px-2 font-semibold">action</th>
              <th className="text-left py-1.5 px-2 font-semibold">result (after)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}
                className={`border-b border-[#21262d]/60 ${r.multiply ? 'bg-emerald-950/25' : ''}`}
              >
                <td className="py-1.5 px-2">
                  <span className={r.multiply ? 'text-emerald-400 font-bold' : 'text-gray-600'}>{r.bit}</span>
                </td>
                <td className="py-1.5 px-2 text-blue-300">{r.base}</td>
                <td className="py-1.5 px-2 text-gray-300">{r.rBefore}</td>
                <td className="py-1.5 px-2 text-[11px]">
                  {r.multiply
                    ? <span className="text-emerald-400">multiply: {r.rBefore} × {r.base} = {r.rAfter}</span>
                    : <span className="text-gray-600">skip  (bit = 0)</span>}
                </td>
                <td className={`py-1.5 px-2 font-bold ${r.multiply ? 'text-amber-300' : 'text-gray-500'}`}>{r.rAfter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-gray-500 font-mono self-start mt-1">
        Final result: 3^13 = {Math.pow(3, 13).toLocaleString()} ✓
      </p>
    </DiagramWrap>
  );
}

// ─── 10. Pascal's Triangle ────────────────────────────────────────────────────

export function PascalTriangle() {
  const ROWS = 8;
  const tri  = [[1]];
  for (let i = 1; i < ROWS; i++) {
    const prev = tri[i - 1];
    const row  = [1];
    for (let j = 1; j < i; j++) row.push(prev[j - 1] + prev[j]);
    row.push(1);
    tri.push(row);
  }

  return (
    <DiagramWrap
      title="Pascal's Triangle — row n gives C(n,0) C(n,1) … C(n,n)"
      note="Each cell = sum of the two directly above it: C(n,r) = C(n-1,r-1) + C(n-1,r)."
    >
      <div className="space-y-1">
        {tri.map((row, i) => (
          <div key={i} className="flex items-center gap-1 justify-center">
            <span className="text-[9px] text-gray-600 font-mono w-8 text-right mr-1 flex-shrink-0">n={i}</span>
            {row.map((v, j) => (
              <div key={j}
                className={`flex items-center justify-center font-mono font-semibold rounded border
                  ${i <= 2 ? 'w-9 h-7 text-[12px]' : 'w-9 h-7 text-[11px]'}
                  ${j === 0 || j === i
                    ? 'bg-violet-500/15 border-violet-500/35 text-violet-300'
                    : v > 20
                    ? 'bg-blue-500/12 border-blue-500/25 text-blue-200'
                    : 'bg-blue-500/8 border-blue-500/20 text-blue-300'}`}
              >{v}</div>
            ))}
          </div>
        ))}
      </div>
      <div className="text-[11px] text-gray-500 font-mono text-center mt-2">
        C(7, 3) = <span className="text-white">35</span> (row 7, position 3)
        &nbsp;·&nbsp; Border values are always <span className="text-violet-300">1</span>
      </div>
    </DiagramWrap>
  );
}

// ─── 11. Fibonacci Recursion Tree ─────────────────────────────────────────────

export function FibTreeDiagram() {
  // fib(5) tree — manually positioned for clear non-overlapping layout
  const W = 500, H = 260;

  // Each node: { id, label, x, y, dup }
  const nodes = [
    { id: 'n5',   label: 'fib(5)', x: 250, y: 18,  dup: false },
    { id: 'n4',   label: 'fib(4)', x: 130, y: 68,  dup: false },
    { id: 'n3a',  label: 'fib(3)', x: 370, y: 68,  dup: true  },
    { id: 'n3b',  label: 'fib(3)', x:  65, y: 122, dup: true  },
    { id: 'n2a',  label: 'fib(2)', x: 195, y: 122, dup: true  },
    { id: 'n2b',  label: 'fib(2)', x: 315, y: 122, dup: true  },
    { id: 'n1a',  label: 'fib(1)', x: 425, y: 122, dup: false },
    { id: 'n2c',  label: 'fib(2)', x:  30, y: 176, dup: true  },
    { id: 'n1b',  label: 'fib(1)', x: 100, y: 176, dup: false },
    { id: 'n1c',  label: 'fib(1)', x: 165, y: 176, dup: false },
    { id: 'n0a',  label: 'fib(0)', x: 225, y: 176, dup: false },
    { id: 'n1d',  label: 'fib(1)', x: 285, y: 176, dup: false },
    { id: 'n0b',  label: 'fib(0)', x: 345, y: 176, dup: false },
    { id: 'n1e',  label: 'fib(1)', x:  10, y: 228, dup: false },
    { id: 'n0c',  label: 'fib(0)', x:  52, y: 228, dup: false },
  ];

  const edges = [
    ['n5','n4'],['n5','n3a'],
    ['n4','n3b'],['n4','n2a'],
    ['n3a','n2b'],['n3a','n1a'],
    ['n3b','n2c'],['n3b','n1b'],
    ['n2a','n1c'],['n2a','n0a'],
    ['n2b','n1d'],['n2b','n0b'],
    ['n2c','n1e'],['n2c','n0c'],
  ];

  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
  const NW = 52, NH = 20;

  return (
    <DiagramWrap
      title="Fibonacci Recursion Tree — fib(5), duplicated sub-trees in red"
      note="fib(2) is computed 3× and fib(3) 2× — total calls ≈ 2ⁿ. Memoize or use iterative to avoid this."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxWidth: W }}>
        {/* Edges */}
        {edges.map(([a, b]) => {
          const A = byId[a], B = byId[b];
          return (
            <line key={`${a}-${b}`}
              x1={A.x} y1={A.y + NH / 2}
              x2={B.x} y2={B.y - NH / 2}
              stroke="#374151" strokeWidth="1" />
          );
        })}
        {/* Nodes */}
        {nodes.map(n => (
          <g key={n.id} transform={`translate(${n.x - NW / 2}, ${n.y - NH / 2})`}>
            <rect width={NW} height={NH} rx={4}
              fill={n.dup ? '#450a0a' : '#0f2744'}
              stroke={n.dup ? '#ef4444' : '#3b82f6'}
              strokeWidth={n.dup ? 1.2 : 0.8}
            />
            <text x={NW / 2} y={13}
              fill={n.dup ? '#fca5a5' : '#93c5fd'}
              fontSize="9" textAnchor="middle"
              fontFamily="'JetBrains Mono',ui-monospace,monospace"
            >{n.label}</text>
          </g>
        ))}
      </svg>
      <div className="flex gap-5 text-[11px] self-start">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-950 border border-red-500 flex-shrink-0" />
          <span className="text-red-400">Recomputed (wasted work)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-950 border border-blue-500 flex-shrink-0" />
          <span className="text-blue-400">Unique node</span>
        </span>
      </div>
    </DiagramWrap>
  );
}

// ─── 12. Master Theorem Splitting Tree ────────────────────────────────────────
// Shows T(n) = 2T(n/2) + O(n) — Merge Sort — Case 2

export function MasterThmTree() {
  const W = 480, H = 240;
  const TREE_RIGHT = 295; // right edge of the tree area
  const LABEL_X    = 310; // start of work-per-level labels

  // Level descriptions
  const levels = [
    { label: 'T(n)',   count: 1, subLabel: 'n/2',  work: 'O(n)',         y: 22 },
    { label: 'T(n/2)', count: 2, subLabel: 'n/4',  work: '2 × O(n/2) = O(n)', y: 82 },
    { label: 'T(n/4)', count: 4, subLabel: '…',    work: '4 × O(n/4) = O(n)', y: 142 },
    { label: 'T(1)',   count: 'n', subLabel: null, work: 'n × O(1)  =  O(n)', y: 198 },
  ];

  const boxW = 56, boxH = 22, gap = 6;
  const totalW3 = 4 * (boxW + gap) - gap; // 4 nodes at level 2
  const cx3 = (TREE_RIGHT - totalW3) / 2;

  return (
    <DiagramWrap title="Master Theorem — T(n) = 2T(n/2) + O(n)  [Merge Sort, Case 2]">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxWidth: W }}>
        {/* Level index labels */}
        {levels.map(({ y }, li) => (
          <text key={li} x={4} y={y + 14} fill="#6b7280" fontSize="8.5" fontFamily="ui-monospace">L{li}</text>
        ))}

        {/* ── Level 0 — one node ── */}
        {(() => {
          const cx = TREE_RIGHT / 2;
          const y = levels[0].y;
          return (
            <>
              <rect x={cx - boxW/2} y={y} width={boxW} height={boxH} rx={3}
                fill="#0f2744" stroke="#3b82f6" strokeWidth="0.8" />
              <text x={cx} y={y + 14} fill="#93c5fd" fontSize="9" textAnchor="middle" fontFamily="ui-monospace">{levels[0].label}</text>
              {/* edges to L1 */}
              {[-1, 1].map(side => {
                const cx1 = TREE_RIGHT / 2 + side * (boxW / 2 + 18);
                return <line key={side} x1={cx} y1={y + boxH} x2={cx1} y2={levels[1].y} stroke="#374151" strokeWidth="1" />;
              })}
            </>
          );
        })()}

        {/* ── Level 1 — two nodes ── */}
        {(() => {
          const spacing = boxW + 18;
          const cx = TREE_RIGHT / 2;
          const y = levels[1].y;
          return [-1, 1].map(side => {
            const nx = cx + side * spacing;
            const cx2a = nx - spacing * 0.7;
            const cx2b = nx + spacing * 0.7;
            return (
              <g key={side}>
                <rect x={nx - boxW/2} y={y} width={boxW} height={boxH} rx={3}
                  fill="#0f2744" stroke="#3b82f6" strokeWidth="0.8" />
                <text x={nx} y={y + 14} fill="#93c5fd" fontSize="9" textAnchor="middle" fontFamily="ui-monospace">{levels[1].label}</text>
                {[cx2a, cx2b].map((cx2, i) => (
                  <line key={i} x1={nx} y1={y + boxH} x2={cx2} y2={levels[2].y} stroke="#374151" strokeWidth="1" />
                ))}
              </g>
            );
          });
        })()}

        {/* ── Level 2 — four nodes ── */}
        {(() => {
          const y = levels[2].y;
          return Array.from({ length: 4 }, (_, ni) => {
            const nx = cx3 + ni * (boxW + gap) + boxW / 2;
            return (
              <g key={ni}>
                <rect x={nx - boxW/2} y={y} width={boxW} height={boxH} rx={3}
                  fill="#0f2744" stroke="#3b82f6" strokeWidth="0.8" />
                <text x={nx} y={y + 14} fill="#93c5fd" fontSize="9" textAnchor="middle" fontFamily="ui-monospace">{levels[2].label}</text>
              </g>
            );
          });
        })()}

        {/* ── Level 3 — n leaves placeholder ── */}
        {(() => {
          const y = levels[3].y;
          return (
            <text x={20} y={y + 14} fill="#6b7280" fontSize="9" fontFamily="ui-monospace">n leaves (T(1)) ···</text>
          );
        })()}

        {/* ── Right: work per level ── */}
        {levels.map(({ work, y }, li) => (
          <g key={li}>
            <line x1={TREE_RIGHT + 4} y1={y + boxH / 2} x2={LABEL_X - 4} y2={y + boxH / 2}
              stroke="#374151" strokeWidth="0.8" strokeDasharray="3 3" />
            <rect x={LABEL_X} y={y} width={160} height={boxH} rx={3}
              fill={li === 3 ? '#052e16' : '#2e1065'}
              stroke={li === 3 ? '#22c55e' : '#7c3aed'} strokeWidth="0.8" />
            <text x={LABEL_X + 6} y={y + 14} fill={li === 3 ? '#86efac' : '#c4b5fd'}
              fontSize="8.5" fontFamily="ui-monospace">{work}</text>
          </g>
        ))}

        {/* ── log n levels arrow ── */}
        <line x1={285} y1={22} x2={285} y2={210} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#arr)" />
        <text x={289} y={120} fill="#f59e0b" fontSize="8.5" fontFamily="ui-monospace">log n</text>
        <text x={289} y={131} fill="#f59e0b" fontSize="8.5" fontFamily="ui-monospace">levels</text>

        {/* ── Total ── */}
        <text x={W / 2 + 10} y={H - 4} fill="#10b981" fontSize="10.5"
          textAnchor="middle" fontFamily="'JetBrains Mono',ui-monospace,monospace">
          Total = O(n) per level × log n levels = O(n log n)
        </text>
      </svg>
    </DiagramWrap>
  );
}

// ─── SOLID diagram helpers ────────────────────────────────────────────────────

const SOLID_TONES = {
  blue:  'bg-blue-500/15 border-blue-500/40 text-blue-200',
  red:   'bg-red-500/15 border-red-500/40 text-red-200',
  green: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200',
  amber: 'bg-amber-500/15 border-amber-500/40 text-amber-200',
  gray:  'bg-gray-800/60 border-[#374151] text-gray-300',
};

function DNode({ children, tone = 'blue', wide = false }) {
  return (
    <div className={`px-3 py-2 rounded-lg border font-mono text-[11px] text-center leading-snug ${wide ? 'w-full' : ''} ${SOLID_TONES[tone]}`}>
      {children}
    </div>
  );
}

function DArrow({ label }) {
  return (
    <div className="flex flex-col items-center text-[10px] text-gray-500 font-mono leading-tight">
      <span>│</span>
      {label && <span className="text-gray-400 whitespace-nowrap">{label}</span>}
      <span>▼</span>
    </div>
  );
}

function SolidColumn({ tone, heading, children }) {
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <span className={`text-[10px] font-bold uppercase tracking-wider ${tone === 'red' ? 'text-red-400' : 'text-emerald-400'}`}>{heading}</span>
      {children}
    </div>
  );
}

// ─── 14. SOLID — Single Responsibility ────────────────────────────────────────

export function SolidSrpDiagram() {
  return (
    <DiagramWrap
      title="SRP — one class, many reasons to change → split by responsibility"
      note="Ask: 'Who would ask me to change this class?' If the answer is more than one person or team, it has more than one responsibility."
    >
      <div className="grid md:grid-cols-2 gap-6 w-full">
        <SolidColumn tone="red" heading="✗ Violates SRP">
          <DNode tone="red" wide>ReportService</DNode>
          <div className="text-[10.5px] text-gray-500 font-mono text-center">format() · save() · email()</div>
          <div className="text-[10.5px] text-red-300 font-mono text-center">changes for: layout, DB schema, SMTP config</div>
        </SolidColumn>
        <SolidColumn tone="green" heading="✓ Follows SRP">
          <DNode tone="green" wide>ReportService (orchestrates only)</DNode>
          <DArrow />
          <div className="grid grid-cols-3 gap-2 w-full">
            <DNode>ReportFormatter</DNode>
            <DNode>ReportRepository</DNode>
            <DNode>ReportMailer</DNode>
          </div>
        </SolidColumn>
      </div>
    </DiagramWrap>
  );
}

// ─── 15. SOLID — Open/Closed ──────────────────────────────────────────────────

export function SolidOcpDiagram() {
  return (
    <DiagramWrap
      title="OCP — add behaviour by adding a class, not by editing an if/else chain"
      note="DiscountCalculator never changes again. A new discount type is a new class that implements the existing interface."
    >
      <div className="flex flex-col items-center gap-1 w-full">
        <DNode tone="green" wide>DiscountCalculator  (closed: never edited)</DNode>
        <DArrow label="depends on" />
        <DNode tone="amber" wide>«interface» DiscountPolicy  →  double apply(double price)</DNode>
        <DArrow label="implemented by" />
        <div className="grid grid-cols-3 gap-2 w-full">
          <DNode>RegularDiscount</DNode>
          <DNode>PremiumDiscount</DNode>
          <DNode tone="green">SeasonalDiscount  ← new, zero edits</DNode>
        </div>
      </div>
    </DiagramWrap>
  );
}

// ─── 16. SOLID — Liskov Substitution ──────────────────────────────────────────

export function SolidLspDiagram() {
  return (
    <DiagramWrap
      title="LSP — a subtype must honour the behavioural contract of its base type"
      note="If code that works with a Rectangle breaks when handed a Square, the inheritance is wrong — even though 'a square is a rectangle' in maths."
    >
      <div className="grid md:grid-cols-2 gap-6 w-full">
        <SolidColumn tone="red" heading="✗ Square extends Rectangle">
          <DNode tone="gray" wide>Rectangle: setWidth(w), setHeight(h)</DNode>
          <DArrow label="extends" />
          <DNode tone="red" wide>Square: setWidth also sets height</DNode>
          <div className="text-[10.5px] text-red-300 font-mono text-center leading-relaxed">
            r.setWidth(5); r.setHeight(4);<br/>area() → 16  (caller expected 20)
          </div>
        </SolidColumn>
        <SolidColumn tone="green" heading="✓ Shared abstraction">
          <DNode tone="gray" wide>«interface» Shape: int area()</DNode>
          <DArrow label="implemented by" />
          <div className="grid grid-cols-2 gap-2 w-full">
            <DNode>Rectangle(width, height)</DNode>
            <DNode>Square(side)</DNode>
          </div>
          <div className="text-[10.5px] text-emerald-300 font-mono text-center">Both honour area(); no hidden setter coupling</div>
        </SolidColumn>
      </div>
    </DiagramWrap>
  );
}

// ─── 17. SOLID — Interface Segregation ────────────────────────────────────────

export function SolidIspDiagram() {
  return (
    <DiagramWrap
      title="ISP — many small role interfaces beat one fat interface"
      note="If an implementer throws UnsupportedOperationException or leaves a method empty, the interface is too big."
    >
      <div className="grid md:grid-cols-2 gap-6 w-full">
        <SolidColumn tone="red" heading="✗ One fat interface">
          <DNode tone="red" wide>Worker: work() · eat() · sleep()</DNode>
          <DArrow label="implemented by" />
          <DNode tone="red" wide>Robot</DNode>
          <div className="text-[10.5px] text-red-300 font-mono text-center">eat() and sleep() must throw — forced to lie</div>
        </SolidColumn>
        <SolidColumn tone="green" heading="✓ Segregated roles">
          <div className="grid grid-cols-3 gap-2 w-full">
            <DNode>Workable</DNode>
            <DNode>Eatable</DNode>
            <DNode>Sleepable</DNode>
          </div>
          <DArrow label="Robot implements" />
          <DNode tone="green" wide>Robot → Workable only</DNode>
        </SolidColumn>
      </div>
    </DiagramWrap>
  );
}

// ─── 18. SOLID — Dependency Inversion ─────────────────────────────────────────

export function SolidDipDiagram() {
  return (
    <DiagramWrap
      title="DIP — depend on abstractions; inject the concrete implementation"
      note="OrderService can be unit-tested with a fake gateway, and switching payment providers touches no business logic."
    >
      <div className="grid md:grid-cols-2 gap-6 w-full">
        <SolidColumn tone="red" heading="✗ Concrete dependency">
          <DNode tone="red" wide>OrderService (high-level)</DNode>
          <DArrow label="new StripeGateway()" />
          <DNode tone="red" wide>StripeGateway (low-level)</DNode>
          <div className="text-[10.5px] text-red-300 font-mono text-center">business logic is tied to one vendor</div>
        </SolidColumn>
        <SolidColumn tone="green" heading="✓ Inverted via interface">
          <DNode tone="green" wide>OrderService (high-level)</DNode>
          <DArrow label="depends on" />
          <DNode tone="amber" wide>«interface» PaymentGateway</DNode>
          <DArrow label="implemented by" />
          <div className="grid grid-cols-2 gap-2 w-full">
            <DNode>StripeGateway</DNode>
            <DNode>PayPalGateway</DNode>
          </div>
        </SolidColumn>
      </div>
    </DiagramWrap>
  );
}

// ─── 19. Interview Tips — input method decision ───────────────────────────────

export function InputDecisionDiagram() {
  return (
    <DiagramWrap
      title="Which Java input reader should I use?"
      note="Rule of thumb: use the fastest reader that you can write without bugs under pressure. A FastReader template is worth memorising once."
    >
      <div className="flex flex-col items-center gap-1 w-full">
        <DNode tone="amber" wide>How many numbers / tokens will the input contain?</DNode>
        <DArrow label="small  (≤ ~10⁴)" />
        <DNode tone="green" wide>Scanner  —  simplest, mixed types, fine for small input</DNode>
        <div className="text-[10px] text-gray-500 font-mono">↓ larger  (10⁵ – 10⁶+)</div>
        <DNode tone="blue" wide>BufferedReader + StringTokenizer  (or FastReader wrapper)</DNode>
        <div className="text-[10px] text-gray-500 font-mono">↓ only numbers, no strings or lines, extreme speed needed</div>
        <DNode tone="gray" wide>StreamTokenizer  —  fastest for pure numeric input, awkward for text</DNode>
      </div>
    </DiagramWrap>
  );
}

// ─── 20. Interview Tips — seven-step flow ─────────────────────────────────────

export function InterviewFlowDiagram() {
  const steps = [
    ['1', 'Clarify',     'inputs, outputs, constraints, edge cases'],
    ['2', 'Examples',    'work one small case by hand'],
    ['3', 'Brute force', 'state a correct baseline and its complexity'],
    ['4', 'Optimise',    'find the bottleneck, pick a pattern from Part 3'],
    ['5', 'Code',        'think aloud, clear names, small helper methods'],
    ['6', 'Test',        'dry-run the examples and the edge cases'],
    ['7', 'Complexity',  'state time and space, mention trade-offs'],
  ];
  return (
    <DiagramWrap
      title="Interview flow — seven steps in roughly 45 minutes"
      note="Talking through each step matters as much as the final code. Interviewers grade the process, not just the answer."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
        {steps.map(([n, title, desc]) => (
          <div key={n} className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-2.5">
            <div className="text-[10px] font-mono text-gray-500">STEP {n}</div>
            <div className="text-[12px] font-semibold text-blue-200">{title}</div>
            <div className="text-[10.5px] text-gray-400 leading-snug">{desc}</div>
          </div>
        ))}
      </div>
    </DiagramWrap>
  );
}

// ─── 21. Catalan — root-split recurrence for n = 4 ────────────────────────────

const catalanVals = (N) => {
  const C = [1];
  for (let n = 1; n <= N; n++) {
    let s = 0;
    for (let i = 0; i < n; i++) s += C[i] * C[n - 1 - i];
    C.push(s);
  }
  return C;
};

export function CatalanRecurrenceDiagram() {
  const N = 4;
  const C = catalanVals(N);
  const splits = Array.from({ length: N }, (_, k) => ({
    root: k + 1, left: k, right: N - 1 - k, ways: C[k] * C[N - 1 - k],
  }));
  const total = splits.reduce((a, s) => a + s.ways, 0);

  return (
    <DiagramWrap
      title={`Recurrence: C(${N}) = Σ C(i) · C(${N - 1} − i) — split by the root`}
      note="Each choice of root splits the remaining nodes into a left group and a right group. The left and right shapes are chosen independently, so their counts multiply."
    >
      <div className="w-full space-y-1.5 font-mono text-[11.5px]">
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 text-[10px] text-gray-500 uppercase tracking-wider pb-1 border-b border-[#21262d]">
          <span>root</span><span>left · right</span><span className="text-right">ways</span>
        </div>
        {splits.map(s => (
          <div key={s.root} className="grid grid-cols-[auto_1fr_auto] gap-x-3 items-center">
            <span className="w-16 text-center rounded border border-blue-500/40 bg-blue-500/15 text-blue-200 py-0.5">k = {s.root}</span>
            <span className="flex items-center gap-2 text-gray-300">
              <span className="px-2 py-0.5 rounded border border-violet-500/40 bg-violet-500/10 text-violet-200">C({s.left}) = {C[s.left]}</span>
              <span className="text-gray-600">×</span>
              <span className="px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-200">C({s.right}) = {C[s.right]}</span>
            </span>
            <span className="text-right text-white">{s.ways}</span>
          </div>
        ))}
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 pt-2 border-t border-[#21262d] font-bold">
          <span className="text-gray-400">sum</span>
          <span className="text-gray-400">{splits.map(s => s.ways).join(' + ')}</span>
          <span className="text-right text-amber-300">= {total}</span>
        </div>
      </div>
    </DiagramWrap>
  );
}

// ─── 22. Catalan — values and closed form ─────────────────────────────────────

export function CatalanTableDiagram() {
  const N = 9;
  const C = catalanVals(N);
  const fact = (k) => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
  const maxV = C[N];

  return (
    <DiagramWrap
      title="Catalan values and the closed form  Cₙ = C(2n, n) / (n + 1)"
      note="The values grow roughly like 4ⁿ / n^1.5, so they explode quickly. Use long up to about n = 25, then switch to modular arithmetic."
    >
      <div className="w-full grid grid-cols-[auto_auto_1fr] gap-x-3 gap-y-1.5 items-center font-mono text-[11.5px]">
        <span className="text-[10px] text-gray-500 uppercase">n</span>
        <span className="text-[10px] text-gray-500 uppercase">Cₙ</span>
        <span className="text-[10px] text-gray-500 uppercase">size of Cₙ (relative)</span>
        {C.map((v, n) => (
          <div key={n} className="contents">
            <span className="text-gray-400 w-6 text-center">{n}</span>
            <span className="text-white font-semibold w-16 text-right pr-2">{v}</span>
            <span className="h-3 rounded-sm bg-gradient-to-r from-violet-600/70 to-blue-500/70"
              style={{ width: `${Math.max(2, (Math.log(v) / Math.log(maxV)) * 100)}%` }} />
          </div>
        ))}
      </div>
      <div className="w-full mt-2 rounded-lg border border-[#21262d] bg-[#0d1117] px-3 py-2 font-mono text-[11px] text-gray-300 space-y-0.5">
        <div>C(4) = (2·4)! / (4! · 5!) = {fact(8)} / ({fact(4)} · {fact(5)}) = <span className="text-amber-300">{fact(8) / (fact(4) * fact(5))}</span></div>
        <div className="text-gray-500">bar length is log-scaled so the small values stay visible</div>
      </div>
    </DiagramWrap>
  );
}

// ─── 23. Catalan — where they appear ──────────────────────────────────────────

export function CatalanApplicationsDiagram() {
  const C = catalanVals(10);
  const cards = [
    { title: 'Balanced brackets',   what: 'Valid sequences of n pairs', ex: 'n = 3 → ((())), (()()), (())(), ()(()), ()()()', val: C[3] },
    { title: 'Binary search trees', what: 'Distinct BST shapes with n keys', ex: 'n = 3 keys {1,2,3} → 5 different trees', val: C[3] },
    { title: 'Dyck paths',          what: 'Up/down paths that never dip below the start', ex: 'n = 3 → 5 paths from (0,0) to (6,0)', val: C[3] },
    { title: 'Triangulations',      what: 'Ways to cut a convex (n+2)-gon into triangles', ex: 'hexagon (n = 4) → 14 triangulations', val: C[4] },
    { title: 'Non-crossing pairs',  what: 'Pair up 2n points on a circle with no crossing chords', ex: '3 pairs of 6 points → 5 layouts', val: C[3] },
    { title: 'Stack-sortable',      what: 'Permutations of n that one stack can sort', ex: 'n = 3 → 5 of the 6 permutations', val: C[3] },
  ];
  return (
    <DiagramWrap
      title="Where Catalan numbers appear — same count, different disguises"
      note="When a problem asks for 'the number of valid / non-crossing / nested / binary-tree structures of size n', check whether the answer is Cₙ before deriving a new recurrence."
    >
      <div className="grid sm:grid-cols-2 gap-2 w-full">
        {cards.map(c => (
          <div key={c.title} className="rounded-lg border border-[#21262d] bg-[#0d1117] p-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-semibold text-gray-200">{c.title}</span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded border border-amber-500/40 bg-amber-500/10 text-amber-300">= {c.val}</span>
            </div>
            <div className="text-[11px] text-gray-400 leading-snug mt-0.5">{c.what}</div>
            <div className="text-[10.5px] font-mono text-gray-500 mt-1">{c.ex}</div>
          </div>
        ))}
      </div>
    </DiagramWrap>
  );
}

// ─── 13. Call Stack Diagram ───────────────────────────────────────────────────

export function CallStackDiagram() {
  // fib(n) recursive: depth = n frames
  const frames = [
    { fn: 'fib(5)', note: 'calls fib(4)' },
    { fn: 'fib(4)', note: 'calls fib(3)' },
    { fn: 'fib(3)', note: 'calls fib(2)' },
    { fn: 'fib(2)', note: 'calls fib(1)' },
    { fn: 'fib(1)', note: 'base case → 1', base: true },
  ];

  return (
    <DiagramWrap
      title="Call Stack — fib(n) recursive depth = n = O(n) space"
      note="Each active function call occupies a stack frame. Depth n → O(n) stack space. Iterative solution → O(1) space."
    >
      <div className="flex gap-8 items-start flex-wrap justify-center">
        {/* Stack visualization */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] text-amber-400 font-mono mb-1.5">← top of stack</span>
          {[...frames].reverse().map((f, i) => (
            <div key={i}
              className={`w-48 px-3 py-1.5 rounded border font-mono text-[12px]
                ${f.base
                  ? 'bg-emerald-950/50 border-emerald-600/50 text-emerald-300'
                  : 'bg-[#0d1117] border-[#374151] text-gray-300'}`}
            >
              <span className="font-bold">{f.fn}</span>
              <span className="text-[10px] text-gray-500 ml-2">{f.note}</span>
            </div>
          ))}
          <span className="text-[10px] text-gray-600 font-mono mt-1.5">↑ bottom of stack</span>
        </div>

        {/* Comparison */}
        <div className="text-[12px] font-mono space-y-3 pt-2">
          <div>
            <div className="text-[10px] text-gray-500 mb-1">RECURSIVE</div>
            <div className="text-gray-400">Depth = <span className="text-white">n</span></div>
            <div className="text-red-400">Space = O(n)</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 mb-1">ITERATIVE</div>
            <div className="text-gray-400">No recursion</div>
            <div className="text-emerald-400">Space = O(1)</div>
            <div className="text-[10px] text-gray-500 mt-1">long a=0, b=1;</div>
          </div>
          <div className="text-[10px] text-amber-400 leading-snug">
            Deep recursion can cause<br/>StackOverflowError for large n
          </div>
        </div>
      </div>
    </DiagramWrap>
  );
}
