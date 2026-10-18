import { useState, useEffect, useCallback } from 'react';

// ─── Base primitives ──────────────────────────────────────────────────────────

function CodeBlock({ code, label }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(code.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);
  return (
    <div className="relative group">
      {label && (
        <p className="text-[10.5px] font-bold uppercase tracking-wider text-gray-500 mb-1 mt-3">{label}</p>
      )}
      <div className="relative">
        <button
          onClick={copy}
          className={`absolute top-2 right-2 z-10 text-[11px] px-2 py-0.5 rounded border font-mono transition-all ${
            copied
              ? 'text-emerald-400 border-emerald-600/40 bg-emerald-950/50'
              : 'text-gray-600 border-gray-700/80 bg-gray-950 hover:text-gray-300 hover:border-gray-600'
          }`}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
        <pre
          className="bg-[#0d1117] border border-[#30363d] rounded-xl py-4 px-5 pr-16 overflow-x-auto text-[12.5px] leading-7 text-[#e6edf3]"
          style={{ fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',ui-monospace,monospace", tabSize: 4 }}
        >
          {code.trim()}
        </pre>
      </div>
    </div>
  );
}

function IC({ children }) {
  // Inline code — used inside theory/text content
  return (
    <code className="bg-gray-800/70 text-sky-300 text-[11.5px] px-1.5 py-0.5 rounded font-mono">
      {children}
    </code>
  );
}

function Mono({ children }) {
  return <code className="bg-gray-800/60 text-sky-300 text-[11.5px] px-1.5 py-0.5 rounded font-mono">{children}</code>;
}

function WarnBox({ children }) {
  return (
    <div className="flex items-start gap-2 my-3 px-3 py-2.5 bg-amber-500/8 border border-amber-600/25 rounded-lg text-amber-200/80 text-[13px] leading-relaxed">
      <span className="flex-shrink-0 text-amber-400">⚠</span>
      <span>{children}</span>
    </div>
  );
}

function Related({ children }) {
  return <p className="text-[11.5px] text-gray-600 italic mt-2 leading-relaxed">{children}</p>;
}

function PartHeading({ badge, id, children }) {
  return (
    <h2 id={id} className="flex items-center gap-2.5 text-[19px] font-bold mb-5 pb-3 border-b border-[#21262d] scroll-mt-4">
      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/25 whitespace-nowrap">
        {badge}
      </span>
      {children}
    </h2>
  );
}

function SectionH({ id, children }) {
  return (
    <h3 id={id} className="text-[15px] font-semibold text-[#79c0ff] mt-8 mb-2 scroll-mt-4">
      {children}
    </h3>
  );
}

// ─── Math section layout blocks ───────────────────────────────────────────────

/** Blue block — concept explanation + key insight */
function Theory({ children }) {
  return (
    <div className="my-3 pl-4 border-l-2 border-blue-500/50 bg-blue-500/5 rounded-r-xl py-3 pr-4">
      <p className="text-[10.5px] font-bold uppercase tracking-wider text-blue-400/80 mb-2 flex items-center gap-1">
        <span>📖</span> Theory
      </p>
      <div className="text-[13px] text-gray-300 leading-[1.75] space-y-2">{children}</div>
    </div>
  );
}

/** Green block — interview signals / when you should reach for this pattern */
function WhenToUse({ items }) {
  return (
    <div className="my-3 pl-4 border-l-2 border-emerald-500/50 bg-emerald-500/5 rounded-r-xl py-3 pr-4">
      <p className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-400/80 mb-2 flex items-center gap-1">
        <span>💡</span> When to use
      </p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-[13px] text-gray-300 flex items-start gap-2">
            <span className="text-emerald-500 flex-shrink-0 mt-0.5 text-xs">▸</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Violet block — a worked trace so you can see the algorithm running */
function Example({ title, children }) {
  return (
    <div className="my-3 pl-4 border-l-2 border-violet-500/50 bg-violet-500/5 rounded-r-xl py-3 pr-4">
      <p className="text-[10.5px] font-bold uppercase tracking-wider text-violet-400/80 mb-2 flex items-center gap-1">
        <span>🔢</span> {title || 'Example trace'}
      </p>
      <div
        className="text-[12.5px] text-gray-300 leading-7 whitespace-pre-wrap"
        style={{ fontFamily: "'JetBrains Mono','Fira Code',ui-monospace,monospace" }}
      >
        {children}
      </div>
    </div>
  );
}

/** Card container that wraps one full math section */
function MathCard({ id, title, badge, children }) {
  return (
    <div id={id} className="scroll-mt-4 mt-8 rounded-xl border border-[#21262d] overflow-hidden">
      <div className="bg-[#0d1117] px-4 py-3 border-b border-[#21262d] flex items-center justify-between gap-3">
        <h3 className="text-[14.5px] font-semibold text-[#79c0ff]">{title}</h3>
        {badge && (
          <span className="text-[11px] text-gray-500 font-mono bg-gray-800/60 px-2 py-0.5 rounded flex-shrink-0">
            {badge}
          </span>
        )}
      </div>
      <div className="px-4 py-4 space-y-1 bg-[#010409]">{children}</div>
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────

function CheatTable({ headers, children }) {
  return (
    <div className="overflow-x-auto my-3 rounded-xl border border-[#21262d]">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-[#161b22] border-b border-[#30363d]">
            {headers.map(h => (
              <th key={h} className="px-3 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function TR({ cells }) {
  return (
    <tr className="border-b border-[#21262d]/70 hover:bg-white/[0.025] transition-colors">
      {cells.map((cell, i) => (
        <td key={i} className="px-3 py-2.5 text-gray-300 align-top leading-relaxed">{cell}</td>
      ))}
    </tr>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV = [
  { id: 'part1',         label: 'Part 1 · Java Reference', section: true },
  { id: 's-strings',     label: '1.1 Strings' },
  { id: 's-arrays',      label: '1.2 Arrays' },
  { id: 's-collections', label: '1.3 Collections' },
  { id: 's-comparators', label: '1.4 Comparators' },
  { id: 's-numbers',     label: '1.5 Numbers & Bits' },
  { id: 's-charapi',     label: '1.6 Character API' },
  { id: 's-pitfalls',    label: '1.7 Pitfalls ⚠' },
  { id: 'part2',         label: 'Part 2 · Complexity', section: true },
  { id: 'part3',         label: 'Part 3 · Patterns', section: true },
  { id: 'part4',         label: 'Part 4 · Math', section: true },
  { id: 's-divmod',      label: '4.1 Division & Modulo' },
  { id: 's-gcd',         label: '4.2 GCD & LCM' },
  { id: 's-primes',      label: '4.3 Primes' },
  { id: 's-sieve',       label: '4.4 Sieve' },
  { id: 's-fastpow',     label: '4.5 Fast Power' },
  { id: 's-modular',     label: '4.6 Modular Arithmetic' },
  { id: 's-pascal',      label: '4.7 Pascal / nCr' },
  { id: 's-catalan',     label: '4.8 Catalan Numbers' },
  { id: 's-fib',         label: '4.9 Fibonacci' },
  { id: 's-digits',      label: '4.10 Digit Manipulation' },
  { id: 's-powk',        label: '4.11 Power of k Check' },
  { id: 's-comb',        label: '4.12 Combinatorics' },
];

function Sidebar({ active }) {
  return (
    <aside className="hidden lg:flex flex-col w-[215px] flex-shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-[#21262d] bg-[#0d1117] py-4" style={{ scrollbarWidth: 'thin' }}>
      <div className="px-4 pb-3 mb-1 border-b border-[#21262d]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Interview Prep Tracker</p>
        <p className="text-[11px] text-gray-600 mt-0.5">Java DSA Cheat Sheet</p>
      </div>
      <nav className="px-2 pt-2">
        {NAV.map(item =>
          item.section ? (
            <a key={item.id} href={`#${item.id}`}
              className="block mt-4 first:mt-1 px-2 py-1 text-[12px] font-semibold text-gray-300 hover:text-white transition-colors">
              {item.label}
            </a>
          ) : (
            <a key={item.id} href={`#${item.id}`}
              className={`block ml-2 px-2 py-[3px] text-[11.5px] rounded transition-all ${
                active === item.id
                  ? 'text-blue-300 bg-blue-500/10 border-l-2 border-blue-400 pl-[7px]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}>
              {item.label}
            </a>
          )
        )}
      </nav>
    </aside>
  );
}

// ─── Part 1 code strings ──────────────────────────────────────────────────────

const CODE_STRINGS = `// ── Access ──────────────────────────────────────────────────────────────────
char c = s.charAt(i);          char[] arr = s.toCharArray();
int len = s.length();

// ── Slice and search ────────────────────────────────────────────────────────
String sub = s.substring(l, r); // [l, r) — r is exclusive
int pos = s.indexOf("ab");       // first index, -1 if absent
int pos = s.indexOf("ab", from); // search from 'from'

// ── Split and check ─────────────────────────────────────────────────────────
String[] parts = s.split(",");       // split by regex
boolean starts = s.startsWith("pre");
boolean ends   = s.endsWith("suf");
String t = s.toLowerCase();  String u = s.toUpperCase();
String trimmed = s.strip();          // strip() handles Unicode whitespace

// ── Convert ─────────────────────────────────────────────────────────────────
String str = String.valueOf(42);              // int → String
String str = String.valueOf(charArray);       // char[] → String
String str = Integer.toString(n, 2);         // int → binary string
int n = Integer.parseInt("42");
int n = Integer.parseInt("ff", 16);          // hex string → int

// ── StringBuilder (mutable, O(1) amortized append) ─────────────────────────
StringBuilder sb = new StringBuilder();
sb.append('x');  sb.append("abc");
sb.insert(i, 'x');
sb.deleteCharAt(i);  sb.delete(l, r);  // [l,r) removed
sb.reverse();
sb.setCharAt(i, 'y');
String result = sb.toString();

// ── Char arithmetic ──────────────────────────────────────────────────────────
int idx  = c - 'a';           // 'a'→0, 'z'→25
char ch  = (char)('a' + idx); // 0→'a', 25→'z'
int diff = 'Z' - 'A';         // == 'z' - 'a' == 25`;

const CODE_ARRAYS = `// ── Sort ─────────────────────────────────────────────────────────────────────
Arrays.sort(arr);                           // O(n log n), dual-pivot quicksort
Arrays.sort(arr, l, r);                     // [l, r) only
Arrays.sort(arr2d, (a, b) -> a[0] - b[0]); // sort 2D by col 0 — safe only for non-negative

// Safe comparator (avoid overflow when values can be negative)
Arrays.sort(arr2d, (a, b) -> Integer.compare(a[0], b[0]));

// ── Fill, copy ───────────────────────────────────────────────────────────────
Arrays.fill(dp, -1);
int[] copy = Arrays.copyOf(arr, newLen);
int[] sub  = Arrays.copyOfRange(arr, l, r); // [l, r)

// ── List conversion ──────────────────────────────────────────────────────────
List<Integer> list = new ArrayList<>(Arrays.asList(1, 2, 3));
// Arrays.asList returns FIXED-SIZE list; wrap in new ArrayList<> to allow add/remove

// ── Binary search (array must be sorted) ─────────────────────────────────────
int idx = Arrays.binarySearch(sortedArr, key);
// Returns index if found, or -(insertionPoint + 1) if absent`;

const CODE_COLLECTIONS = `// ── List ─────────────────────────────────────────────────────────────────────
List<Integer> list = new ArrayList<>();
list.add(x);  list.add(i, x);  list.get(i);  list.set(i, x);  list.remove(i);
Collections.sort(list);  Collections.reverse(list);
int idx = Collections.binarySearch(sortedList, key);

// ── ArrayDeque — use as stack or queue (faster than Stack / LinkedList) ──────
Deque<Integer> stack = new ArrayDeque<>();
stack.push(x); stack.pop(); stack.peek();           // LIFO

Deque<Integer> queue = new ArrayDeque<>();
queue.offer(x); queue.poll(); queue.peek();          // FIFO
queue.offerFirst(x); queue.pollLast();               // deque ops

// ── HashMap ──────────────────────────────────────────────────────────────────
map.getOrDefault(k, 0);
map.put(k, map.getOrDefault(k, 0) + 1);
map.merge(k, 1, Integer::sum);                       // concise frequency count
map.computeIfAbsent(k, x -> new ArrayList<>()).add(v);
map.putIfAbsent(k, defaultVal);
for (Map.Entry<K,V> e : map.entrySet()) { e.getKey(); e.getValue(); }

// ── TreeMap (sorted by key, O(log n)) ────────────────────────────────────────
tm.floorKey(k);   tm.ceilingKey(k);
tm.firstKey();    tm.lastKey();
tm.headMap(k);    tm.tailMap(k, inclusive);

// ── HashSet / TreeSet ─────────────────────────────────────────────────────────
set.add(x);  set.contains(x);  set.remove(x);
TreeSet<Integer> ts = new TreeSet<>();
ts.floor(x);  ts.ceiling(x);  ts.higher(x);  ts.lower(x);

// ── PriorityQueue (min-heap by default) ───────────────────────────────────────
PriorityQueue<Integer> minH = new PriorityQueue<>();
PriorityQueue<Integer> maxH = new PriorityQueue<>(Collections.reverseOrder());
PriorityQueue<int[]>   pq   = new PriorityQueue<>((a, b) -> a[0] - b[0]);
pq.offer(elem);  pq.poll();  pq.peek();  pq.size();`;

const CODE_COMPARATORS = `// Descending integer sort (safe only when no overflow)
Arrays.sort(arr, (a, b) -> b - a);

// Multi-key: primary by length ascending, secondary alphabetical
list.sort(Comparator.comparingInt(String::length)
                    .thenComparing(Comparator.naturalOrder()));

// Sort map entries by value descending
list.sort(Map.Entry.<String, Integer>comparingByValue().reversed());

// Custom object sort
list.sort((p, q) -> p.start != q.start ? p.start - q.start : p.end - q.end);`;

const CODE_NUMBERS = `// ── Limits ───────────────────────────────────────────────────────────────────
int  MAX = Integer.MAX_VALUE;  // 2^31 - 1 ≈ 2.1 × 10^9
long MAX = Long.MAX_VALUE;     // 2^63 - 1 ≈ 9.2 × 10^18
long safe = (long) a * b;      // cast BEFORE multiplying to prevent int overflow

// ── Math utilities ────────────────────────────────────────────────────────────
Math.max(a, b);  Math.min(a, b);  Math.abs(x);
Math.floorMod(-7, 3);  // → 2  (always non-negative unlike % for negatives)
int ceil = (a + b - 1) / b;   // ceiling division for positive a, b
int ceil = (int) Math.ceil((double) a / b);

// GCD via BigInteger (Java 5+)
int g = BigInteger.valueOf(a).gcd(BigInteger.valueOf(b)).intValue();

// ── Bit tricks ────────────────────────────────────────────────────────────────
boolean isPow2  = (n > 0) && (n & (n - 1)) == 0;
int lowestBit   = n & (-n);             // isolate lowest set bit
int clearLowest = n & (n - 1);          // clear lowest set bit
int bit_i       = (n >> i) & 1;         // get bit i
int set_i       = n | (1 << i);         // set bit i
int clear_i     = n & ~(1 << i);        // clear bit i
int toggle_i    = n ^ (1 << i);         // flip bit i
int count       = Integer.bitCount(n);  // count set bits
String bin      = Integer.toBinaryString(n);`;

const CODE_CHARAPI = `Character.isDigit(c);           // '0'–'9'
Character.isLetter(c);          // a-z, A-Z (and Unicode)
Character.isLetterOrDigit(c);
Character.isUpperCase(c);  Character.isLowerCase(c);
Character.isWhitespace(c);      // space, tab, newline
char lo = Character.toLowerCase(c);
char up = Character.toUpperCase(c);
int val = Character.getNumericValue(c); // '3'→3, 'a'→10 (hex digit)`;

const CODE_PITFALLS = `// 1. String / Integer == compares REFERENCES, not values
Integer a = 200, b = 200;
a == b;       // false  (beyond [-128, 127] cache range)
a.equals(b);  // true   ← always use .equals()

// 2. Arrays.asList is fixed-size
List<String> fixed = Arrays.asList("a", "b");               // cannot add/remove
List<String> flex  = new ArrayList<>(Arrays.asList("a", "b")); // ok

// 3. subList is a VIEW — modifying it modifies the original list
List<Integer> view = list.subList(1, 4); // backed by list

// 4. ConcurrentModificationException
// WRONG: removing while iterating with for-each
for (Integer x : list) if (x == 0) list.remove(x); // throws!
// RIGHT: use removeIf or an explicit Iterator
list.removeIf(x -> x == 0);
Iterator<Integer> it = list.iterator();
while (it.hasNext()) { if (it.next() == 0) it.remove(); }

// 5. Negative modulo
(-7) % 3;             // → -1 in Java (sign of dividend)
Math.floorMod(-7, 3); // → 2  ← use this for circular / non-negative indexing

// 6. Integer overflow in comparator
// WRONG: (a, b) -> a - b  (overflows when a ≈ MIN_VALUE, b > 0)
// RIGHT: (a, b) -> Integer.compare(a, b)`;

// ─── Part 4 code strings ──────────────────────────────────────────────────────

const CODE_41 = `// Ceiling division (positive a, b only)
int ceil = (a + b - 1) / b;
// Intuition: add (b-1) so that any remainder "rounds up" to the next multiple
int ceil = (int) Math.ceil((double) a / b); // floating-point alternative

// Negative-safe modulo — result always in [0, n-1]
int idx = Math.floorMod(pos, n);   // use for circular arrays / clock arithmetic
// Java's % gives: (-7) % 3 = -1    Math.floorMod(-7, 3) = 2

// Truncation direction
int pos =  7 / 2;   // = 3  (truncates toward zero)
int neg = -7 / 2;   // = -3 (truncates toward zero, NOT toward -∞)

// Divisibility check
boolean divides = (a % b == 0);`;

const CODE_42 = `// ── Euclidean GCD — O(log min(a,b)) ─────────────────────────────────────────
int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}

// Iterative (avoids stack overflow for very large inputs)
int gcd(int a, int b) {
    while (b != 0) { int t = b; b = a % b; a = t; }
    return a;
}

// ── LCM — divide BEFORE multiplying to prevent overflow ──────────────────────
long lcm(long a, long b) {
    return (a / gcd(a, b)) * b;  // NOT: a * b / gcd — that overflows!
}

// ── Check coprimality ─────────────────────────────────────────────────────────
boolean coprime = (gcd(a, b) == 1);`;

const CODE_43 = `// ── Prime check — O(√n) ─────────────────────────────────────────────────────
boolean isPrime(int n) {
    if (n < 2) return false;
    if (n == 2) return true;
    if (n % 2 == 0) return false;          // skip evens quickly
    for (int i = 3; (long) i * i <= n; i += 2)
        if (n % i == 0) return false;
    return true;
}

// ── Prime factorization — O(√n) ──────────────────────────────────────────────
List<Integer> primeFactors(int n) {
    List<Integer> f = new ArrayList<>();
    for (int i = 2; (long) i * i <= n; i++) {
        while (n % i == 0) { f.add(i); n /= i; }
    }
    if (n > 1) f.add(n);   // remaining factor > √n is itself prime
    return f;
}
// primeFactors(360)  →  [2, 2, 2, 3, 3, 5]  (i.e. 2³ × 3² × 5)`;

const CODE_44 = `// ── Sieve of Eratosthenes — O(n log log n) ──────────────────────────────────
boolean[] sieve(int n) {
    boolean[] notPrime = new boolean[n + 1];
    notPrime[0] = notPrime[1] = true;
    for (int i = 2; (long) i * i <= n; i++) {
        if (!notPrime[i]) {
            // Start from i*i — smaller multiples (2i,3i,...,(i-1)i)
            // were already eliminated by smaller primes
            for (int j = i * i; j <= n; j += i)
                notPrime[j] = true;
        }
    }
    return notPrime; // notPrime[k] == false  means k is prime
}

// Collect all primes up to n
List<Integer> primes = new ArrayList<>();
boolean[] np = sieve(n);
for (int i = 2; i <= n; i++) if (!np[i]) primes.add(i);`;

const CODE_45 = `// ── Binary (fast) exponentiation — O(log exp) ───────────────────────────────
long fastPow(long base, long exp, long mod) {
    long result = 1;
    base %= mod;
    while (exp > 0) {
        if ((exp & 1) == 1)          // current bit is 1 → multiply in base
            result = result * base % mod;
        base = base * base % mod;    // square base for next bit position
        exp >>= 1;                   // move to next bit
    }
    return result;
}

// ── Modular inverse (mod must be PRIME) — Fermat's little theorem ─────────────
// a^(-1) mod p  =  a^(p-2) mod p
long modInverse(long a, long mod) {
    return fastPow(a, mod - 2, mod);
}

// Usage
long MOD = 1_000_000_007L;
long result = fastPow(3, 13, MOD);  // 3^13 mod 10^9+7`;

const CODE_46 = `final long MOD = 1_000_000_007L;  // large prime — (MOD-1)^2 fits in long

// ── Add / subtract ────────────────────────────────────────────────────────────
long add = ((a % MOD) + (b % MOD)) % MOD;
long sub = ((a % MOD) - (b % MOD) + MOD) % MOD;  // +MOD so result stays ≥ 0

// ── Multiply ──────────────────────────────────────────────────────────────────
long mul = ((long)(a % MOD)) * (b % MOD) % MOD;   // cast to long FIRST

// ── Divide — multiply by modular inverse (only when MOD is prime) ─────────────
long inv = fastPow(b, MOD - 2, MOD);   // b^(MOD-2) mod MOD
long div = mul * inv % MOD;

// ── Running product (e.g. factorial mod MOD) ──────────────────────────────────
long fact = 1;
for (int i = 1; i <= n; i++) fact = fact * i % MOD;`;

const CODE_47 = `// ── nCr mod prime — rolling Pascal row, O(n·r) time, O(r) space ─────────────
long nCr(int n, int r, long MOD) {
    if (r > n) return 0;
    long[] C = new long[r + 1];
    C[0] = 1;
    for (int i = 1; i <= n; i++) {
        // Process RIGHT TO LEFT to avoid overwriting values still needed
        for (int j = Math.min(i, r); j > 0; j--)
            C[j] = (C[j] + C[j - 1]) % MOD;
    }
    return C[r];  // C(n, r) mod MOD
}

// ── Precompute all factorials for O(1) nCr queries ───────────────────────────
long[] fact = new long[n + 1];
long[] inv  = new long[n + 1];
fact[0] = inv[0] = 1;
for (int i = 1; i <= n; i++) fact[i] = fact[i - 1] * i % MOD;
inv[n] = fastPow(fact[n], MOD - 2, MOD);
for (int i = n - 1; i >= 1; i--) inv[i] = inv[i + 1] * (i + 1) % MOD;
// nCr(n, r) = fact[n] * inv[r] % MOD * inv[n-r] % MOD`;

const CODE_48 = `// ── Catalan numbers — O(n) DP ────────────────────────────────────────────────
long[] catalan(int n) {
    long[] C = new long[n + 1];
    C[0] = C[1] = 1;
    for (int i = 2; i <= n; i++) {
        C[i] = 0;
        for (int j = 0; j < i; j++)
            C[i] = (C[i] + C[j] * C[i - 1 - j]) % MOD;
        // Equivalently: C[i] = nCr(2i, i) / (i + 1)
    }
    return C;
}
// First 8 Catalan numbers: 1, 1, 2, 5, 14, 42, 132, 429`;

const CODE_49 = `// ── Iterative Fibonacci — O(n) time, O(1) space ─────────────────────────────
// Naive recursion is O(2^n)! Always use iterative or memoized version.
long fib(int n) {
    if (n <= 1) return n;
    long a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        long c = a + b;  // no mod needed if n is small; use % MOD for large n
        a = b;
        b = c;
    }
    return b;
}

// ── Matrix exponentiation — O(log n), for very large n ───────────────────────
// [[1,1],[1,0]]^n  gives  [[F(n+1), F(n)], [F(n), F(n-1)]]
// (implement matrix multiply + fast-pow on 2x2 matrix)`;

const CODE_410 = `// ── Extract digits right-to-left ─────────────────────────────────────────────
int sum = 0;
int temp = Math.abs(n);         // handle negative input
while (temp > 0) {
    int digit = temp % 10;      // last digit
    sum += digit;
    temp /= 10;                 // remove last digit
}

// ── Count digits (n > 0) ─────────────────────────────────────────────────────
int numDigits = (int) Math.log10(n) + 1;
// Alternatively: String.valueOf(Math.abs(n)).length()

// ── Reverse an integer (watch overflow — use long) ────────────────────────────
long rev = 0;
while (n != 0) {
    rev = rev * 10 + n % 10;
    n /= 10;
}
if (rev > Integer.MAX_VALUE) { /* overflow */ }

// ── Armstrong number check (each digit^numDigits, e.g. 153 = 1³+5³+3³) ──────
int digits = (int) Math.log10(n) + 1;
int sum = 0, temp = n;
while (temp > 0) { int d = temp % 10; sum += (int) Math.pow(d, digits); temp /= 10; }
boolean isArmstrong = (sum == n);`;

const CODE_411 = `// ── Power of 2 ───────────────────────────────────────────────────────────────
// n & (n-1) clears the lowest set bit.  If result == 0, only one bit was set.
boolean isPow2(int n) { return n > 0 && (n & (n - 1)) == 0; }
// Examples: 8 = 1000, 8-1 = 0111, 8 & 7 = 0000 ✓   |   6 = 110, 6 & 5 = 100 ✗

// ── Power of 3 ───────────────────────────────────────────────────────────────
// 3^19 = 1162261467 is the largest power of 3 within int range.
// If n is a power of 3, it must divide 3^19 (all factors are 3s).
boolean isPow3(int n) { return n > 0 && 1162261467 % n == 0; }

// ── Power of 4 ───────────────────────────────────────────────────────────────
// Must be power-of-2 AND the single set bit must be at an even position (0,2,4…).
// Mask 0xAAAAAAAA = ...1010 1010 — bits set at ODD positions.
// So n & 0xAAAAAAAA == 0 means the set bit is at an even position.
boolean isPow4(int n) { return isPow2(n) && (n & 0xAAAAAAAA) == 0; }`;

// ─── Main component ───────────────────────────────────────────────────────────

export default function CheatSheet() {
  const [active, setActive] = useState('part1');

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );
    document.querySelectorAll('[id]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const c = (s) => <Mono>{s}</Mono>;

  return (
    <div className="flex min-h-screen bg-[#010409] text-[#e6edf3]">
      <Sidebar active={active} />

      <main className="flex-1 min-w-0 max-w-[900px] mx-auto px-6 lg:px-10 py-8 pb-24">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-[#21262d]">
          <div>
            <h1 className="text-[22px] font-bold">☕ Java DSA Cheat Sheet</h1>
            <p className="text-sm text-gray-500 mt-0.5">Quick reference · pin this tab during study sessions</p>
          </div>
          <button
            onClick={() => window.close()}
            className="text-xs px-3 py-1.5 rounded-lg border border-[#30363d] text-gray-500 hover:text-white hover:border-gray-500 transition-colors flex-shrink-0"
          >
            ✕ Close tab
          </button>
        </div>

        {/* ══════════════════════  PART 1  ══════════════════════ */}
        <section id="part1" className="mb-14">
          <PartHeading badge="Part 1" id="part1">Java Reference</PartHeading>

          <div id="s-strings" className="scroll-mt-4">
            <SectionH>1.1 Strings</SectionH>
            <CodeBlock code={CODE_STRINGS} />
          </div>

          <div id="s-arrays" className="scroll-mt-4">
            <SectionH>1.2 Arrays</SectionH>
            <CodeBlock code={CODE_ARRAYS} />
          </div>

          <div id="s-collections" className="scroll-mt-4">
            <SectionH>1.3 Collections</SectionH>
            <CodeBlock code={CODE_COLLECTIONS} />
          </div>

          <div id="s-comparators" className="scroll-mt-4">
            <SectionH>1.4 Comparators</SectionH>
            <CodeBlock code={CODE_COMPARATORS} />
          </div>

          <div id="s-numbers" className="scroll-mt-4">
            <SectionH>1.5 Numbers and Bit Operations</SectionH>
            <CodeBlock code={CODE_NUMBERS} />
          </div>

          <div id="s-charapi" className="scroll-mt-4">
            <SectionH>1.6 Character API</SectionH>
            <CodeBlock code={CODE_CHARAPI} />
          </div>

          <div id="s-pitfalls" className="scroll-mt-4">
            <SectionH>1.7 Pitfalls ⚠</SectionH>
            <WarnBox>These are the most common Java DSA bugs — read through before every interview or contest.</WarnBox>
            <CodeBlock code={CODE_PITFALLS} />
          </div>
        </section>

        {/* ══════════════════════  PART 2  ══════════════════════ */}
        <section id="part2" className="mb-14 scroll-mt-4">
          <PartHeading badge="Part 2" id="part2">Input Size → Complexity Guide</PartHeading>
          <CheatTable headers={['Input size n', 'Max acceptable complexity', 'Typical algorithms']}>
            <TR cells={[<>{c('n ≤ 10')}</>, c('O(n!)'), 'All permutations, brute-force backtracking']} />
            <TR cells={[<>{c('n ≤ 20')}</>, c('O(2ⁿ)'), 'Bitmask DP, enumerate all subsets']} />
            <TR cells={[<>{c('n ≤ 200')}</>, c('O(n³)'), 'Floyd-Warshall, interval DP, 3-nested loops']} />
            <TR cells={[<>{c('n ≤ 500')}</>, c('O(n²·log n)'), '2D DP with sort, or careful O(n³)']} />
            <TR cells={[<>{c('n ≤ 5 000')}</>, c('O(n²)'), 'Brute-force pairs, 2D DP']} />
            <TR cells={[<>{c('n ≤ 10⁵')}</>, c('O(n log n)'), 'Sort, heap, binary search, merge sort']} />
            <TR cells={[<>{c('n ≤ 10⁶')}</>, c('O(n)'), 'Prefix sum, linear scan, hash map']} />
            <TR cells={[<>{c('n ≤ 10⁹')}</>, c('O(log n)'), 'Binary search on answer, fast exponentiation']} />
            <TR cells={[<>values {c('≤ 10⁹')}, result {c('mod 10⁹+7')}</>, <>{c('O(n log n)')} or {c('O(log n)')}</>, 'Modular arithmetic, fast exponentiation']} />
          </CheatTable>
        </section>

        {/* ══════════════════════  PART 3  ══════════════════════ */}
        <section id="part3" className="mb-14 scroll-mt-4">
          <PartHeading badge="Part 3" id="part3">Pattern Selection Guide</PartHeading>
          <CheatTable headers={['Signal / Keywords in problem', 'Pattern', 'Complexity']}>
            <TR cells={['Two values summing to target, frequency count, duplicate/missing', 'Arrays and Hashing', c('O(n)')]} />
            <TR cells={['Sorted array, pair sum, palindrome, in-place partition, remove dups', 'Two Pointers', c('O(n)')]} />
            <TR cells={['Longest/shortest contiguous window, at most K distinct, min window substring', 'Sliding Window', c('O(n)')]} />
            <TR cells={['Range sum query, subarray sum = K, count subarrays meeting condition', 'Prefix Sum', c('O(n)')]} />
            <TR cells={['Sorted input, minimise/maximise feasible answer, k-th element', 'Binary Search', <>{c('O(log n)')} – {c('O(n log n)')}</>]} />
            <TR cells={['Next greater/smaller, largest rectangle, asteroid collision, monotone', 'Monotonic Stack', c('O(n)')]} />
            <TR cells={['Sliding window maximum, moving average, task scheduling', 'Monotonic Queue / Deque', c('O(n)')]} />
            <TR cells={['Reverse, detect cycle, merge, reorder, k-group', 'Linked List', c('O(n)')]} />
            <TR cells={['Height, diameter, path sum, LCA, serialize, build from traversals', 'Tree DFS / BFS', c('O(n)')]} />
            <TR cells={['Top K, k-th largest/smallest, median stream, merge K sorted', 'Heap / PQ', c('O(n log k)')]} />
            <TR cells={['All combinations or permutations, subsets, constraint search', 'Backtracking', <>{c('O(2ⁿ)')} – {c('O(n!)')}</>]} />
            <TR cells={['Connected components, islands, bipartite, cycle, BFS layers', 'Graph BFS / DFS', c('O(V+E)')]} />
            <TR cells={['Ordering with prerequisites, alien dict, safe states', 'Topological Sort', c('O(V+E)')]} />
            <TR cells={['Dynamic connectivity, redundant edge, accounts merge', 'Union-Find', c('O(n α(n))')]} />
            <TR cells={['Weighted shortest path, network delay, cheapest flights', 'Dijkstra / Bellman-Ford', c('O(E log V)')]} />
            <TR cells={['Prefix search, count distinct substrings, XOR max', 'Trie', c('O(L) per op')]} />
            <TR cells={['Merge overlapping intervals, activity selection, jump game', 'Greedy + Intervals', c('O(n log n)')]} />
            <TR cells={['Count ways, minimum cost, optimal substructure, overlapping sub-problems', 'Dynamic Programming', <>{c('O(n²)')} – {c('O(n³)')}</>]} />
            <TR cells={['Power of 2, single number, subset enumeration, XOR tricks', 'Bit Manipulation', c('O(n)')]} />
            <TR cells={['Spiral, rotate 90°, set zeros, search in 2D matrix', 'Matrix / Grid', c('O(n²)')]} />
            <TR cells={['Find substring, repeated pattern, shortest palindrome, KMP', 'String Hashing / KMP', c('O(n)')]} />
          </CheatTable>
        </section>

        {/* ══════════════════════  PART 4  ══════════════════════ */}
        <section id="part4" className="mb-14 scroll-mt-4">
          <PartHeading badge="Part 4" id="part4">Math Foundations</PartHeading>

          {/* 4.1 Division & Modulo */}
          <MathCard id="s-divmod" title="4.1 Integer Division, Modulo, and Rounding">
            <Theory>
              <p>
                Java's <IC>/</IC> operator <strong>truncates toward zero</strong>: <IC>7/2 = 3</IC> and <IC>-7/2 = -3</IC> (not −4).
                The <IC>%</IC> operator's result has the <strong>same sign as the dividend</strong>: <IC>(-7) % 3 = -1</IC>, not 2.
              </p>
              <p>
                For <strong>ceiling division</strong> (how many pages needed for n items at k per page?), adding <IC>(b−1)</IC>
                before dividing causes any remainder to "push" the quotient up by 1: <IC>(a + b - 1) / b</IC>.
              </p>
              <p>
                <IC>Math.floorMod(a, b)</IC> always returns a non-negative value in <IC>[0, b-1]</IC> — use this
                for <strong>circular indexing</strong> (clock arithmetic, ring buffers, wrapping arrays).
              </p>
            </Theory>
            <WhenToUse items={[
              'Pagination: number of pages = ⌈n / pageSize⌉',
              'Circular array index: next = Math.floorMod(i + 1, n)',
              'Evenly distributing n items into k buckets',
              'Checking divisibility (a % b == 0)',
            ]} />
            <Example title="Ceiling division  —  ⌈7 / 2⌉ = 4">
              {'(7 + 2 - 1) / 2  =  8 / 2  =  4  ✓\n\nNegative modulo:\n(-7) % 3          =  -1   ← Java default (watch out!)\nMath.floorMod(-7,3) =   2   ← safe for circular indexing'}
            </Example>
            <CodeBlock code={CODE_41} />
          </MathCard>

          {/* 4.2 GCD & LCM */}
          <MathCard id="s-gcd" title="4.2 GCD and LCM" badge="O(log min(a,b))">
            <Theory>
              <p>
                <strong>GCD</strong> (Greatest Common Divisor) is the largest integer that divides both a and b without remainder.
                The <strong>Euclidean algorithm</strong> exploits the identity: <IC>gcd(a, b) = gcd(b, a mod b)</IC>.
              </p>
              <p>
                Why does this work? Any number that divides both a and b also divides their difference <IC>a − b</IC>,
                and by extension <IC>a mod b</IC> (which is just repeated subtraction). The base case is <IC>gcd(a, 0) = a</IC>.
              </p>
              <p>
                <strong>LCM</strong> = <IC>a × b / gcd(a, b)</IC>. Always divide <em>first</em> to avoid overflow.
                Two numbers are <strong>coprime</strong> if <IC>gcd(a, b) = 1</IC>.
              </p>
            </Theory>
            <WhenToUse items={[
              'Simplify fractions (divide numerator and denominator by gcd)',
              'Check coprimality: gcd(a, b) == 1',
              'Scheduling: two events repeat every a and b days → next sync after lcm(a, b) days',
              'Minimum steps for two pointers moving at different speeds to meet',
            ]} />
            <Example title="gcd(48, 18)">
              {'gcd(48, 18)\n  → gcd(18, 48 % 18) = gcd(18, 12)\n  → gcd(12, 18 % 12) = gcd(12,  6)\n  → gcd( 6, 12 %  6) = gcd( 6,  0)\n  →  6\n\nlcm(48, 18) = (48 / 6) × 18 = 8 × 18 = 144'}
            </Example>
            <CodeBlock code={CODE_42} />
            <Related>Related: Problems/Recursion/Easy/GCD.java · Problems/Recursion/Easy/LCM.java · Problems/LogicBuilding/Easy/GCD.java</Related>
          </MathCard>

          {/* 4.3 Primes */}
          <MathCard id="s-primes" title="4.3 Prime Check and Prime Factorization" badge="O(√n)">
            <Theory>
              <p>
                A <strong>prime</strong> has exactly 2 divisors: 1 and itself. Key insight: if <IC>n = a × b</IC> with
                <IC>a ≤ b</IC>, then <IC>a ≤ √n</IC>. So if n has no factor from 2 to <IC>√n</IC>, it is prime.
                This is why trial division only needs to check up to <IC>√n</IC>.
              </p>
              <p>
                <strong>Fundamental Theorem of Arithmetic</strong>: every integer greater than 1 has a <em>unique</em> prime
                factorization. To find it: divide out the smallest possible prime repeatedly, then move to the next.
                Any remaining factor larger than <IC>√n</IC> must itself be prime.
              </p>
            </Theory>
            <WhenToUse items={[
              'Single primality check for a given number n',
              'Find all prime factors for GCD, LCM, or divisor count problems',
              'Count distinct primes, total prime factor count',
              '"Is n a perfect square?" → prime factorization has all even exponents',
            ]} />
            <Example title="isPrime(97)  and  primeFactors(360)">
              {'isPrime(97):\n  √97 ≈ 9.8  →  check 2, 3, 5, 7, 9\n  None divide 97  →  prime ✓\n\nprimeFactors(360):\n  360 / 2 = 180 / 2 = 90 / 2 = 45\n  45  / 3 = 15  / 3 = 5\n  5 > √5  →  add 5 as last factor\n  Result: [2, 2, 2, 3, 3, 5]  i.e. 2³ × 3² × 5'}
            </Example>
            <CodeBlock code={CODE_43} />
            <Related>Related: Problems/LogicBuilding/Medium/PrintPrimeFactors.java · Problems/GoodProblems/PrintPrimeFactors.java</Related>
          </MathCard>

          {/* 4.4 Sieve */}
          <MathCard id="s-sieve" title="4.4 Sieve of Eratosthenes" badge="O(n log log n)">
            <Theory>
              <p>
                Start by assuming every number 2…n is prime. For each prime p found, mark all multiples of p
                as <em>not prime</em>. Starting from <IC>p²</IC> is safe because all smaller multiples
                (<IC>2p, 3p, …, (p−1)p</IC>) have already been marked by their smaller prime factors.
              </p>
              <p>
                The total work is <IC>n/2 + n/3 + n/5 + …</IC> (one pass per prime). By the prime harmonic series,
                this sums to <IC>O(n log log n)</IC> — effectively linear for practical n.
              </p>
              <p>
                Use the sieve when you need: <strong>(a)</strong> all primes up to n, or
                <strong> (b)</strong> to answer many "is x prime?" queries without recomputing each time.
              </p>
            </Theory>
            <WhenToUse items={[
              'Find all primes up to n (e.g. n = 10⁶ or 10⁷)',
              'Multiple isPrime() queries — precompute once, answer in O(1)',
              'Count primes in a range [l, r] quickly',
              'Smallest prime factor (SPF) sieve for fast factorization',
            ]} />
            <Example title="Sieve up to n = 20">
              {'Start: 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20\n\np=2: mark  4, 6, 8, 10, 12, 14, 16, 18, 20\np=3: mark  9, 12, 15, 18          (start from 3²=9)\np=4: already marked\np=5: 5² = 25 > 20, stop\n\nPrimes: 2, 3, 5, 7, 11, 13, 17, 19'}
            </Example>
            <CodeBlock code={CODE_44} />
          </MathCard>

          {/* 4.5 Fast Power */}
          <MathCard id="s-fastpow" title="4.5 Fast Exponentiation (Binary Exponentiation)" badge="O(log exp)">
            <Theory>
              <p>
                Naive repeated multiplication takes O(exp) steps. Binary exponentiation reduces this to
                <IC>O(log exp)</IC> by exploiting the binary representation of the exponent.
              </p>
              <p>
                The idea: <IC>a^13 = a^(1101₂) = a^8 × a^4 × a^1</IC>. For each bit of exp (low to high),
                if the bit is 1 multiply the running result by the current base; always square the base
                (which corresponds to shifting to the next bit position). This eliminates redundant multiplications.
              </p>
              <p>
                <strong>Modular inverse</strong>: by Fermat's Little Theorem, for prime p:
                <IC>a^(p−1) ≡ 1 (mod p)</IC>, so <IC>a^(p−2) ≡ a^(−1) (mod p)</IC>.
                This lets you "divide" in modular arithmetic when mod is prime.
              </p>
            </Theory>
            <WhenToUse items={[
              'Compute a^n mod p efficiently (counting/DP problems with large answers)',
              'Modular inverse for division in modular arithmetic',
              'Matrix exponentiation for Fibonacci and linear recurrences in O(log n)',
              'Any problem asking for x^(10^18) or similar huge exponents',
            ]} />
            <Example title="3^13 mod 10^9+7">
              {'exp = 13 = 1101₂    result = 1    base = 3\n\nBit 0 is 1 → result = 1 × 3 = 3      | base = 9,   exp = 6\nBit 1 is 0 →                           | base = 81,  exp = 3\nBit 2 is 1 → result = 3 × 81 = 243   | base = 6561, exp = 1\nBit 3 is 1 → result = 243 × 6561     | exp = 0  → stop\n\n3^13 = 1594323  ✓'}
            </Example>
            <CodeBlock code={CODE_45} />
            <Related>Related: Problems/Recursion/Easy/PowXn.java · Problems/Recursion/Medium/PowXn.java · Problems/LogicBuilding/Medium/ModularExpressionofX.java</Related>
          </MathCard>

          {/* 4.6 Modular Arithmetic */}
          <MathCard id="s-modular" title="4.6 Modular Arithmetic" badge="mod 10⁹+7">
            <Theory>
              <p>
                When counting objects, answers can be astronomically large. Problems ask for the result
                <IC>mod 10⁹+7</IC> (a prime). Taking modulo keeps numbers in int/long range while preserving
                the structure of the answer.
              </p>
              <p>
                Key properties: <IC>(a + b) mod m = ((a mod m) + (b mod m)) mod m</IC> — same for multiplication.
                For subtraction always add m before taking mod to prevent a negative result.
              </p>
              <p>
                <IC>10⁹+7</IC> is chosen because it's a large prime and <IC>(10⁹+7)² &lt; Long.MAX_VALUE</IC>,
                so two values each below it can be multiplied in a <IC>long</IC> without overflow.
              </p>
            </Theory>
            <WhenToUse items={[
              'Any counting/DP problem where the answer can be huge: "… modulo 10⁹+7"',
              'Computing nCr, factorials, Catalan numbers for large n',
              'Multiplying intermediate sums that would overflow even a long',
              '"Divide" two modular values: multiply by the modular inverse instead',
            ]} />
            <Example title="Adding under mod  and  modular inverse">
              {'Add: (3 × 10^8 + 8 × 10^8) mod (10^9+7)\n  = (300000000 + 800000000) mod 1000000007\n  = 1100000000 mod 1000000007\n  = 99999993\n\nSubtract (must add MOD to avoid negative):\n  (2 - 5 + MOD) % MOD = (MOD - 3) % MOD  ✓\n\nDivide a by b mod p: multiply by b^(p-2) mod p'}
            </Example>
            <CodeBlock code={CODE_46} />
          </MathCard>

          {/* 4.7 Pascal / nCr */}
          <MathCard id="s-pascal" title="4.7 Pascal's Triangle and nCr mod prime">
            <Theory>
              <p>
                <strong>Pascal's identity</strong>: <IC>C(n,r) = C(n−1,r−1) + C(n−1,r)</IC>. Each entry in
                the triangle is the sum of the two directly above it. Row n of the triangle gives
                <IC>C(n,0), C(n,1), …, C(n,n)</IC>.
              </p>
              <p>
                The <strong>rolling-row trick</strong> computes C(n,r) in O(n·r) time using only O(r) space
                by updating the array right-to-left. Updating right-to-left ensures each cell uses the value
                from the <em>previous</em> row (not the partially updated current row).
              </p>
              <p>
                For large n with multiple nCr queries, precompute factorials and their modular inverses; then
                answer each query in O(1) with <IC>fact[n] × inv[r] × inv[n-r] mod p</IC>.
              </p>
            </Theory>
            <WhenToUse items={[
              'Counting paths, subsets, or combinations in DP problems',
              'Coin change / partition count variants involving binomial coefficients',
              'Probability problems: C(n,k) / 2^n mod p',
              'Stars-and-bars distribution: C(n+k-1, k)',
            ]} />
            <Example title="Pascal row build  for  C(4, 2)">
              {'Array C, size = r+1 = 3, start: C = [1, 0, 0]\n\ni=1: j=1: C[1] += C[0]  →  C = [1, 1, 0]\ni=2: j=2: C[2] += C[1]  →  C = [1, 1, 1]\n     j=1: C[1] += C[0]  →  C = [1, 2, 1]\ni=3: j=2: C[2] += C[1]  →  C = [1, 2, 3]\n     j=1: C[1] += C[0]  →  C = [1, 3, 3]\ni=4: j=2: C[2] += C[1]  →  C = [1, 3, 6]\n     j=1: C[1] += C[0]  →  C = [1, 4, 6]\n\nC[2] = 6 = C(4, 2)  ✓'}
            </Example>
            <CodeBlock code={CODE_47} />
            <Related>Related: Problems/LogicBuilding/Medium/nCr.java · Problems/Arrays/Hard/PascalTriangleI.java</Related>
          </MathCard>

          {/* 4.8 Catalan */}
          <MathCard id="s-catalan" title="4.8 Catalan Numbers">
            <Theory>
              <p>
                Catalan numbers count a surprisingly broad set of combinatorial structures — all from the
                same recurrence. The n-th Catalan number is: <IC>Cₙ = Σ C(i)·C(n−1−i)</IC> for i=0…n−1.
                Equivalently: <IC>Cₙ = C(2n, n) / (n+1)</IC>.
              </p>
              <p>
                <strong>Intuition for the recurrence</strong>: imagine the root of a BST with n nodes.
                If the root is node i+1 (1-indexed), there are i nodes in the left subtree and n−1−i in
                the right. The count for each subtree is independent, so we multiply and sum over all choices.
              </p>
              <p>
                Sequence: <IC>1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862, …</IC>
              </p>
            </Theory>
            <WhenToUse items={[
              'Count valid parenthesizations / bracket sequences of length 2n',
              'Number of distinct BSTs with n keys (LeetCode #96)',
              'Ways to triangulate a convex polygon with n+2 sides',
              'Number of monotonic lattice paths from (0,0) to (n,n) that stay below the diagonal',
              'Non-crossing handshakes between 2n people arranged in a circle',
            ]} />
            <Example title="C(5) = 42  and  valid bracket sequences for n=3">
              {'First 8 values:  C(0)=1  C(1)=1  C(2)=2  C(3)=5\n                 C(4)=14 C(5)=42 C(6)=132\n\nC(3) = 5  →  valid sequences with 3 pairs:\n  ((()))   (()())   (())()   ()(())   ()()()'}
            </Example>
            <CodeBlock code={CODE_48} />
            <Related>Related: Problems/LogicBuilding/Medium/CatalanNumber.java · Problems/GoodProblems/CatalanNumber.java</Related>
          </MathCard>

          {/* 4.9 Fibonacci */}
          <MathCard id="s-fib" title="4.9 Fibonacci Numbers" badge="O(n) iterative · O(log n) matrix">
            <Theory>
              <p>
                <IC>F(0)=0, F(1)=1, F(n) = F(n−1) + F(n−2)</IC>. The sequence grows exponentially
                (each term ≈ 1.618× the previous), so values overflow even <IC>long</IC> around F(93).
              </p>
              <p>
                <strong>Critical pitfall</strong>: naive recursion recomputes the same subproblems exponentially.
                F(50) makes 2²⁰ calls with plain recursion — always use the iterative version or add memoization.
              </p>
              <p>
                <strong>Matrix trick</strong> for very large n:
                <IC>[[1,1],[1,0]]^n = [[F(n+1), F(n)], [F(n), F(n-1)]]</IC>. Use fast matrix exponentiation
                for O(log n). Golden ratio approximation: <IC>F(n) ≈ φⁿ / √5</IC> where φ ≈ 1.618.
              </p>
            </Theory>
            <WhenToUse items={[
              'Staircase / tiling problems (n stairs, climb 1 or 2 at a time = F(n+1))',
              'Count ways to tile a 2×n board with 1×2 dominoes',
              'Any problem where "ways to reach here" = sum of ways to reach previous two states',
              'Competitive programming with n up to 10^18: use matrix exponentiation',
            ]} />
            <Example title="F(7) = 13  (iterative trace)">
              {'F(0)=0, F(1)=1\ni=2: c=0+1=1,  a=1, b=1\ni=3: c=1+1=2,  a=1, b=2\ni=4: c=1+2=3,  a=2, b=3\ni=5: c=2+3=5,  a=3, b=5\ni=6: c=3+5=8,  a=5, b=8\ni=7: c=5+8=13, a=8, b=13\n\nF(7) = 13  ✓'}
            </Example>
            <CodeBlock code={CODE_49} />
            <Related>Related: Problems/Recursion/Easy/FibonacciNumber.java · Problems/DynamicProgramming/OneDArray/FibonacciNumbers.java</Related>
          </MathCard>

          {/* 4.10 Digit Manipulation */}
          <MathCard id="s-digits" title="4.10 Digit Manipulation">
            <Theory>
              <p>
                Digits are extracted <strong>right-to-left</strong> using <IC>n % 10</IC> (last digit) and
                <IC>n /= 10</IC> (remove it). Repeating this loop processes every digit in O(log₁₀ n).
              </p>
              <p>
                The number of digits in n is <IC>⌊log₁₀(n)⌋ + 1</IC>. To reverse an integer, accumulate
                digits into a new number: <IC>rev = rev * 10 + n % 10</IC>. Use <IC>long</IC> for the
                reversed value to detect overflow before casting back to int.
              </p>
              <p>
                <strong>Digital root</strong>: the single digit reached by repeatedly summing digits. For n &gt; 0,
                it equals <IC>1 + (n − 1) % 9</IC> in O(1) — no iteration needed.
              </p>
            </Theory>
            <WhenToUse items={[
              'Sum/product of digits, digit frequency count',
              'Palindrome number check (reverse and compare)',
              'Armstrong number: sum of each digit raised to power of #digits = n',
              'Digital root problems (always use the O(1) formula)',
              'Split a number into individual decimal digits for DP on digits',
            ]} />
            <Example title="primeFactors and Armstrong check">
              {'Digits of 12345 (right-to-left):  5, 4, 3, 2, 1\n\nArmstrong(153):\n  numDigits = 3\n  1³ + 5³ + 3³ = 1 + 125 + 27 = 153  ✓\n\nDigital root(9875):\n  1 + (9875 - 1) % 9  =  1 + 9874 % 9\n  9874 % 9 = 2   →  digital root = 3'}
            </Example>
            <CodeBlock code={CODE_410} />
            <Related>Related: Problems/LogicBuilding/Easy/ArmstrongNumber.java · Problems/Recursion/Easy/CountDigits.java</Related>
          </MathCard>

          {/* 4.11 Power of k */}
          <MathCard id="s-powk" title="4.11 Power of k Check">
            <Theory>
              <p>
                <strong>Power of 2</strong>: in binary, every power of 2 has exactly one 1-bit (e.g. 8 = 1000).
                The trick <IC>n &amp; (n−1)</IC> clears the lowest set bit. If the result is 0, only one bit
                was set — therefore n is a power of 2.
              </p>
              <p>
                <strong>Power of 3</strong>: the largest power of 3 fitting in an int is 3¹⁹ = 1,162,261,467.
                Every power of 3 divides 3¹⁹ (since all prime factors are 3), so check <IC>1162261467 % n == 0</IC>.
              </p>
              <p>
                <strong>Power of 4</strong>: must be a power of 2 (one bit set) AND that single bit must be
                at an <em>even</em> position (0, 2, 4 …). Mask <IC>0xAAAAAAAA</IC> has bits at odd positions,
                so ANDing with it must give 0.
              </p>
            </Theory>
            <WhenToUse items={[
              'Power of 2: check without a loop, O(1) — used in bit manipulation problems',
              'Power of 3/4/5: O(1) when the range is fixed (int/long)',
              'Often combined: "if n is a power of 2, find which power" → Integer.numberOfTrailingZeros(n)',
            ]} />
            <Example title="Bit traces">
              {'isPow2(8):  8 = 1000,  8-1 = 0111,  8 & 7 = 0000  →  true  ✓\nisPow2(6):  6 = 0110,  6-1 = 0101,  6 & 5 = 0100  →  false ✓\n\nisPow4(16): isPow2(16) ✓  and  16 & 0xAAAAAAAA\n  0x00000010 & 0xAAAAAAAA = 0x00000000  →  true  ✓\nisPow4(8):  isPow2(8) ✓   but  8 & 0xAAAAAAAA\n  0x00001000 & 0xAAAAAAAA = 0x00001000  ≠ 0  →  false ✓'}
            </Example>
            <CodeBlock code={CODE_411} />
            <Related>Related: Problems/BitManipulation/Basics/CheckIfPowerOfTwo.java</Related>
          </MathCard>

          {/* 4.12 Combinatorics */}
          <MathCard id="s-comb" title="4.12 Combinatorics Essentials">
            <Theory>
              <p>
                <strong>Permutations P(n,r)</strong>: ordered selection of r from n. n choices for 1st, n−1 for 2nd, …
              </p>
              <p>
                <strong>Combinations C(n,r)</strong>: unordered selection. Divide P(n,r) by r! to remove all orderings of the chosen r items.
              </p>
              <p>
                <strong>Stars and bars</strong>: distributing k identical items into n distinct bins (bins may be empty)
                = <IC>C(n+k−1, k)</IC>. Think of it as placing k stars and n−1 dividers in a row of k+n−1 positions.
              </p>
              <p>
                <strong>Derangements</strong> D(n): permutations where no element stays in its original position.
                D(1)=0, D(2)=1. Recurrence: <IC>D(n) = (n−1)(D(n−2) + D(n−1))</IC>. Alternative: <IC>D(n) = n! × Σ((-1)^k / k!)</IC>.
              </p>
            </Theory>
            <WhenToUse items={[
              'C(n,r): "choose k items from n" — subset count, handshake count',
              'Stars-and-bars: distribute coins/balls into bins with no upper bound',
              'Derangements: "no one gets their own hat" (matching problems)',
              'P(n,r): ordered arrangements, e.g. top-3 from 10 runners',
            ]} />
            <Example title="Stars and bars: 3 coins into 4 wallets">
              {'k = 3 coins,  n = 4 wallets (bins)\nAnswer = C(n+k-1, k) = C(4+3-1, 3) = C(6, 3) = 20\n\nDerangements of [1,2,3]:\nD(3) = (3-1)(D(1) + D(2)) = 2 × (0 + 1) = 2\nThe 2 derangements: [2,3,1] and [3,1,2]'}
            </Example>
            <CheatTable headers={['Formula', 'Meaning']}>
              <TR cells={[<>{c('P(n, r) = n! / (n−r)!')}</>, 'Ordered selection of r items from n']} />
              <TR cells={[<>{c('C(n, r) = n! / (r! · (n−r)!)')}</>, 'Unordered selection (binomial coefficient)']} />
              <TR cells={[<>{c('C(n+k−1, k)')}</>, 'Stars-and-bars: k identical items into n distinct bins']} />
              <TR cells={[<>{c('D(n) = (n−1)(D(n−2) + D(n−1))')}</>, 'Derangements: permutations with no fixed point']} />
            </CheatTable>
          </MathCard>

        </section>

        <footer className="text-center text-xs text-gray-700 pt-6 border-t border-[#21262d]">
          Interview Prep Tracker · Java DSA Cheat Sheet · Add more cheat sheets here as you progress
        </footer>
      </main>
    </div>
  );
}
