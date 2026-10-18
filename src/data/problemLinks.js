// Every URL in this file was checked: LeetCode slugs against LeetCode's API (number must match),
// NeetCode / LintCode / Code360 pages rendered in a browser, GFG and article pages fetched for a real title.
const LC = 'https://leetcode.com/problems/';
const NC = 'https://neetcode.io/problems/';
const GFGP = 'https://www.geeksforgeeks.org/problems/';
const GFG = 'https://www.geeksforgeeks.org/';
const LINT = 'https://www.lintcode.com/problem/';
const ALLD = 'https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/';
const AM = 'https://algomaster.io/learn/';
const AMB = 'https://blog.algomaster.io/p/';
const TIH = 'https://www.techinterviewhandbook.org/';
const YT = 'https://www.youtube.com/watch?v=';

// LeetCode problem number → slug
const LEETCODE = {
  1: 'two-sum', 2: 'add-two-numbers', 3: 'longest-substring-without-repeating-characters',
  4: 'median-of-two-sorted-arrays', 5: 'longest-palindromic-substring', 8: 'string-to-integer-atoi',
  11: 'container-with-most-water', 15: '3sum', 16: '3sum-closest', 18: '4sum',
  19: 'remove-nth-node-from-end-of-list', 20: 'valid-parentheses', 21: 'merge-two-sorted-lists',
  22: 'generate-parentheses', 23: 'merge-k-sorted-lists', 25: 'reverse-nodes-in-k-group',
  26: 'remove-duplicates-from-sorted-array', 28: 'find-the-index-of-the-first-occurrence-in-a-string',
  29: 'divide-two-integers', 31: 'next-permutation', 33: 'search-in-rotated-sorted-array',
  35: 'search-insert-position', 37: 'sudoku-solver', 39: 'combination-sum', 40: 'combination-sum-ii',
  41: 'first-missing-positive', 42: 'trapping-rain-water', 44: 'wildcard-matching', 45: 'jump-game-ii',
  46: 'permutations', 47: 'permutations-ii', 48: 'rotate-image', 49: 'group-anagrams', 50: 'powx-n',
  51: 'n-queens', 53: 'maximum-subarray', 54: 'spiral-matrix', 55: 'jump-game', 56: 'merge-intervals',
  57: 'insert-interval', 60: 'permutation-sequence', 62: 'unique-paths', 68: 'text-justification', 69: 'sqrtx',
  70: 'climbing-stairs', 72: 'edit-distance', 73: 'set-matrix-zeroes', 74: 'search-a-2d-matrix',
  75: 'sort-colors', 76: 'minimum-window-substring', 77: 'combinations', 78: 'subsets', 79: 'word-search',
  80: 'remove-duplicates-from-sorted-array-ii', 81: 'search-in-rotated-sorted-array-ii',
  82: 'remove-duplicates-from-sorted-list-ii', 84: 'largest-rectangle-in-histogram', 85: 'maximal-rectangle',
  90: 'subsets-ii', 92: 'reverse-linked-list-ii', 96: 'unique-binary-search-trees', 97: 'interleaving-string',
  98: 'validate-binary-search-tree', 100: 'same-tree', 102: 'binary-tree-level-order-traversal',
  103: 'binary-tree-zigzag-level-order-traversal', 104: 'maximum-depth-of-binary-tree',
  105: 'construct-binary-tree-from-preorder-and-inorder-traversal',
  110: 'balanced-binary-tree', 112: 'path-sum', 113: 'path-sum-ii', 114: 'flatten-binary-tree-to-linked-list',
  115: 'distinct-subsequences', 118: 'pascals-triangle', 121: 'best-time-to-buy-and-sell-stock',
  123: 'best-time-to-buy-and-sell-stock-iii', 124: 'binary-tree-maximum-path-sum', 127: 'word-ladder',
  128: 'longest-consecutive-sequence', 131: 'palindrome-partitioning', 132: 'palindrome-partitioning-ii',
  133: 'clone-graph', 134: 'gas-station', 135: 'candy', 136: 'single-number', 137: 'single-number-ii',
  138: 'copy-list-with-random-pointer', 139: 'word-break', 141: 'linked-list-cycle',
  142: 'linked-list-cycle-ii', 143: 'reorder-list', 146: 'lru-cache', 148: 'sort-list',
  152: 'maximum-product-subarray', 153: 'find-minimum-in-rotated-sorted-array', 155: 'min-stack',
  159: 'longest-substring-with-at-most-two-distinct-characters', 162: 'find-peak-element',
  165: 'compare-version-numbers', 167: 'two-sum-ii-input-array-is-sorted', 169: 'majority-element',
  173: 'binary-search-tree-iterator', 187: 'repeated-dna-sequences', 191: 'number-of-1-bits',
  198: 'house-robber', 199: 'binary-tree-right-side-view', 200: 'number-of-islands', 206: 'reverse-linked-list',
  207: 'course-schedule', 208: 'implement-trie-prefix-tree', 210: 'course-schedule-ii',
  211: 'design-add-and-search-words-data-structure', 212: 'word-search-ii', 213: 'house-robber-ii',
  214: 'shortest-palindrome', 215: 'kth-largest-element-in-an-array', 217: 'contains-duplicate',
  218: 'the-skyline-problem', 226: 'invert-binary-tree', 229: 'majority-element-ii',
  230: 'kth-smallest-element-in-a-bst', 231: 'power-of-two', 232: 'implement-queue-using-stacks',
  235: 'lowest-common-ancestor-of-a-binary-search-tree', 236: 'lowest-common-ancestor-of-a-binary-tree',
  238: 'product-of-array-except-self', 239: 'sliding-window-maximum', 240: 'search-a-2d-matrix-ii',
  242: 'valid-anagram', 260: 'single-number-iii', 268: 'missing-number', 269: 'alien-dictionary',
  282: 'expression-add-operators', 283: 'move-zeroes', 287: 'find-the-duplicate-number',
  295: 'find-median-from-data-stream', 297: 'serialize-and-deserialize-binary-tree',
  300: 'longest-increasing-subsequence', 305: 'number-of-islands-ii', 312: 'burst-balloons',
  316: 'remove-duplicate-letters', 322: 'coin-change', 329: 'longest-increasing-path-in-a-matrix',
  334: 'increasing-triplet-subsequence', 338: 'counting-bits', 347: 'top-k-frequent-elements',
  373: 'find-k-pairs-with-smallest-sums', 378: 'kth-smallest-element-in-a-sorted-matrix',
  399: 'evaluate-division', 402: 'remove-k-digits', 410: 'split-array-largest-sum',
  416: 'partition-equal-subset-sum', 417: 'pacific-atlantic-water-flow',
  421: 'maximum-xor-of-two-numbers-in-an-array', 424: 'longest-repeating-character-replacement',
  430: 'flatten-a-multilevel-doubly-linked-list', 435: 'non-overlapping-intervals',
  438: 'find-all-anagrams-in-a-string', 450: 'delete-node-in-a-bst',
  452: 'minimum-number-of-arrows-to-burst-balloons', 459: 'repeated-substring-pattern', 460: 'lfu-cache',
  496: 'next-greater-element-i', 503: 'next-greater-element-ii', 505: 'the-maze-ii', 518: 'coin-change-ii',
  525: 'contiguous-array', 540: 'single-element-in-a-sorted-array', 542: '01-matrix',
  543: 'diameter-of-binary-tree', 547: 'number-of-provinces', 560: 'subarray-sum-equals-k',
  567: 'permutation-in-string', 621: 'task-scheduler', 632: 'smallest-range-covering-elements-from-k-lists',
  662: 'maximum-width-of-binary-tree', 673: 'number-of-longest-increasing-subsequence',
  684: 'redundant-connection', 686: 'repeated-string-match', 692: 'top-k-frequent-words',
  695: 'max-area-of-island', 721: 'accounts-merge', 727: 'minimum-window-subsequence', 733: 'flood-fill',
  735: 'asteroid-collision', 739: 'daily-temperatures', 743: 'network-delay-time', 778: 'swim-in-rising-water',
  785: 'is-graph-bipartite', 787: 'cheapest-flights-within-k-stops', 802: 'find-eventual-safe-states',
  827: 'making-a-large-island', 860: 'lemonade-change', 862: 'shortest-subarray-with-sum-at-least-k',
  875: 'koko-eating-bananas', 876: 'middle-of-the-linked-list', 901: 'online-stock-span',
  904: 'fruit-into-baskets', 907: 'sum-of-subarray-minimums', 930: 'binary-subarrays-with-sum',
  947: 'most-stones-removed-with-same-row-or-column', 973: 'k-closest-points-to-origin',
  974: 'subarray-sums-divisible-by-k', 977: 'squares-of-a-sorted-array',
  987: 'vertical-order-traversal-of-a-binary-tree', 992: 'subarrays-with-k-different-integers',
  994: 'rotting-oranges', 1004: 'max-consecutive-ones-iii', 1011: 'capacity-to-ship-packages-within-d-days',
  1020: 'number-of-enclaves', 1029: 'two-city-scheduling', 1081: 'smallest-subsequence-of-distinct-characters',
  1091: 'shortest-path-in-binary-matrix', 1106: 'parsing-a-boolean-expression',
  1143: 'longest-common-subsequence', 1235: 'maximum-profit-in-job-scheduling',
  1248: 'count-number-of-nice-subarrays', 1269: 'number-of-ways-to-stay-in-the-same-place-after-some-steps',
  1312: 'minimum-insertion-steps-to-make-a-string-palindrome',
  1319: 'number-of-operations-to-make-network-connected',
  1334: 'find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance',
  1358: 'number-of-substrings-containing-all-three-characters', 1514: 'path-with-maximum-probability',
  1584: 'min-cost-to-connect-all-points', 1631: 'path-with-minimum-effort', 1696: 'jump-game-vi',
  1707: 'maximum-xor-with-an-element-from-array', 1976: 'number-of-ways-to-arrive-at-destination',
  2064: 'minimized-maximum-of-products-distributed-to-any-store', 2104: 'sum-of-subarray-ranges',
};

// LeetCode problem number → NeetCode slug (only problems NeetCode actually hosts)
const NEETCODE = {
  1: 'two-integer-sum', 2: 'add-two-numbers', 3: 'longest-substring-without-duplicates',
  4: 'median-of-two-sorted-arrays', 5: 'longest-palindromic-substring', 11: 'max-water-container',
  15: 'three-integer-sum', 18: '4sum', 19: 'remove-node-from-end-of-linked-list', 20: 'validate-parentheses',
  21: 'merge-two-sorted-linked-lists', 22: 'generate-parentheses', 23: 'merge-k-sorted-linked-lists',
  25: 'reverse-nodes-in-k-group', 26: 'remove-duplicates-from-sorted-array',
  28: 'find-the-index-of-the-first-occurrence-in-a-string', 31: 'next-permutation',
  33: 'find-target-in-rotated-sorted-array', 35: 'search-insert-position', 39: 'combination-target-sum',
  40: 'combination-target-sum-ii', 42: 'trapping-rain-water', 45: 'jump-game-ii', 46: 'permutations',
  47: 'permutations-ii', 48: 'rotate-matrix', 49: 'anagram-groups', 50: 'pow-x-n', 51: 'n-queens',
  53: 'maximum-subarray', 54: 'spiral-matrix', 55: 'jump-game', 56: 'merge-intervals',
  57: 'insert-new-interval', 62: 'count-paths', 68: 'text-justification', 70: 'climbing-stairs',
  72: 'edit-distance', 73: 'set-zeroes-in-matrix', 74: 'search-2d-matrix', 75: 'sort-colors',
  76: 'minimum-window-with-characters', 77: 'combinations', 78: 'subsets', 79: 'search-for-word',
  80: 'remove-duplicates-from-sorted-array-ii', 81: 'search-in-rotated-sorted-array-ii',
  84: 'largest-rectangle-in-histogram', 90: 'subsets-ii', 92: 'reverse-linked-list-ii',
  97: 'interleaving-string', 98: 'valid-binary-search-tree', 100: 'same-binary-tree',
  102: 'level-order-traversal-of-binary-tree', 103: 'binary-tree-zigzag-level-order-traversal',
  104: 'depth-of-binary-tree', 105: 'binary-tree-from-preorder-and-inorder-traversal',
  110: 'balanced-binary-tree', 112: 'path-sum', 115: 'count-subsequences', 121: 'buy-and-sell-crypto',
  124: 'binary-tree-maximum-path-sum', 127: 'word-ladder', 128: 'longest-consecutive-sequence',
  131: 'palindrome-partitioning', 133: 'clone-graph', 134: 'gas-station', 135: 'candy', 136: 'single-number',
  138: 'copy-linked-list-with-random-pointer', 139: 'word-break', 141: 'linked-list-cycle-detection',
  143: 'reorder-linked-list', 146: 'lru-cache', 148: 'sort-list', 152: 'maximum-product-subarray',
  153: 'find-minimum-in-rotated-sorted-array', 155: 'minimum-stack', 162: 'find-peak-element',
  167: 'two-integer-sum-ii', 169: 'majority-element', 173: 'binary-search-tree-iterator',
  187: 'repeated-dna-sequences', 191: 'number-of-one-bits', 198: 'house-robber',
  199: 'binary-tree-right-side-view', 200: 'count-number-of-islands', 206: 'reverse-a-linked-list',
  207: 'course-schedule', 208: 'implement-prefix-tree', 210: 'course-schedule-ii',
  211: 'design-word-search-data-structure', 212: 'search-for-word-ii', 213: 'house-robber-ii',
  214: 'shortest-palindrome', 215: 'kth-largest-element-in-an-array', 217: 'duplicate-integer',
  226: 'invert-a-binary-tree', 229: 'majority-element-ii', 230: 'kth-smallest-integer-in-bst',
  232: 'implement-queue-using-stacks', 235: 'lowest-common-ancestor-in-binary-search-tree',
  236: 'lowest-common-ancestor-of-a-binary-tree', 238: 'products-of-array-discluding-self',
  239: 'sliding-window-maximum', 242: 'is-anagram', 260: 'single-number-iii', 268: 'missing-number',
  269: 'foreign-dictionary', 283: 'move-zeroes', 287: 'find-duplicate-integer',
  295: 'find-median-in-a-data-stream', 297: 'serialize-and-deserialize-binary-tree',
  300: 'longest-increasing-subsequence', 312: 'burst-balloons', 322: 'coin-change',
  329: 'longest-increasing-path-in-matrix', 338: 'counting-bits', 347: 'top-k-elements-in-list',
  399: 'evaluate-division', 402: 'remove-k-digits', 410: 'split-array-largest-sum',
  416: 'partition-equal-subset-sum', 417: 'pacific-atlantic-water-flow',
  424: 'longest-repeating-substring-with-replacement', 435: 'non-overlapping-intervals',
  438: 'find-all-anagrams-in-a-string', 450: 'delete-node-in-a-bst',
  452: 'minimum-number-of-arrows-to-burst-balloons', 460: 'lfu-cache', 496: 'next-greater-element-i',
  518: 'coin-change-ii', 525: 'contiguous-array', 540: 'single-element-in-a-sorted-array',
  543: 'binary-tree-diameter', 547: 'number-of-provinces', 560: 'subarray-sum-equals-k',
  567: 'permutation-string', 621: 'task-scheduling', 632: 'smallest-range-covering-elements-from-k-lists',
  662: 'maximum-width-of-binary-tree', 673: 'number-of-longest-increasing-subsequence',
  684: 'redundant-connection', 695: 'max-area-of-island', 721: 'accounts-merge', 733: 'flood-fill',
  735: 'asteroid-collision', 739: 'daily-temperatures', 743: 'network-delay-time', 778: 'swim-in-rising-water',
  785: 'is-graph-bipartite', 787: 'cheapest-flight-path', 802: 'find-eventual-safe-states',
  827: 'making-a-large-island', 860: 'lemonade-change', 862: 'shortest-subarray-with-sum-at-least-k',
  875: 'eating-bananas', 876: 'middle-of-the-linked-list', 901: 'online-stock-span', 904: 'fruit-into-baskets',
  907: 'sum-of-subarray-minimums', 930: 'binary-subarrays-with-sum', 973: 'k-closest-points-to-origin',
  974: 'subarray-sums-divisible-by-k', 977: 'squares-of-a-sorted-array',
  992: 'subarrays-with-k-different-integers', 994: 'rotting-fruit', 1004: 'max-consecutive-ones-iii',
  1011: 'capacity-to-ship-packages-within-d-days', 1020: 'number-of-enclaves', 1029: 'two-city-scheduling',
  1091: 'shortest-path-in-binary-matrix', 1106: 'parsing-a-boolean-expression',
  1143: 'longest-common-subsequence', 1235: 'maximum-profit-in-job-scheduling',
  1248: 'count-number-of-nice-subarrays',
  1334: 'find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance',
  1358: 'number-of-substrings-containing-all-three-characters', 1514: 'path-with-maximum-probability',
  1584: 'min-cost-to-connect-points', 1631: 'path-with-minimum-effort',
  1976: 'number-of-ways-to-arrive-at-destination',
};

// LeetCode Premium problems and their free alternatives on other platforms
const PREMIUM = new Set([159, 269, 305, 340, 505, 727]);
const FREE_VERSIONS = {
  159: [LINT + '928/'],
  269: [GFGP + 'alien-dictionary/1'],
  305: [LINT + '434/'],
  340: [LINT + '386/'],          // GFG slug returns 404 — LintCode only
  505: [LINT + '788/'],
  // 727 has no free equivalent — YouTube only
};

// Problems that have no LeetCode number, keyed by the exact label used in studyPlan.js
const NAMED_PROBLEMS = {
  'GCD and LCM (recursive)': [GFGP + 'gcd-of-two-numbers3459/1', GFGP + 'lcm-and-gcd4516/1'],
  'Prime Factorization': [GFGP + 'prime-factors5052/1'],
  'Armstrong Number': [GFGP + 'armstrong-numbers2727/1'],
  'Base Conversion (decimal ↔ binary)': [GFGP + 'decimal-to-binary-1587115620/1'],
  'Modular Exponentiation': [GFGP + 'modular-exponentiation-for-large-numbers5537/1'],
  'nCr modulo prime': [GFGP + 'ncr1019/1'],
  'Catalan Number (n-th Catalan)': [GFGP + 'nth-catalan-number0817/1', LC + 'unique-binary-search-trees/'],
  'Count Nice Subarrays (exactly K odd numbers)': [LC + 'count-number-of-nice-subarrays/', NC + 'count-number-of-nice-subarrays'],
  'Missing and Repeating Number': [GFGP + 'find-missing-and-repeating2512/1'],
  'Largest Subarray with Zero Sum': [GFGP + 'largest-subarray-with-0-sum/1'],
  'Count Subarrays with XOR = K': [GFGP + 'count-subarray-with-given-xor/1'],
  'Book Allocation': [GFGP + 'allocate-minimum-number-of-pages0937/1'],
  'Aggressive Cows': [GFGP + 'aggressive-cows/1'],
  'Maximum of Minimums of Every Window': [GFGP + 'maximum-of-minimum-for-every-window-size3453/1'],
  'Celebrity Problem': [GFGP + 'the-celebrity-problem/1'],
  'Infix to Postfix': [GFGP + 'infix-to-postfix-1587115620/1'],
  'Connect N Ropes with Minimum Cost': [GFGP + 'minimum-cost-of-ropes-1587115620/1'],
  'Sort a K-Sorted Array': [GFGP + 'nearly-sorted-1587115620/1'],
  'Detect Cycle in Undirected Graph (BFS)': [GFGP + 'detect-cycle-in-an-undirected-graph/1'],
  'Detect Cycle in Directed Graph (DFS)': [GFGP + 'detect-cycle-in-a-directed-graph/1'],
  "Kruskal's MST": [GFGP + 'minimum-spanning-tree/1', LC + 'min-cost-to-connect-all-points/', NC + 'min-cost-to-connect-points'],
  "Prim's MST": [GFGP + 'minimum-spanning-tree/1', LC + 'min-cost-to-connect-all-points/', NC + 'min-cost-to-connect-points'],
  "Dijkstra's Algorithm": [GFGP + 'implementing-dijkstra-set-1-adjacency-matrix/1'],
  'Bellman-Ford Algorithm': [GFGP + 'distance-from-the-source-bellman-ford-algorithm/1'],
  'Floyd-Warshall All-Pairs': [GFGP + 'implementing-floyd-warshall2042/1'],
  'Trie II (with prefix count)': ['https://www.naukri.com/code360/problems/implement-trie_1387095'],
  'Count Distinct Substrings (Suffix Trie)': [GFGP + 'count-of-distinct-substrings/1'],
  'Fractional Knapsack': [GFGP + 'fractional-knapsack-1587115620/1'],
  'N Meetings in One Room': [GFGP + 'activity-selection-1587115620/1'],
  'Minimum Platforms': [GFGP + 'minimum-platforms-1587115620/1'],
  'Job Sequencing Problem': [GFGP + 'job-sequencing-problem-1587115620/1'],
  'Power Set using bitmask': [LC + 'subsets/', GFGP + 'power-set4302/1'],
  'Row with Maximum Ones': [GFGP + 'row-with-max-1s0023/1'],
  'Median in Row-Sorted Matrix': [GFGP + 'median-in-a-row-wise-sorted-matrix1527/1'],
  'Search Pattern (Rabin-Karp)': [GFGP + 'search-pattern-rabin-karp-algorithm--141631/1'],
};

// Checklist items that are best practised on a problem list rather than a single problem
const PRACTICE_LINKS = {
  '2 unseen Medium problems (45 min strict)': ['https://leetcode.com/problemset/?difficulty=MEDIUM'],
  '2 LeetCode Medium-Hard problems': ['https://leetcode.com/problemset/?difficulty=MEDIUM'],
  'Review incorrect problems from earlier days': ['https://leetcode.com/problemset/'],
};

const PLATFORMS = [
  [/leetcode\.com/, 'LeetCode'],
  [/neetcode\.io/, 'NeetCode'],
  [/geeksforgeeks\.org/, 'GFG'],
  [/naukri\.com\/code360/, 'Code360'],
  [/lintcode\.com/, 'LintCode'],
  [/youtube\.com/, 'YouTube'],
  [/github\.com/, 'GitHub'],
  [/algomaster\.io/, 'AlgoMaster'],
  [/techinterviewhandbook\.org/, 'Tech Interview Handbook'],
];
export const platformOf = (url) => PLATFORMS.find(([re]) => re.test(url))?.[1] || 'Article';

// Link priority order: LeetCode (free) → NeetCode → Naukri/Code360 → LintCode → GFG / others
// Lower value = shown first.
const urlPriority = (url) => {
  if (url.startsWith(LC))              return 0; // LeetCode (free)
  if (url.startsWith(NC))              return 1; // NeetCode
  if (url.includes('naukri.com'))      return 2; // Naukri Code360
  if (url.startsWith(LINT))            return 3; // LintCode
  return 4;                                       // GFG, GitHub, articles, etc.
};

const cleanName = (label) => label.replace(/^#\d+\s*/, '').replace(/\s*\(.*?\)\s*/g, ' ').trim();

/**
 * Return links for one problem label in platform-priority order.
 *
 * Rules (per user request):
 *  1. Always try LC first — but ONLY if the problem is free there.
 *  2. Then NeetCode.
 *  3. Then Naukri / Code360.
 *  4. GFG, LintCode, etc. ONLY when the problem is absent from LC or is behind a paywall.
 *
 * For numbered problems (#N label):
 *   - Non-premium: show LC + NC. No other platforms needed.
 *   - Premium:     skip LC entirely; NC first, then sorted free alternatives.
 *
 * For named problems (no #N):
 *   - Sort all listed URLs by priority so LC → NC → Code360 → LintCode → GFG.
 */
export const getProblemLinks = (label) => {
  if (!label || typeof label !== 'string') return [];
  const num = Number(label.match(/^#(\d+)\s/)?.[1]);

  // Practice-set labels get a direct link to the problem list page
  if (PRACTICE_LINKS[label]) return PRACTICE_LINKS[label].map(url => ({ platform: platformOf(url), url, kind: 'practice' }));

  const urls = [];

  if (num) {
    if (!PREMIUM.has(num)) {
      // ── Free on LeetCode ──────────────────────────────────────────────────
      // LC first, NC second. GFG / LintCode not needed — LC has it for free.
      if (LEETCODE[num]) urls.push(LC + LEETCODE[num] + '/');
      if (NEETCODE[num]) urls.push(NC + NEETCODE[num]);
    } else {
      // ── Premium on LeetCode — skip LC, use free alternatives ──────────────
      // NC first (usually has it), then Naukri → LintCode → GFG.
      if (NEETCODE[num]) urls.push(NC + NEETCODE[num]);
      if (FREE_VERSIONS[num]) {
        const sorted = [...FREE_VERSIONS[num]].sort((a, b) => urlPriority(a) - urlPriority(b));
        urls.push(...sorted);
      }
    }
  }

  if (NAMED_PROBLEMS[label]) {
    // Sort so LC → NC → Code360 → LintCode → GFG regardless of insertion order
    const sorted = [...NAMED_PROBLEMS[label]].sort((a, b) => urlPriority(a) - urlPriority(b));
    urls.push(...sorted);
  }

  if (!urls.length) return [];

  const links = [...new Set(urls)].map(url => ({ platform: platformOf(url), url, kind: 'practice' }));
  const query = `${cleanName(label)} ${num ? 'leetcode ' : ''}solution`;
  links.push({ platform: 'YouTube', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, kind: 'video' });
  return links;
};

export const getProblemUrl = (label) => getProblemLinks(label)[0]?.url ?? null;

// Study material per task, keyed by exact task title in studyPlan.js
const R = {
  bigO: ['Big-O cheat sheet', 'https://www.bigocheatsheet.com/'],
  dsaCheat: ['DSA study cheatsheets', TIH + 'algorithms/study-cheatsheet/'],
  ncRoadmap: ['NeetCode roadmap', 'https://neetcode.io/roadmap'],
  lldAnswer: ['How to answer an LLD interview problem', AMB + 'how-to-answer-a-lld-interview-problem'],
  solid: ['SOLID principles with code', AMB + 'solid-principles-explained-with-code'],
  lldRepo: ['Awesome Low Level Design (problem list)', 'https://github.com/ashishps1/awesome-low-level-design'],
  singleton: ['Singleton pattern', AM + 'lld/singleton'],
  strategy: ['Strategy pattern', AM + 'lld/strategy'],
  state: ['State pattern', AM + 'lld/state'],
  observer: ['Observer pattern', AM + 'lld/observer'],
  command: ['Command pattern', AM + 'lld/command'],
  memento: ['Memento pattern', AM + 'lld/memento'],
  cor: ['Chain of Responsibility pattern', AM + 'lld/chain-of-responsibility'],
  composite: ['Composite pattern', AM + 'lld/composite'],
  factory: ['Factory Method pattern', AM + 'lld/factory-method'],
  reentrant: ['Reentrant locks', AM + 'concurrency-interview/reentrant-locks'],
  threadPool: ['Thread pool pattern', AM + 'concurrency-interview/thread-pool-pattern'],
  prodCons: ['Producer–consumer pattern', AM + 'concurrency-interview/producer-consumer-pattern'],
  sdAnswer: ['System design answering framework', AM + 'system-design-interviews/answering-framework'],
  sd30: ['30 system design concepts', AMB + '30-system-design-concepts'],
  primer: ['System Design Primer', 'https://github.com/donnemartin/system-design-primer'],
  behavioral: ['Behavioral interview guide', TIH + 'behavioral-interview/'],
  behavioralQs: ['30 most common behavioral questions', TIH + 'behavioral-interview-questions/'],
  star: ['STAR method explained', 'https://www.themuse.com/advice/star-interview-method'],
  selfIntro: ['Crafting your self introduction', TIH + 'self-introduction/'],
  finalQs: ['Questions to ask the interviewer', TIH + 'final-questions/'],
};
const lld = (file, label) => [label, ALLD + file];

const TASK_RESOURCES = {
  'Java, Complexity & Pattern Cheat Sheets': [R.bigO, R.dsaCheat, R.ncRoadmap],
  'Machine Coding Design Thinking Framework': [R.lldAnswer, R.solid, R.lldRepo],
  'L0.1 Tic Tac Toe': [lld('tic-tac-toe.md', 'Tic Tac Toe — LLD walkthrough')],
  'L0.2 Snake and Ladder': [lld('snake-and-ladder.md', 'Snake and Ladder — LLD walkthrough')],
  'L1.1 Parking Lot (Single Floor)': [lld('parking-lot.md', 'Parking Lot — LLD walkthrough'), R.singleton],
  'L1.2 Library Management System': [lld('library-management-system.md', 'Library Management — LLD walkthrough')],
  '6 Core LLD Patterns — Quick Reference Map': [R.singleton, R.strategy, R.state, R.observer, R.command, R.cor],
  'L1.3 Vending Machine (No State)': [lld('vending-machine.md', 'Vending Machine — LLD walkthrough')],
  'L1.5 LRU Cache — HashMap + Doubly Linked List': [lld('lru-cache.md', 'LRU Cache — LLD walkthrough'), ['LeetCode #146 LRU Cache', LC + 'lru-cache/']],
  'L2.1 Parking Lot Multi-floor + Strategy': [lld('parking-lot.md', 'Parking Lot — LLD walkthrough'), R.strategy, R.factory],
  'L2.2 Vending Machine with State Pattern': [lld('vending-machine.md', 'Vending Machine — LLD walkthrough'), R.state],
  'L2.3 Splitwise (Expense Splitting)': [lld('splitwise.md', 'Splitwise — LLD walkthrough'), R.strategy],
  'L2.4 Rate Limiter — Fixed / Sliding / Token Bucket': [['Rate limiting algorithms with code', AMB + 'rate-limiting-algorithms-explained-with-code'], R.strategy],
  'L3.1 Library Waitlist with Observer Pattern': [R.observer, lld('library-management-system.md', 'Library Management — LLD walkthrough')],
  'L3.2 Logger with Chain of Responsibility': [lld('logging-framework.md', 'Logging Framework — LLD walkthrough'), R.cor],
  'L3.3 Text Editor with Undo/Redo (Command + Memento)': [R.command, R.memento],
  'L3.6 Elevator System (State + Strategy)': [lld('elevator-system.md', 'Elevator System — LLD walkthrough'), R.state, R.strategy],
  'L4.3 Movie Ticket/Seat Booking (Concurrency)': [lld('movie-ticket-booking-system.md', 'Movie Ticket Booking — LLD walkthrough'), R.reentrant],
  'L4.4 Task Scheduler with Worker Threads': [R.threadPool, R.prodCons, lld('task-management-system.md', 'Task Management — LLD walkthrough')],
  'L4.6 Order Matching Engine (Stock Exchange)': [lld('online-stock-brokerage-system.md', 'Stock Brokerage — LLD walkthrough')],
  'L5.1 In-Memory File System (Composite Pattern)': [R.composite],
  'L5.5 Food Delivery End-to-End (State + Strategy + Observer)': [lld('food-delivery-service.md', 'Food Delivery — LLD walkthrough'), R.state, R.observer],
  'L5.6 ATM (State + Chain of Responsibility)': [lld('atm.md', 'ATM — LLD walkthrough'), R.state, R.cor],
  'LLD Mock Interview 1 (90 min timed)': [R.lldAnswer, R.lldRepo],
  'LLD Machine Coding Round (90 min timed)': [R.lldAnswer, R.lldRepo],

  'Scalability Fundamentals, Load Balancing & Consistent Hashing': [['Scalability', AM + 'system-design/scalability'], ['Load balancing algorithms', AMB + 'load-balancing-algorithms-explained-with-code'], ['Consistent hashing', AM + 'system-design/consistent-hashing']],
  'Caching Patterns — Cache-Aside, Write-Through, Eviction & Redis': [['Caching strategies', AM + 'system-design/caching-strategies'], ['7 cache eviction strategies', AMB + '7-cache-eviction-strategies'], ['CDN', AM + 'system-design/content-delivery-network-cdn']],
  'SQL vs NoSQL, CAP Theorem & Indexing Strategy': [['SQL vs NoSQL', AM + 'system-design/sql-vs-nosql'], ['CAP theorem', AM + 'system-design/cap-theorem'], ['Indexing', AM + 'system-design/indexing'], ['Sharding', AM + 'system-design/sharding'], ['ACID properties', GFG + 'dbms/acid-properties-in-dbms/']],
  'Kafka & Async Messaging Patterns': [['Message queues', AM + 'system-design/message-queues'], ['Pub/Sub', AM + 'system-design/pub-sub'], ['What is Apache Kafka?', GFG + 'apache-kafka/apache-kafka/'], ['Design a distributed message queue (video)', YT + 'iJLL-KPqBpM']],
  'Microservices Architecture & Resilience Patterns': [['API gateway', AMB + 'what-is-an-api-gateway'], ['Service discovery', AMB + 'service-discovery-in-distributed-systems'], ['Circuit breaker pattern', GFG + 'system-design/what-is-circuit-breaker-pattern-in-microservices/']],
  'REST API Design, Idempotency, Pagination & Rate Limiting': [['REST fundamentals', GFG + 'node-js/rest-api-introduction/'], ['Idempotency', AM + 'system-design/idempotency'], ['Rate limiting algorithms', AMB + 'rate-limiting-algorithms-explained-with-code']],
  'Back-of-the-Envelope Capacity Estimation': [['Back-of-the-envelope estimation', GFG + 'system-design/back-of-the-envelope-estimation-in-system-design/'], R.primer],
  'Design: URL Shortener (bit.ly)': [['Design URL shortener', AM + 'system-design-interviews/design-url-shortener'], ['Designing a tiny URL service', GFG + 'system-design/how-to-design-a-tiny-url-or-url-shortener/']],
  'Design: Twitter / News Feed': [['Designing Twitter', GFG + 'interview-experiences/design-twitter-a-system-design-interview-question/'], ['Design Twitter (video)', YT + 'wYk0xPP_P_8']],
  'Design: Notification System (Push / SMS / Email)': [['Design notification service', AM + 'system-design-interviews/design-notification-service']],
  'Design: Uber / Ride-Sharing Platform': [['Design Uber (video)', YT + 'umWABit-wbk']],
  'Design: WhatsApp / Real-Time Messaging': [['Design WhatsApp', AM + 'system-design-interviews/design-whatsapp']],
  'Distributed Cache — Concepts & Quick Design (20 min)': [['What is distributed caching?', AMB + 'distributed-caching'], ['Design a distributed cache (video)', YT + 'iuqZvajTOyA']],
  'Design: Search Autocomplete / Typeahead': [['Design an autocomplete / typeahead system', 'https://www.systemdesigninterview.com/guides/system-design-interview-handbook/814-design-an-autocompletetypeahead-system']],
  'Design: YouTube / Video Streaming Platform': [['Design YouTube (video)', YT + 'jPKTo1iGQiE'], ['Design Netflix (video)', YT + 'psQzyFfsUGU'], ['CDN', AM + 'system-design/content-delivery-network-cdn']],
  'Full HLD System Design Mock (60 min)': [R.sdAnswer, R.sd30, R.primer],
  'System Design Round (45 min timed)': [R.sdAnswer, R.primer],

  'STAR Framework — First Leadership Story (20 min)': [R.star, R.behavioral],
  'Ownership & Influence Stories (20 min)': [R.behavioral, R.behavioralQs],
  'Leadership Under Pressure — Deadline Stories (20 min)': [R.behavioralQs],
  'Conflict & Disagreement Stories (15 min)': [R.behavioralQs],
  'Failure, Risk & Growth Stories (20 min)': [R.behavioralQs],
  'Impact & Achievement Stories (20 min)': [R.behavioralQs],
  'Impact, Initiative & Cross-Functional Stories (25 min)': [R.selfIntro, R.behavioralQs],
  'Values-Based & Situational Questions (20 min)': [R.behavioralQs],
  'Final Behavioral Polish — All Stories Review (20 min)': [R.finalQs, R.behavioral],
  'Behavioral Mock Interview (30 min)': [R.behavioralQs, R.star],
  'Behavioral Round Simulation (30 min)': [R.behavioralQs, R.finalQs],
};

/** Study links for a whole task: [{ label, url, platform }] */
export const getTaskResources = (task) => {
  const list = TASK_RESOURCES[task.title] || (['Revision', 'Mock', 'Review'].includes(task.subcategory) ? [R.ncRoadmap, R.dsaCheat] : []);
  return list.map(([label, url]) => ({ label, url, platform: platformOf(url) }));
};
