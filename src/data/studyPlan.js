export const CATEGORY_COLORS = {
  DSA: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', hex: '#3b82f6', label: 'DSA' },
  LLD: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30', hex: '#10b981', label: 'LLD' },
  HLD: { bg: 'bg-violet-500/20', text: 'text-violet-300', border: 'border-violet-500/30', hex: '#8b5cf6', label: 'HLD' },
  Behavioral: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30', hex: '#f59e0b', label: 'Behavioral' },
};

// type 'weekend' = heavy content day (8–12 h). schedule.js maps these to actual Sat/Sun.
export const DAY_BUDGET = {
  weekday: { label: 'Weekday', hours: '4–5h', min: 240, max: 300 },
  weekend: { label: 'Weekend', hours: '8–12h', min: 480, max: 720 },
};

export const WEEKS = [
  { id: 1, title: 'Week 1', theme: 'Math · Arrays · Two Pointers · Sliding Window · Prefix Sum · LLD L0–L1 · HLD Basics', days: [1,2,3,4,5,6,7] },
  { id: 2, title: 'Week 2', theme: 'Binary Search · Stack · Deque · Linked List · Trees I · LLD L1–L2 · HLD Infra', days: [8,9,10,11,12,13,14] },
  { id: 3, title: 'Week 3', theme: 'Trees · Heap · Backtracking · Graphs · LLD L2–L3 · HLD Designs', days: [15,16,17,18,19,20,21] },
  { id: 4, title: 'Week 4', theme: 'Union-Find · Shortest Paths · Trie · Greedy · DP I · LLD L3–L4 · HLD Systems', days: [22,23,24,25,26,27,28] },
  { id: 5, title: 'Week 5', theme: 'DP · Bits · Matrix · Strings · LLD L4–L5 · Full Mocks', days: [29,30,31,32,33,34,35] },
];

// Realistic solve time per DSA problem (incl. reading, coding, testing) + 15 min pattern review per task.
const PER_PROBLEM_MIN = { Easy: 20, Medium: 30, Hard: 40 };

export const formatMinutes = (m) => m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}`;

const t = (cat, sub, title, desc, diff, minutes, problems = [], must = false) => ({
  id: `${cat.toLowerCase().replace(/\W+/g,'')}-${title.slice(0,25).replace(/\W+/g,'-').toLowerCase()}`,
  category: cat,
  subcategory: sub,
  title,
  description: desc,
  difficulty: diff,
  estimatedMinutes: minutes,
  estimatedTime: formatMinutes(minutes),
  problems,
  must,
  done: false,
});

const dsa = (sub, title, desc, diff, problems) =>
  t('DSA', sub, title, desc, diff, 15 + problems.length * PER_PROBLEM_MIN[diff], problems, true);

const revision = (week, minutes, focus) =>
  t('DSA', 'Revision', `Week ${week} Revision — Blind Re-solve`,
    `Pick problems from this week WITHOUT looking at your old code. Re-solve, then diff against your earlier solution. Log every mistake in a one-line note next to the pattern. ${focus}`,
    'Review', minutes, ['Re-solve 3–4 problems you marked shaky this week','Re-read Common Mistakes for each pattern covered','Update your one-line "key insight" note per pattern'], false);

const dsaMock = (n, focus) =>
  t('DSA', 'Mock', `Timed DSA Mock #${n}`,
    `45-minute timed round, 2 unseen problems from patterns already covered (${focus}). Think aloud, state complexity, test 2 edge cases. 15 min post-mortem.`,
    'Mock', 60, ['2 unseen Medium problems (45 min strict)','Explain time & space complexity aloud','Walk through edge cases: empty, single element, overflow','Post-mortem: what slowed you down?'], true);

const day = (d, theme, tasks) => ({
  day: d,
  week: Math.ceil(d / 7),
  type: d % 7 === 6 || d % 7 === 0 ? 'weekend' : 'weekday',
  theme,
  tasks: tasks.map(task => ({ ...task, day: d })),
  plannedMinutes: tasks.reduce((s, task) => s + task.estimatedMinutes, 0),
});

export const studyPlan = [
  // ═══════════════════════════════════════════════
  // WEEK 1: Math + Linear Patterns + LLD Level 0-1
  // ═══════════════════════════════════════════════
  day(1, 'Java Cheat Sheet + Math I + LLD Framework & Tic Tac Toe', [
    t('DSA','Foundations','Java, Complexity & Pattern Cheat Sheets',
      'Roadmap Parts 1–3. Skim the Java API cheat sheet (Strings, Arrays, Collections, Comparators, bit ops, pitfalls), memorize the input-size → complexity table, and read the pattern selection guide once end-to-end.',
      'Review',45,['Part 1: Java cheat sheet — pitfalls section twice','Part 2: n ≤ 10⁵ → O(n log n), n ≤ 10⁶ → O(n), etc.','Part 3: pattern selection guide — signal → pattern'],true),
    dsa('Math Foundations','Number Theory: GCD, Primes, Digits & Powers',
      'GCD: Euclid gcd(a,b)=gcd(b,a%b); LCM = (a/gcd)*b (divide first to avoid overflow). Primes: trial division up to i*i<=n (cast to long); Sieve of Eratosthenes O(n log log n) starting at i*i. Factorization: divide out each i while n%i==0, leftover n>1 is prime. Digits: n%10 / n/=10. Power of 2: n>0 && (n&(n-1))==0. Ceil div: (a+b-1)/b; circular index: Math.floorMod. Watch: Java % is negative for negative operands.',
      'Easy',['#231 Power of Two','#69 Sqrt(x)','GCD and LCM (recursive)','Prime Factorization','Armstrong Number','Base Conversion (decimal ↔ binary)']),
    t('LLD','Framework','Machine Coding Design Thinking Framework',
      'The 90-min template: (5min) Clarify scope → (10min) Entities + enums → (10min) Interfaces → (45min) Core happy-path → (15min) Edge cases → (5min) Extensibility. Always enumerate ALL states/enums before writing a single line of logic.',
      'Theory',30,['90-min phase breakdown with time budget','SOLID checklist: SRP, OCP, LSP, ISP, DIP — one-line definition each','Enumerate enums FIRST: SpotStatus, OrderState, ATMState, VendingState...','Self-score rubric: naming, SOLID, patterns, concurrency, tests, extensibility, complexity','Main.java driver: what to demo in the final 5 min'],true),
    t('LLD','Level 0','L0.1 Tic Tac Toe',
      'Model Board, Player, Game, Cell. Check rows/cols/diags after each move. No patterns needed.',
      'Easy',60,['Board 3×3','Player X/O','Win check O(1) per move','Main driver'],true),
  ]),
  day(2, 'Math II + LLD Snake & Ladder', [
    dsa('Math Foundations','Modular Arithmetic, Fast Power & Combinatorics',
      'MOD = 1e9+7; keep intermediates in long. Sub: (a-b+MOD)%MOD. Binary exponentiation O(log n): square base, multiply when exp bit is 1. Modular inverse (prime MOD): pow(a, MOD-2). nCr via Pascal row C[j]=(C[j]+C[j-1])%MOD iterating j right-to-left. Catalan: Cn = C(2n,n)/(n+1) — bracket sequences, BST counts. Permutation Sequence: factorial number system. Watch: Pow(x,n) with n=Integer.MIN_VALUE — negate as long.',
      'Medium',['#50 Pow(x, n)','Modular Exponentiation','nCr modulo prime','#118 Pascal\'s Triangle','Catalan Number (n-th Catalan)','#60 Permutation Sequence']),
    t('LLD','Level 0','L0.2 Snake and Ladder',
      'Board with snake/ladder cell-effect map. Dice roll, player positions, turn loop. Simple HashMap for effects.',
      'Easy',60,['Board with effects map','Player positions','Dice (1-6)','Multiple players support'],true),
  ]),
  day(3, 'Arrays & Hashing I + LLD Parking Lot + STAR Intro', [
    dsa('Arrays & Hashing','Two Sum & Frequency Counting',
      'Key: HashMap gives O(1) complement lookup. Two variants — seen-set (check before insert) for pairs, freq-map (count then scan) for anagram/duplicate problems. Longest consecutive: HashSet, only start counting from x where x-1 is absent. Watch: use int keys / equals(), never == on Integer.',
      'Easy',['#1 Two Sum','#217 Contains Duplicate','#242 Valid Anagram','#49 Group Anagrams','#26 Remove Duplicates from Sorted Array','#283 Move Zeroes','#128 Longest Consecutive Sequence']),
    t('LLD','Level 1','L1.1 Parking Lot (Single Floor)',
      'ParkingLot, Floor, Spot, Vehicle, Ticket. Find first free spot. Singleton ParkingLot. Park/unpark operations.',
      'Easy',75,['ParkingLot (Singleton)','Floor / Spot / Vehicle','Ticket with timestamp','First available allocation'],true),
    t('Behavioral','STAR Intro','STAR Framework — First Leadership Story (20 min)',
      'Internalize the STAR format so it becomes automatic. Draft your first story: led a project under pressure. Time it — must be ≤ 2 min. Result must be quantified.',
      'Theory',20,['STAR format: Situation(20s) → Task(20s) → Action(60s) → Result(20s)','Rule: Action must be 60% of the story — YOUR decisions, not the team\'s','Draft: "I led X project, faced Y constraint, I decided Z, outcome was W"','Result must be quantified: latency -X%, saved N hours/week, revenue +$Y'],false),
  ]),
  day(4, 'Arrays & Hashing II + HLD Scalability + Ownership Stories', [
    dsa('Arrays & Hashing','Max Subarray, Stock, Product & Majority',
      "Kadane's: keep running sum, reset at negative. Stock: one-pass track minSoFar + maxProfit. Product array: two-pass prefix×suffix excluding self. Boyer-Moore: vote/cancel pairs; for n/3 keep two candidates and VERIFY with a second pass. Find Duplicate: Floyd's cycle on index graph.",
      'Medium',['#53 Maximum Subarray','#121 Best Time to Buy & Sell Stock','#238 Product of Array Except Itself','#169 Majority Element (Boyer-Moore)','#229 Majority Element II','#287 Find the Duplicate Number']),
    t('HLD','Scalability','Scalability Fundamentals, Load Balancing & Consistent Hashing',
      'Vertical scale hits a ceiling — horizontal scale requires stateless services. Load balancers route traffic using various algorithms. Consistent hashing minimises rehashing when nodes are added/removed — critical for distributed caches.',
      'Theory',45,['Vertical vs Horizontal scaling: trade-offs and when to switch','LB algorithms: round-robin, least-connections, IP-hash, random','Consistent hashing: virtual nodes — why 150+ vnodes per physical node','Stateless services: sessions in Redis or JWTs — never store state in-process','Health checks: active (ping) vs passive (monitor error rate)'],false),
    t('Behavioral','Leadership','Ownership & Influence Stories (20 min)',
      'Prepare two more STAR stories: took ownership beyond your role; influenced a decision without authority. These come up in every SDE-2 interview.',
      'Theory',20,['Story: "took ownership beyond your job description" — what triggered it, your decision, outcome','Story: "influenced a technical decision without authority" — who you persuaded, how, result','Practice using "I" not "we" — interviewers want YOUR specific contribution','Prep the follow-up: "What would you do differently?"'],false),
  ]),
  day(5, 'Two Pointers I + HLD Caching', [
    dsa('Two Pointers','Container Water, 3Sum & Dutch National Flag',
      'Two pointers shrink from both ends for optimization. 3Sum: sort + fix + two-pointer — skip duplicates at BOTH the fix level and pointer level. Dutch Flag: lo/mid/hi three-way partition. Watch: in 3Sum, duplicate-skip must happen AFTER moving the pointer.',
      'Medium',['#167 Two Sum II — Input Array is Sorted','#11 Container With Most Water','#15 3Sum','#16 3Sum Closest','#75 Sort Colors (Dutch National Flag)','#977 Squares of a Sorted Array','#80 Remove Duplicates from Sorted Array II']),
    t('HLD','Caching','Caching Patterns — Cache-Aside, Write-Through, Eviction & Redis',
      'Cache-aside (lazy) is the default for read-heavy workloads. Write-through doubles write latency but keeps cache warm. LRU suits recency-based access; LFU suits frequency-based. Redis data structures each serve a different use case.',
      'Theory',45,['Cache-aside: on cache miss → load from DB → populate cache','Write-through: write to cache + DB synchronously; always consistent but slower writes','Write-behind (write-back): async DB flush; max write speed but risk data loss on crash','Eviction: LRU (doubly-linked + hashmap), LFU (freq buckets + minFreq pointer)','Redis data types: String, Hash, List, Set, ZSet — when to use each','CDN caching: edge nodes, cache-control headers, origin shield, invalidation strategies'],false),
  ]),
  day(6, 'WEEKEND · Two Pointers II + Sliding Window I + LLD Library + HLD Databases', [
    dsa('Two Pointers','Trapping Rain Water & Next Permutation',
      'Trap water: two-pointer with running maxLeft + maxRight, water = min(maxL,maxR) - height[i]. Next permutation: find last descent, swap with next larger from right, reverse suffix. Max product subarray: track both curMax and curMin (negative flips). Watch: "next" permutation is NOT sort-descending.',
      'Hard',['#42 Trapping Rain Water','#31 Next Permutation','#18 4Sum','#152 Maximum Product Subarray']),
    dsa('Sliding Window','Longest Substring & Variable Window Template',
      'Variable-size window: right always advances; left advances only when constraint is violated. Each element enters and exits once → O(n). Template: expand right → check constraint → shrink left until valid. Watch: update result AFTER shrinking; remove map keys when count hits 0.',
      'Medium',['#3 Longest Substring Without Repeating Characters','#424 Longest Repeating Character Replacement','#567 Permutation in String','#1004 Max Consecutive Ones III','#904 Fruit Into Baskets','#159 Longest Substring with At Most Two Distinct','#340 Longest Substring with At Most K Distinct']),
    t('LLD','Level 1','L1.2 Library Management System',
      'Library, Book, Copy, User, Loan. FIFO waitlist per book. Borrow/return/fine calculation. No patterns yet.',
      'Medium',75,['Book with multiple Copies','User with active loans','Loan with due date','Fine = days × rate','FIFO queue per book'],true),
    t('LLD','Patterns Index','6 Core LLD Patterns — Quick Reference Map',
      'Know which pattern solves which problem within the first 5 minutes. This mapping is your compass during the 90-min round.',
      'Theory',20,['Singleton → ParkingLot, Config, Logger: one instance globally','Strategy → AllocationStrategy, SplitStrategy, RateLimiter: injectable algorithm family','State → VendingMachine, ATM, Elevator: object changes behavior per state','Observer → Library waitlist, OrderTracking: notify subscribers on event','Command → TextEditor undo/redo: encapsulate operation as object with execute/undo','Chain of Responsibility → Logger levels, ATM denominations: handler chain, each decides to process or pass'],false),
    t('HLD','Databases','SQL vs NoSQL, CAP Theorem & Indexing Strategy',
      'CAP: in a distributed system, pick 2 of 3. SQL = CP. Cassandra = AP. Indexing strategy depends on read vs write ratio. Sharding strategy depends on query patterns.',
      'Theory',45,['SQL ACID — explain each property using a bank-transfer example','NoSQL flavors: document (MongoDB), KV (Redis), wide-column (Cassandra), graph (Neo4j)','CAP theorem + PACELC: when to choose CP vs AP with real examples','Sharding: range (range queries), hash (uniform load), directory-based (flexible but SPOF)','Indexing: B-tree (read-opt, range), LSM-tree (write-opt Cassandra), hash index (exact match)','Read replicas: synchronous vs async replication + replication lag impact'],false),
  ]),
  day(7, 'WEEKEND · Sliding Window II + Prefix Sum + LLD Vending + Week 1 Revision & Mock', [
    dsa('Sliding Window','Exactly-K Trick, Anagrams & Min Window',
      '"Exactly K" = atMostK(k) - atMostK(k-1). Fixed-size window: maintain char freq map, slide by 1. Min window substring: expand until all chars covered (track "formed" count), then shrink while valid. Watch: when shrinking, remove leftmost element BEFORE updating result.',
      'Hard',['#76 Minimum Window Substring','#992 Subarrays with K Different Integers','#438 Find All Anagrams in a String','Count Nice Subarrays (exactly K odd numbers)','#727 Minimum Window Subsequence']),
    dsa('Prefix Sum','Prefix Sum Arrays & Subarray Count Tricks',
      'Build prefix[0..n] where prefix[i+1] = prefix[i]+arr[i]. Subarray sum [l,r] = prefix[r+1]-prefix[l]. Count subarrays with sum=k: HashMap<prefixSum, freq>, seed with {0:1} BEFORE iterating. Divisible by K: key = floorMod(prefix, k). Difference array for range updates. Watch: use long for large sums.',
      'Medium',['#560 Subarray Sum Equals K','#974 Subarray Sums Divisible by K','#525 Contiguous Array (equal 0s and 1s)','Largest Subarray with Zero Sum','Count Subarrays with XOR = K','#1358 Number of Substrings Containing All Three Characters','#930 Binary Subarrays With Sum','Missing and Repeating Number']),
    t('LLD','Level 1','L1.3 Vending Machine (No State)',
      'Machine, Product, Inventory, Coin. Dispense = check stock + compute change. No State pattern yet.',
      'Easy',75,['Machine with product inventory','Coin insertion + change calculation','Dispense logic','Refund on cancel'],true),
    revision(1, 60, 'Bonus hard variants: #41 First Missing Positive (index-as-hash) and #334 Increasing Triplet (greedy).'),
    dsaMock(1, 'Math, Arrays, Two Pointers, Sliding Window'),
  ]),

  // ═══════════════════════════════════════════════
  // WEEK 2: Binary Search, Stack, Deque, Linked List + LLD Level 1-2
  // ═══════════════════════════════════════════════
  day(8, 'Binary Search I + Leadership Under Pressure', [
    dsa('Binary Search','Binary Search on Sorted & Rotated Arrays',
      'Classic: lo, hi, mid=lo+(hi-lo)/2. Rotated array: one half is always sorted — check which half via nums[lo]<=nums[mid], then verify if target falls there. Peak: move toward the higher neighbor. Single element: pair index parity. Watch: always use lo+(hi-lo)/2 to avoid integer overflow.',
      'Medium',['#35 Search Insert Position','#540 Single Element in a Sorted Array','#33 Search in Rotated Sorted Array','#81 Search in Rotated Array II (with duplicates)','#153 Find Minimum in Rotated Sorted Array','#162 Find Peak Element','#74 Search a 2D Matrix']),
    t('Behavioral','Leadership','Leadership Under Pressure — Deadline Stories (20 min)',
      'The SDE-2 bar explicitly tests leadership: did you drive clarity, unblock teammates, and deliver under pressure? Prep two tight stories.',
      'Theory',20,['Story: "deadline crunch — how did you lead the team through it?" (include YOUR specific decisions)','Story: "critical bug 1 day before release — what did you do?" (triage, communication, fix)','Practice: "What was the hardest decision you made as a tech lead?"','Craft a 1-line impact summary for each story (the "headline")'],false),
  ]),
  day(9, 'Binary Search on Answer + Conflict Stories', [
    dsa('Binary Search','Binary Search on Answer',
      'Minimize the maximum / maximize the minimum. Define lo/hi as the answer range, write isFeasible(mid) greedily, then "first true" template: feasible → hi = mid else lo = mid + 1. Classic: ship capacity, split array, book allocation, aggressive cows.',
      'Hard',['#875 Koko Eating Bananas','#1011 Capacity to Ship Packages Within D Days','#410 Split Array Largest Sum (minimize largest sum)','Book Allocation','Aggressive Cows','#2064 Minimized Maximum of Products Distributed']),
    t('Behavioral','Conflict','Conflict & Disagreement Stories (15 min)',
      'Quick 15-min session. SDE-2 bar checks you navigate conflict professionally. Focus on the PROCESS you used, not just the outcome.',
      'Theory',15,['Story: "disagreed with tech lead on architecture — how did you handle it?"','Key elements: (1) stated your position with data, (2) listened to their view, (3) persuaded or gracefully deferred','Anti-pattern to avoid: "we just discussed and agreed" — too vague, shows no independent thinking','Strong ending: "in hindsight I learned..." — shows growth mindset'],false),
  ]),
  day(10, 'Monotonic Stack I + LLD LRU Cache', [
    dsa('Stack & Monotonic Stack','Next Greater Element & Largest Rectangle',
      'Monotonic decreasing stack: pop when nums[i] > stack.peek() → popped element\'s NGE is nums[i]. For histogram: pop when shorter bar found, use stack.peek() as left boundary for width. Circular: iterate 2n with i % n. Watch: push INDEX not value so you can compute width correctly.',
      'Medium',['#20 Valid Parentheses','#155 Min Stack','#739 Daily Temperatures','#496 Next Greater Element I','#503 Next Greater Element II (circular)','#84 Largest Rectangle in Histogram','#85 Maximal Rectangle (extend #84 per row)']),
    t('LLD','Level 1','L1.5 LRU Cache — HashMap + Doubly Linked List',
      'Use sentinel head (most recent) + sentinel tail (least recent) to avoid null checks. On get: remove from current position, re-insert at head. On put: insert at head; if size > capacity, remove node before tail.',
      'Medium',75,['DNode(key,val,prev,next) + sentinel head + sentinel tail','HashMap<Integer,DNode> for O(1) lookup','removeNode(DNode): update prev/next pointers','insertAtHead(DNode): insert after sentinel head','put: if key exists → update + move to head; else add at head + evict tail.prev if over capacity'],true),
  ]),
  day(11, 'Monotonic Stack II + HLD Kafka', [
    dsa('Stack & Monotonic Stack','Asteroid Collision, Remove K Digits & Contribution',
      'Stack simulation: asteroid collision — positive stays on stack until larger negative cancels it. Remove K: maintain increasing stack, pop when current < top and k>0. Contribution technique: each element is the min of (i - prevLess) × (nextLess - i) subarrays. Watch: strict vs non-strict comparison on one side to avoid double counting duplicates.',
      'Medium',['#735 Asteroid Collision','#402 Remove K Digits','#316 Remove Duplicate Letters (greedy + stack)','#907 Sum of Subarray Minimums','#2104 Sum of Subarray Ranges','#901 Online Stock Span','#1106 Parsing a Boolean Expression','Maximum of Minimums of Every Window']),
    t('HLD','Message Queues','Kafka & Async Messaging Patterns',
      'Kafka enables async decoupling between producers and consumers. Offset management makes replay possible. Delivery semantics trade consistency for availability. Use Kafka for event streaming; SQS for simple queues; Redis pub-sub for low-latency fan-out.',
      'Theory',45,['Kafka architecture: broker, topic, partition, offset, consumer group','Producer: batch writes, acks(0/1/all) trade-offs','Consumer group: partition parallelism, rebalancing on join/leave','Delivery: at-most-once, at-least-once, exactly-once (transactional producer)','Dead letter queue: handling poison messages','Kafka vs SQS vs RabbitMQ vs Redis pub-sub — when to use each'],false),
  ]),
  day(12, 'Queue & Monotonic Deque + Failure Stories', [
    dsa('Queue & Deque','Sliding Window Maximum, LRU/LFU & Deque Tricks',
      'Monotonic deque for sliding max: drop out-of-window indices from the front, drop weaker values from the back; front is the max. LRU: HashMap + DLL (or LinkedHashMap accessOrder=true). LFU: freq → LinkedHashSet buckets + minFreq. Watch: snapshot queue.size() per BFS level.',
      'Medium',['#232 Implement Queue using Stacks','#239 Sliding Window Maximum','#146 LRU Cache','#460 LFU Cache','#1696 Jump Game VI (deque DP)','#862 Shortest Subarray with Sum at Least K','Celebrity Problem','Infix to Postfix']),
    t('Behavioral','Failure & Growth','Failure, Risk & Growth Stories (20 min)',
      'The SDE-2 interview will probe your self-awareness. Prepare one failure story where you share what YOU did wrong and what you changed afterwards.',
      'Theory',20,['Story: "biggest technical failure you caused" — own it, don\'t blame others','Key: (1) what went wrong, (2) YOUR role, (3) immediate action, (4) lasting change you made','Story: "took a risky technical decision" — what data did you have, what was the downside risk','Prep: "When did you change your approach based on new information?" — shows intellectual honesty'],false),
  ]),
  day(13, 'WEEKEND · Linked List I & II + LLD Parking Multi-floor + HLD Microservices', [
    dsa('Linked List','Reverse, Merge Sorted, Cycle Detection (Floyd)',
      'Reverse: 3-pointer (prev=null, curr, next=curr.next). Merge two sorted: dummy head, link smaller. Floyd\'s cycle: slow+1, fast+2; if they meet there is a cycle; reset one to head, advance both at +1 to find cycle start. Add two numbers: carry through a dummy list. Watch: handle null head in all of them.',
      'Medium',['#206 Reverse Linked List (iterative + recursive)','#21 Merge Two Sorted Lists','#876 Middle of the Linked List','#141 Linked List Cycle','#142 Linked List Cycle II (find cycle start)','#19 Remove Nth Node From End of List','#2 Add Two Numbers']),
    dsa('Linked List','Reorder, K-Group Reverse, Clone & Sort List',
      'Reorder: find mid → reverse second half → interleave. K-group: count k nodes, reverse that block with a helper returning new head/tail, reconnect. Clone with random: interleave copies A→A\'→B→B\', set randoms, split. Sort list: merge sort with slow/fast split. Watch: cut the list at mid before reversing.',
      'Medium',['#143 Reorder List','#92 Reverse Linked List II','#25 Reverse Nodes in k-Group','#138 Copy List with Random Pointer','#148 Sort List (merge sort on linked list)','#82 Remove Duplicates from Sorted List II','#430 Flatten a Multilevel Doubly Linked List']),
    t('LLD','Level 2','L2.1 Parking Lot Multi-floor + Strategy',
      'Extend L1.1. Add AllocationStrategy interface (FirstAvailable, MaxFreeFloor). Factory for spot types. Inject strategy into service.',
      'Medium',90,['AllocationStrategy interface','FirstAvailable / MaxFreeFloor','ParkingLotService(AllocationStrategy)','Factory for vehicle/spot types'],true),
    t('HLD','Microservices','Microservices Architecture & Resilience Patterns',
      'Microservices enable independent deployment but introduce distributed system complexity. The circuit breaker prevents cascade failures. Saga handles distributed transactions without 2PC.',
      'Theory',45,['API Gateway: routing, auth, rate limiting, SSL termination in one place','Service discovery: client-side (Eureka + Ribbon) vs server-side (Consul + LB)','Circuit breaker states: Closed → Open (on failure threshold) → Half-Open (trial request)','Saga pattern: choreography (event-driven) vs orchestration (central coordinator)','Bulkhead: isolate failures to one pool; Retry with exponential backoff + jitter','Distributed tracing: Jaeger/Zipkin, correlation IDs across services'],false),
    revision(2, 60, 'Focus on binary-search boundaries and monotonic stack strict/non-strict comparisons.'),
  ]),
  day(14, 'WEEKEND · Trees I + BST + LLD Vending State + HLD API & Estimation + Mock', [
    dsa('Trees DFS','Max Depth, Invert, Path Sum, Same Tree',
      'Recursive DFS: base case = null → return 0/true/false. Post-order for combining children results. Path Sum: pass remaining = target - node.val down; leaf check at zero. Balanced: return -1 as a "not balanced" sentinel. Diameter: update global max with left+right depth.',
      'Easy',['#104 Maximum Depth of Binary Tree','#226 Invert Binary Tree','#100 Same Tree','#112 Path Sum','#113 Path Sum II (all paths)','#110 Balanced Binary Tree','#543 Diameter of Binary Tree']),
    dsa('BST','Validate, Kth Smallest, LCA, Delete & Iterator',
      'BST in-order is sorted. Validate with (long) bounds, not parent-only checks. Kth smallest: iterative in-order, stop at k. LCA of BST: walk down — split point is the answer. Delete: 0/1 child → splice; 2 children → replace with in-order successor. Iterator: stack of left spine, amortized O(1).',
      'Medium',['#98 Validate Binary Search Tree','#230 Kth Smallest Element in a BST','#235 Lowest Common Ancestor of a BST','#450 Delete Node in a BST','#173 Binary Search Tree Iterator']),
    t('LLD','Level 2','L2.2 Vending Machine with State Pattern',
      'State machine: Idle → ItemSelected → Paying → Dispensing → Idle. Each state handles all operations, delegates to machine.',
      'Medium',90,['VendingState interface (selectItem/insertCoin/dispense)','IdleState / PayingState / DispensingState','Machine delegates to current state','State transitions on error → Idle'],true),
    t('HLD','API Design','REST API Design, Idempotency, Pagination & Rate Limiting',
      'RESTful APIs are stateless and resource-oriented. Idempotency is critical for safe retries. Cursor-based pagination handles real-time data better than offset. Rate limiting protects against abuse and ensures fair usage.',
      'Theory',45,['REST constraints: stateless, uniform interface (HTTP verbs + status codes), client-server separation','HTTP verbs: GET (safe+idempotent), POST (neither), PUT (idempotent), DELETE (idempotent)','Status codes: 200/201/204, 400/401/403/404/422/429, 500/503 — know when to use each','Pagination: offset (simple, unstable) vs cursor (stable for real-time feeds)','API versioning: URI (/v1/), header (Accept: vnd.api.v1+json), query param','Rate limiting: token bucket per userId in Redis + return Retry-After header on 429'],false),
    t('HLD','Estimation','Back-of-the-Envelope Capacity Estimation',
      'Every HLD round expects numbers before boxes. Convert DAU → QPS → storage → bandwidth in under 5 minutes, then let those numbers drive the design (sharding, caching, replicas).',
      'Theory',45,['Powers of two & latency numbers every engineer should know','DAU → avg QPS (÷ ~10⁵ s/day) → peak QPS (×2–3)','Storage: objects/day × size × retention × replication factor','Bandwidth: QPS × payload size (ingress vs egress)','Practice: estimate Twitter timeline reads and URL shortener writes'],false),
    dsaMock(2, 'Binary Search, Stack, Deque, Linked List'),
  ]),

  // ═══════════════════════════════════════════════
  // WEEK 3: Trees, Heap, Backtracking, Graphs + LLD Level 2-3 + HLD Designs
  // ═══════════════════════════════════════════════
  day(15, 'Trees BFS & Views + HLD URL Shortener', [
    dsa('Trees BFS','Level Order, Zigzag, Views & Vertical Order',
      'BFS with queue, track level size (size = queue.size() before inner loop). Zigzag: alternate insert direction. Right side: last node per level. Width: index nodes as 2i/2i+1 (use long or normalise per level). Vertical order: (col, row, val) sort with TreeMap. Flatten: reverse post-order with prev pointer.',
      'Medium',['#102 Binary Tree Level Order Traversal','#103 Zigzag Level Order Traversal','#199 Binary Tree Right Side View','#662 Maximum Width of Binary Tree','#987 Vertical Order Traversal of a Binary Tree','#114 Flatten Binary Tree to Linked List']),
    t('HLD','URL Shortener','Design: URL Shortener (bit.ly)',
      'Requirements → encoding (base62, 7 chars → 62^7 URLs) → DB schema → KV store for cache → analytics. The key design decision is sequential ID vs random hash and collision handling.',
      'Theory',60,['Functional: shorten URL, redirect, optional analytics, custom alias','Base62 encoding (0-9, a-z, A-Z): 7 chars = 3.5 trillion unique URLs','Auto-increment ID → base62 vs MD5 → take first 7 chars (collision risk)','Storage: KV store (shortCode → longURL) + Redis cache for hot URLs','Custom alias: check uniqueness in DB; mark as user-defined in schema','Analytics: Cassandra for click counts (write-heavy, time-series)'],false),
  ]),
  day(16, 'Trees Hard + LLD Splitwise', [
    dsa('Trees DFS/BFS','Max Path Sum, LCA, Serialize & Build Tree',
      'Max path sum: return max single-branch gain (clamp negatives to 0), update global with left+right+node. LCA: first node with targets in both subtrees (or node itself is a target). Serialize: preorder with "null" markers. Build from pre+in: hashmap value→inorder index, recurse on ranges.',
      'Hard',['#124 Binary Tree Maximum Path Sum','#236 Lowest Common Ancestor','#297 Serialize and Deserialize Binary Tree','#105 Construct Binary Tree from Preorder and Inorder Traversal']),
    t('LLD','Level 2','L2.3 Splitwise (Expense Splitting)',
      'Equal/exact/percentage split strategies. Net balance map per user. Simplify debts: max-heap (creditors) + min-heap (debtors).',
      'Medium',90,['SplitStrategy interface (equal/exact/percentage)','Group & Expense entities','Net balance: Map<User, Double>','Simplify: two PriorityQueues'],true),
  ]),
  day(17, 'Heap I + Achievement Stories', [
    dsa('Heap / Priority Queue','Top-K Elements, Kth Largest & K-Sorted',
      'Min-heap of size K for top-K largest — pop when size > K. Top-K frequent: freq map + heap (or bucket sort O(n)). K-sorted array: heap of size k+1. Kth smallest in matrix: heap of row heads or binary search on value. Watch: use Integer.compare in comparators, never a - b.',
      'Medium',['#215 Kth Largest Element in an Array','#347 Top K Frequent Elements','#692 Top K Frequent Words','#973 K Closest Points to Origin','#378 Kth Smallest Element in a Sorted Matrix','Connect N Ropes with Minimum Cost','Sort a K-Sorted Array']),
    t('Behavioral','Achievement','Impact & Achievement Stories (20 min)',
      'SDE-2 interviews expect measurable impact. Every story needs a quantified result. Prep two achievement stories with hard numbers.',
      'Theory',20,['Story: "most impactful project you shipped" — what was the before/after metric?','Story: "improved system performance" — latency reduced by X%, throughput +Y%, cost saved $Z','Anti-pattern: "we improved the system" — vague. Be specific: "reduced p99 latency from 800ms to 120ms"','Bonus: "I noticed an unmeasured problem, defined the metric, solved it, validated the improvement"'],false),
  ]),
  day(18, 'Heap II + HLD Twitter Feed', [
    dsa('Heap / Priority Queue','Median Stream, Merge K Lists & Scheduling',
      'Median: max-heap (lower half) + min-heap (upper half), rebalance so sizes differ by ≤ 1. Merge K sorted: min-heap of list heads, O(n log k). Smallest range: heap over K lists tracking current max. Task scheduler: (maxFreq-1)×(n+1) + countOfMax, or simulate with heap + cooldown queue.',
      'Hard',['#295 Find Median from Data Stream','#23 Merge K Sorted Lists','#373 Find K Pairs with Smallest Sums','#632 Smallest Range Covering Elements from K Lists','#621 Task Scheduler']),
    t('HLD','Social Media Feed','Design: Twitter / News Feed',
      'Fan-out on write vs fan-out on read — the core architectural trade-off for feeds. Hybrid approach for celebrities (fan-out on read) vs regular users (fan-out on write).',
      'Theory',60,['Fan-out-on-write: push tweet to all followers\' Redis feeds (fast read, slow write for celebrities)','Fan-out-on-read: pull from followed users\' tweets on request (slow read, fast write)','Hybrid: users with >1M followers use pull; others use push','Redis ZSet for timeline: (timestamp, tweetId) ordered set per user','Tweet storage: Cassandra (write-heavy) + CDN for media','Search: Elasticsearch for full-text tweet search'],false),
  ]),
  day(19, 'Backtracking I', [
    dsa('Backtracking','Permutations, Subsets, Combinations',
      'Template: choose → recurse → unchoose. Subsets: include/exclude or loop from start. Combinations: start index avoids reordering; pass i (reuse) vs i+1 (no reuse). Duplicates: sort first, skip i > start && a[i]==a[i-1]. Permutations II: used[] + skip if previous identical not used. Watch: add new ArrayList<>(current), not current.',
      'Medium',['#78 Subsets','#90 Subsets II','#77 Combinations','#39 Combination Sum','#40 Combination Sum II','#46 Permutations','#47 Permutations II','#22 Generate Parentheses']),
  ]),
  day(20, 'WEEKEND · Backtracking II + Graphs I + LLD Rate Limiter + HLD Notifications', [
    dsa('Backtracking','N-Queens, Sudoku, Word Search & Partitioning',
      'N-Queens: track cols, diag (r-c), anti-diag (r+c) as boolean arrays. Sudoku: try 1–9 per empty cell with row/col/box sets, backtrack on failure. Word Search: DFS marking board cell, restore after. Palindrome partitioning: precompute isPal[i][j]. Expression add operators: carry previous operand for "*" precedence.',
      'Hard',['#131 Palindrome Partitioning','#51 N-Queens','#37 Sudoku Solver','#79 Word Search','#282 Expression Add Operators']),
    dsa('Graphs BFS/DFS','Islands, Flood Fill, Multi-source BFS',
      'Grid DFS/BFS: mark visited WHEN enqueuing, not when polling. Multi-source BFS (rotting oranges, 01 matrix): push all sources at distance 0 first. Clone graph: BFS + HashMap<original, clone>. Provinces: count DFS launches over adjacency matrix.',
      'Medium',['#200 Number of Islands','#733 Flood Fill','#695 Max Area of Island','#1020 Number of Enclaves','#133 Clone Graph','#547 Number of Provinces','#994 Rotting Oranges (multi-source BFS)','#542 01 Matrix']),
    t('LLD','Level 2','L2.4 Rate Limiter — Fixed / Sliding / Token Bucket',
      'RateLimiterStrategy interface: boolean allow(String userId). Three implementations with different accuracy/memory trade-offs. FixedWindow is simplest but leaks at boundaries. SlidingWindow is accurate but memory-heavy. TokenBucket is smooth and burst-friendly.',
      'Medium',90,['RateLimiterStrategy interface: allow(userId) → boolean','FixedWindowStrategy: Map<userId, count> + windowStartTime; reset on new window','SlidingWindowStrategy: Map<userId, Deque<Long>> timestamps; prune old entries','TokenBucketStrategy: tokens + lastRefillTime; refill = (now - last) / interval * rate','ConcurrentHashMap for thread-safety; synchronized on userId key'],true),
    t('HLD','Notifications','Design: Notification System (Push / SMS / Email)',
      'A fan-out pipeline with per-channel workers. Key concerns: user preferences, rate limiting per user, retries with idempotency, and template rendering — without blocking the producing service.',
      'Theory',60,['Producers publish events to Kafka; notification service consumes','Preference + opt-out store checked before send','Per-channel queues & workers: APNs/FCM, SMS gateway, SMTP provider','Retry with exponential backoff + DLQ; idempotency key per notification','Rate limit per user/channel; batching digests for low-priority events','Tracking: sent / delivered / opened events for analytics'],false),
    revision(3, 60, 'Focus on tree recursion return values and heap comparator choices.'),
  ]),
  day(21, 'WEEKEND · Graphs II + LLD Observer & Chain + Impact Stories + Mock', [
    dsa('Graphs BFS/DFS','Cycle Detection, Bipartite & Topological Sort',
      "Undirected cycle: BFS/DFS with parent tracking. Directed cycle: DFS 3-colour (white/gray/black) or Kahn's (order.size() < n). Bipartite: 2-colour BFS per component. Topo sort (Kahn's): indegree array + queue of 0-indegree nodes. Safe states: reverse graph + Kahn's. Pacific/Atlantic: reverse BFS from both coasts.",
      'Medium',['Detect Cycle in Undirected Graph (BFS)','Detect Cycle in Directed Graph (DFS)','#785 Is Graph Bipartite?','#207 Course Schedule (cycle detection)','#210 Course Schedule II (topo sort)','#802 Find Eventual Safe States','#417 Pacific Atlantic Water Flow']),
    t('LLD','Level 3','L3.1 Library Waitlist with Observer Pattern',
      'Extend L1.2. Book implements Observable. User implements Observer. When book returned: notify head of FIFO waitlist.',
      'Medium',105,['Observer interface (update(Event e))','Observable interface (subscribe/notify)','Book → waitlist queue of Observers','Notify on return: send availability event'],true),
    t('LLD','Level 3','L3.2 Logger with Chain of Responsibility',
      'LogHandler chain: each handler checks level, logs or passes to next. Strategy for sink (console/file/database).',
      'Medium',105,['LogHandler abstract (setNext / handle)','ErrorHandler / WarnHandler / InfoHandler','ConsoleHandler / FileHandler (Strategy)','Chain: error→warn→info→console'],true),
    t('Behavioral','Impact Stories','Impact, Initiative & Cross-Functional Stories (25 min)',
      'Substantial prep session — SDE-2 interviews heavily probe initiative and cross-functional collaboration. Prepare two more stories and practice all of them.',
      'Theory',25,['Story: "drove an initiative no one asked you to" — spotted a gap, proposed a solution, executed it','Story: "collaborated across teams" — aligned different stakeholders, resolved conflicting priorities','Practice delivering all your stories so far (limit: 2 min each)','Test: can you answer "Tell me about yourself" in exactly 90 seconds and land on your strongest story?'],false),
    dsaMock(3, 'Trees, Heap, Backtracking, Graph BFS/DFS'),
  ]),

  // ═══════════════════════════════════════════════
  // WEEK 4: Union-Find, Shortest Paths, Trie, Greedy, DP I + LLD Level 3-4 + HLD
  // ═══════════════════════════════════════════════
  day(22, 'Union-Find & MST + HLD Uber', [
    dsa('Union-Find','Redundant Connection, MST & Alien Dictionary',
      "DSU with path compression + union by rank/size → near O(1). union() returning false = edge closes a cycle. Kruskal: sort edges by weight, union greedily. Prim: min-heap from any node. Alien dictionary: build edges from first differing char of adjacent words, then topo sort (watch prefix edge-case). Word ladder: BFS over wildcard patterns.",
      'Medium',['#684 Redundant Connection','#1319 Number of Operations to Make Network Connected','#947 Most Stones Removed with Same Row or Column','Kruskal\'s MST','Prim\'s MST','#269 Alien Dictionary','#127 Word Ladder']),
    t('HLD','Ride-Sharing','Design: Uber / Ride-Sharing Platform',
      'Location tracking + matching + surge pricing — three independent subsystems. Each has different consistency requirements. The matching algorithm is the core differentiator.',
      'Theory',60,['Driver location tracking: geohashing (geohash string prefix = proximity) or QuadTree','Matching: nearest available driver within radius using geohash index','Surge pricing: supply/demand ratio per geohash cell; Kafka event stream for real-time signals','ETA: Dijkstra on road network graph; pre-computed for common corridors','Trip state machine: REQUESTED → ACCEPTED → DRIVER_ARRIVED → IN_PROGRESS → COMPLETED','Scaling: separate services for location-tracking, matching, pricing, trip-management'],false),
  ]),
  day(23, 'Union-Find Hard + LLD Text Editor Undo', [
    dsa('Union-Find','Accounts Merge, Islands II & Swim in Water',
      'Accounts merge: union emails of the same account, group by root, sort. Islands II: add land cell → count++, union with land neighbours → count-- per successful union. Make large island: label components with sizes, try flipping each 0. Swim in rising water: sort cells by height and union until (0,0)~(n-1,n-1), or Dijkstra on max-edge.',
      'Hard',['#721 Accounts Merge','#305 Number of Islands II','#827 Making A Large Island','#778 Swim in Rising Water']),
    t('LLD','Level 3','L3.3 Text Editor with Undo/Redo (Command + Memento)',
      'Command: InsertCommand, DeleteCommand with execute()/undo(). EditorService: Deque<Command> history for undo, redo stack.',
      'Medium',105,['Command interface (execute/undo)','InsertCommand / DeleteCommand','EditorService with undo/redo stacks','Memento: EditorSnapshot record'],true),
  ]),
  day(24, 'Shortest Paths I + HLD WhatsApp + Situational Questions', [
    dsa('Shortest Paths','Dijkstra, Bellman-Ford & Floyd-Warshall Templates',
      'Dijkstra: min-heap of (dist, node), skip stale entries (d > dist[u]), non-negative weights only. Bellman-Ford: relax all edges V-1 times; Vth pass improvement = negative cycle. Floyd-Warshall: k as OUTER loop, O(V³). Unit weights → plain BFS.',
      'Medium',['Dijkstra\'s Algorithm','Bellman-Ford Algorithm','Floyd-Warshall All-Pairs','#743 Network Delay Time (Dijkstra)','#1091 Shortest Path in Binary Matrix']),
    t('HLD','Messaging','Design: WhatsApp / Real-Time Messaging',
      'Real-time messaging requires WebSocket connections, message ordering, delivery receipts, and end-to-end encryption. The core challenge is fan-out at scale with exactly-once delivery semantics.',
      'Theory',60,['WebSocket server for real-time push — sticky sessions per user to server','Message storage: Cassandra (write-heavy, ordered by timestamp)','Fan-out: direct message (1:1) vs group message (fan-out to all group members)','Delivery receipts: "sent" (stored in Cassandra), "delivered" (device ACK), "read" (app ACK)','End-to-end encryption: Signal protocol, keys never leave device','Presence service: heartbeat every 5s, pub-sub to notify contacts'],false),
    t('Behavioral','Situational','Values-Based & Situational Questions (20 min)',
      'These questions probe how you work, not just what you\'ve done. Prepare crisp, structured answers — not stories but PRINCIPLES with examples.',
      'Theory',20,['"How do you prioritize when everything is P0?" — answer: impact × urgency matrix, stakeholder alignment','"How do you handle ambiguity?" — answer: clarify scope, spike to reduce risk, timebox uncertainty','"How do you give difficult feedback?" — answer: private, specific behavior not person, ask for their view first','"What\'s your working style?" — answer: show self-awareness + adaptability to different team needs'],false),
  ]),
  day(25, 'Shortest Paths II + HLD Distributed Cache', [
    dsa('Shortest Paths','K-Stops, Min Effort & Modified Dijkstra',
      'Cheapest flights with K stops: Bellman-Ford K+1 rounds copying dist into temp each round (or BFS by level). Min effort: Dijkstra where path cost = max edge so far. Max probability: max-heap Dijkstra multiplying weights. City with fewest neighbours: Floyd-Warshall then count ≤ threshold.',
      'Hard',['#787 Cheapest Flights Within K Stops (Bellman-Ford variant)','#1631 Path With Minimum Effort','#1514 Path with Maximum Probability (modified Dijkstra)','#1334 Find the City With the Smallest Number of Neighbors (Floyd-Warshall)','#505 The Maze II','#1976 Number of Ways to Arrive at Destination']),
    t('HLD','Distributed Systems','Distributed Cache — Concepts & Quick Design (20 min)',
      'Quick concept review: when a database is a bottleneck, add a distributed cache layer. Understand write-around, write-through, eviction policies and consistency guarantees before the larger system designs.',
      'Theory',20,['Write-around: skip cache on write, populate on read — good for one-time data','Partition: hash key to node; consistent hashing avoids full rehash on node add/remove','Replication: primary-replica for high availability; risk of stale reads on replica','Thundering herd: cache stampede on expiry; fix with probabilistic early expiry or locks','Hot key problem: one key gets 10x traffic; fix with local in-process cache + TTL jitter'],false),
  ]),
  day(26, 'Trie + HLD Search Autocomplete', [
    dsa('Trie','Implement Trie, Word Search II & XOR Trie',
      'Trie node: children[26] + isEnd (+ prefix count for Trie II). Insert/search/startsWith in O(L); startsWith ignores isEnd. Word Search II: insert words, DFS board while walking the trie, prune finished nodes. XOR trie: insert bits MSB→LSB, greedily take the opposite bit. Offline queries: sort queries by limit and insert numbers incrementally.',
      'Medium',['#208 Implement Trie','Trie II (with prefix count)','#211 Design Add and Search Words','#212 Word Search II','#421 Maximum XOR of Two Numbers in an Array','#1707 Maximum XOR With an Element From Array','Count Distinct Substrings (Suffix Trie)']),
    t('HLD','Search','Design: Search Autocomplete / Typeahead',
      'Top-K suggestions per prefix with < 100ms latency. Precompute top-K at each trie node offline, serve from memory/cache, and update from aggregated query logs rather than on every keystroke.',
      'Theory',45,['Trie with top-K cached at each node (trade memory for latency)','Data pipeline: query logs → aggregate (hourly/daily) → rebuild trie','Serving: shard trie by prefix range; replicate for reads','Browser + CDN caching of popular prefixes; debounce client requests','Filtering: profanity / trending boosts / personalisation layer'],false),
  ]),
  day(27, 'WEEKEND · Greedy I & Intervals + LLD Elevator', [
    dsa('Greedy & Intervals','Jump Game, Gas Station & Greedy Foundations',
      'Jump Game: track maxReach; if i > maxReach, return false. Jump Game II: count jumps when i reaches current boundary. Gas Station: if total gain ≥ 0 a solution exists; reset start when tank < 0. Candy: two passes (left→right, right→left). Fractional knapsack: sort by value/weight. Prove greedy with an exchange argument.',
      'Medium',['#860 Lemonade Change','#55 Jump Game','#45 Jump Game II','#134 Gas Station','#135 Candy (two-pass greedy)','#1029 Two City Scheduling','Fractional Knapsack']),
    dsa('Greedy & Intervals','Merge Intervals, Meetings & Platforms',
      'Merge: sort by start, extend end on overlap. Max non-overlapping / min removals / min arrows: sort by END, keep earliest-ending. N meetings: activity selection by end time. Min platforms: sort arrivals & departures separately, two pointers. Job sequencing: sort by profit, place in latest free slot ≤ deadline.',
      'Medium',['#56 Merge Intervals','#57 Insert Interval','#435 Non-Overlapping Intervals','#452 Minimum Arrows to Burst Balloons','N Meetings in One Room','Minimum Platforms','Job Sequencing Problem']),
    t('LLD','Level 3','L3.6 Elevator System (State + Strategy)',
      'Each elevator is a state machine: Idle/MovingUp/MovingDown. Dispatcher picks nearest eligible elevator (Strategy). Request queue per elevator.',
      'Hard',120,['ElevatorState interface (Idle/MovingUp/MovingDown)','Elevator state machine (requestFloor, open, close)','DispatchStrategy (NearestElevator / SCAN)','ElevatorDispatcher with strategy injection'],true),
    revision(4, 60, 'Focus on graph templates: write Dijkstra, DSU and Kahn\'s from memory in under 5 min each.'),
  ]),
  day(28, 'WEEKEND · DP I + LLD Movie Booking + HLD YouTube + HLD & LLD Mocks', [
    dsa('Dynamic Programming','Climbing Stairs, House Robber, Coin Change, Word Break',
      'Define state → transition → base case, then tabulate and space-optimise. House Robber II: run linear version twice (exclude first / exclude last). Coin Change (min): dp[i] = min(dp[i-c]+1). Coin Change II (ways): coins OUTER loop to count combinations, not permutations. Word Break: dp[i] true if some dp[j] && s[j..i) in dict.',
      'Medium',['#70 Climbing Stairs','#198 House Robber','#213 House Robber II','#322 Coin Change','#518 Coin Change II','#139 Word Break']),
    t('LLD','Level 4','L4.3 Movie Ticket/Seat Booking (Concurrency)',
      'Per-seat ReentrantLock. HOLD state with ScheduledExecutorService expiry (10 min). Booking: HOLD → BOOKED. Thread-safe.',
      'Hard',120,['Seat states: AVAILABLE/HOLD/BOOKED','ConcurrentHashMap<seatId, Lock>','ScheduledExecutorService for hold expiry','Atomic state transitions'],true),
    t('HLD','Video Streaming','Design: YouTube / Video Streaming Platform',
      'Video encoding pipeline and CDN architecture are the core differentiators. Adaptive bitrate streaming ensures quality degrades gracefully on poor networks.',
      'Theory',60,['Upload pipeline: raw video → encode (FFmpeg, multiple resolutions) → store (S3/GCS) → distribute (CDN)','Adaptive bitrate streaming (HLS/DASH)','CDN: PoP nodes at edges, origin shield, cache-control headers, range-request support','Metadata service: PostgreSQL for video metadata; Elasticsearch for search','Recommendation: collaborative filtering + content-based; A/B tested continuously','View count: approximate counting with HyperLogLog or batched Kafka aggregation'],false),
    t('HLD','System Design','Full HLD System Design Mock (60 min)',
      'Pick any: Design WhatsApp / Design Instagram / Design Distributed Cache. Cover: requirements, capacity, API, data model, components.',
      'Mock',60,['Pick any: Design WhatsApp / Design Instagram / Design Distributed Cache','Functional & non-functional requirements','Capacity estimation','API design','Data model & storage','Component diagram & bottlenecks'],true),
    t('LLD','Mock','LLD Mock Interview 1 (90 min timed)',
      'Timed 90-min machine coding round + 15 min self-review. Pick from: Parking Lot / Vending Machine / Library / LRU Cache. No notes. Full solution with Main driver.',
      'Mock',105,['Choose one: Parking Lot / Vending Machine / Library','90 min strict timer','SOLID design + patterns','Main.java with full demo','Self-score with rubric after'],true),
  ]),

  // ═══════════════════════════════════════════════
  // WEEK 5: DP, Bits, Matrix, Strings + LLD Level 4-5 + Full Mocks
  // ═══════════════════════════════════════════════
  day(29, 'DP II (LIS & Subsets) + LLD Task Scheduler', [
    dsa('Dynamic Programming','LIS, Partition Subset & Grid Paths',
      'LIS: O(n²) DP or O(n log n) tails array + binary search. Number of LIS: track (length, count) per index. Partition equal subset: 0/1 knapsack on sum/2, iterate j right-to-left. Unique paths: dp[i][j] = up + left (or nCr). LCS: dp[i][j] = diag+1 on match else max(up, left).',
      'Medium',['#300 Longest Increasing Subsequence','#673 Number of Longest Increasing Subsequences','#416 Partition Equal Subset Sum','#62 Unique Paths','#1143 Longest Common Subsequence']),
    t('LLD','Level 4','L4.4 Task Scheduler with Worker Threads',
      'PriorityBlockingQueue (priority + submit time). ExecutorService worker pool. Scheduled tasks with cron-like repeat. Task status tracking.',
      'Hard',120,['Task with priority + submitTime','PriorityBlockingQueue<Task>','WorkerPool: ExecutorService','Scheduler: poll + execute','Recurring task support'],true),
  ]),
  day(30, 'DP III (Strings & Stocks) + Behavioral Polish', [
    dsa('Dynamic Programming','Edit Distance, Wildcard, Distinct Subsequences & Stocks',
      'Edit distance: dp[i][j] = match ? diag : 1 + min(insert, delete, replace). Wildcard: "*" → dp[i-1][j] || dp[i][j-1]. Distinct subsequences: dp[i][j] = dp[i-1][j] + (match ? dp[i-1][j-1] : 0). Min insertions for palindrome = n - LPS. Stock III: states buy1/sell1/buy2/sell2 updated per day.',
      'Hard',['#72 Edit Distance','#44 Wildcard Matching','#115 Distinct Subsequences','#1312 Minimum Insertion Steps to Make Palindrome','#123 Best Time to Buy and Sell Stock III','#97 Interleaving String']),
    t('Behavioral','Polish','Final Behavioral Polish — All Stories Review (20 min)',
      'Run through every STAR story you\'ve prepared. Time each one. Tighten anything over 2 minutes. Make sure results are quantified and you\'re saying "I" not "we".',
      'Theory',20,['Deliver every story out loud — time yourself','Trim any story over 2 minutes: cut context, keep action + result','Check: is every result quantified? If not, add a number.','Prep 3 questions to ask the interviewer (show genuine curiosity about their tech)','Run a mirror session: record yourself answering 2 random questions'],false),
  ]),
  day(31, 'DP IV (Interval & Hard) + LLD Order Matching', [
    dsa('Dynamic Programming','Burst Balloons, Palindrome Partitioning II & Job Scheduling',
      'Interval DP: fill by increasing length; burst balloons → choose LAST balloon k in (i, j). Palindrome partitioning II: precompute isPal, cuts[i] = min(cuts[j-1]+1). Job scheduling: sort by end, dp + binary search for last non-overlapping job. Longest increasing path: DFS + memo on grid.',
      'Hard',['#312 Burst Balloons','#132 Palindrome Partitioning II','#1235 Maximum Profit in Job Scheduling','#329 Longest Increasing Path in Matrix']),
    t('LLD','Level 4','L4.6 Order Matching Engine (Stock Exchange)',
      'Buy orders: max-heap (best price first). Sell orders: min-heap. Match when buy.price >= sell.price. Price-time priority.',
      'Hard',120,['Order: price, quantity, timestamp, side','BuyBook: PriorityQueue (max price)','SellBook: PriorityQueue (min price)','Match loop: buy.price >= sell.price'],true),
  ]),
  day(32, 'Bit Manipulation + Behavioral Mock', [
    dsa('Bit Manipulation','XOR Tricks, Bit Counting & Bitmasks',
      'XOR: a^a=0, a^0=a. Single Number II: ones/twos state machine (or count bits mod 3). Single Number III: xor all, split by lowest set bit (x & -x). Counting bits: dp[i] = dp[i>>1] + (i&1). Power set: iterate mask 0..(1<<n)-1. Divide: subtract shifted divisor, handle MIN_VALUE / -1 overflow. Watch: use 1L << i for i ≥ 31; >>> for unsigned shift.',
      'Medium',['#136 Single Number','#137 Single Number II','#260 Single Number III','#191 Number of 1 Bits','#338 Counting Bits','#268 Missing Number','Power Set using bitmask','#29 Divide Two Integers']),
    t('Behavioral','Mock','Behavioral Mock Interview (30 min)',
      'Pick 5 random behavioral questions. Answer using STAR format under 2-minute limit each. Record yourself or do with a friend.',
      'Mock',30,['5 random behavioral questions','STAR format: Situation-Task-Action-Result','2-min limit per answer'],false),
  ]),
  day(33, 'Matrix & Grid + LLD File System', [
    dsa('Matrix & Grid','Spiral, Rotate 90°, Set Zeroes & 2D Search',
      'Spiral: four shrinking boundaries, re-check top<=bottom && left<=right before each pass. Rotate 90°: transpose then reverse rows. Set zeroes: use first row/col as markers (O(1) space). Staircase search from top-right. Row with max 1s: walk left/down from top-right. Median in row-sorted matrix: binary search on value + upper bound per row.',
      'Medium',['#73 Set Matrix Zeroes','#54 Spiral Matrix','#48 Rotate Image','#240 Search a 2D Matrix II','Row with Maximum Ones','Median in Row-Sorted Matrix']),
    t('LLD','Level 5','L5.1 In-Memory File System (Composite Pattern)',
      'FileNode interface (getName, getSize, list). File and Directory both implement it. Directory.size() = recursive sum of children.',
      'Medium',105,['FileNode interface (size/list/name)','File extends FileNode','Directory: List<FileNode> children','FileSystem: path resolution (split by /)','Delete: recursive, Move: re-parent'],true),
  ]),
  day(34, 'WEEKEND · String Algorithms + LLD Food Delivery & ATM', [
    dsa('String Algorithms','KMP, Rabin-Karp & String Parsing',
      'KMP: build LPS (longest proper prefix = suffix), never move i backwards → O(n+m). Rabin-Karp: rolling hash with mod (two mods to cut collisions). Repeated substring: s is in (s+s).substring(1, 2n-1). atoi: trim, sign, digits, clamp before overflow. Compare versions: split on "\\.", compare int parts with zero padding.',
      'Medium',['#28 Find Index of First Occurrence (KMP)','#459 Repeated Substring Pattern','#686 Repeated String Match','#187 Repeated DNA Sequences','Search Pattern (Rabin-Karp)','#8 String to Integer (atoi)','#165 Compare Version Numbers']),
    dsa('String Algorithms','Shortest Palindrome, Longest Palindrome & Text Justification',
      'Shortest palindrome: KMP on s + "#" + reverse(s); LPS tail = longest palindromic prefix. Longest palindromic substring: expand around 2n-1 centres (O(n²), O(1) space). Text justification: greedy pack words, distribute spaces left-heavy, last line left-justified.',
      'Hard',['#214 Shortest Palindrome','#5 Longest Palindromic Substring','#68 Text Justification']),
    t('LLD','Level 5','L5.5 Food Delivery End-to-End (State + Strategy + Observer)',
      'Order state machine: PLACED→ACCEPTED→PREPARING→PICKED_UP→DELIVERED. Observer broadcasts transitions. Strategy assigns delivery agent.',
      'Hard',120,['OrderState machine (7 states)','AssignmentStrategy (nearest agent)','NotificationObserver (user/restaurant/agent)','DeliveryAgent with current location'],true),
    t('LLD','Level 5','L5.6 ATM (State + Chain of Responsibility)',
      'ATM states: CardInserted→PINEntered→TransactionSelect→Withdrawing→Ejecting. CoR for denomination breakdown (500→200→100→50→20→10).',
      'Hard',120,['ATMState machine (5 states)','CardInsertedState / PINEnteredState / WithdrawState','DenominationChain: 500→200→100→50','CashDispenser with denomination inventory'],true),
  ]),
  day(35, 'WEEKEND · FULL MOCK INTERVIEW DAY 🎯', [
    dsa('Mixed Hard','Hard Problem Blitz: Mixed Patterns',
      'Warm-up blitz of classic hard problems spanning binary search, intervals, DP and weighted graphs. Focus on clean code and edge cases before the full mocks.',
      'Hard',['#4 Median of Two Sorted Arrays','#218 The Skyline Problem','#1269 Number of Ways to Stay Same Place','#399 Evaluate Division (weighted graph)']),
    t('DSA','Full Mock','DSA Interview Round (45 min timed)',
      'Simulate a real DSA interview. 2 problems in 45 min. Think aloud. Cover edge cases. Write clean compilable code.',
      'Mock',60,['2 LeetCode Medium-Hard problems','Think aloud throughout','Cover edge cases','Analyze time & space complexity'],true),
    t('LLD','Full Mock','LLD Machine Coding Round (90 min timed)',
      'Full 90-min machine coding + 15 min self-score. Pick a Level 5 problem: Food Delivery / ATM / Ride Matching / Hotel Booking. No notes.',
      'Mock',105,['Pick a Level 5 LLD problem','90 min strict timer','Full SOLID design','Complete Main driver','Self-score with rubric'],true),
    t('HLD','Full Mock','System Design Round (45 min timed)',
      'Full system design interview simulation. Design a system of choice end-to-end with estimations.',
      'Mock',60,['Pick a system: WhatsApp / YouTube / Uber','Capacity estimation (QPS, storage)','Full architecture diagram','Discuss trade-offs'],true),
    t('Behavioral','Full Mock','Behavioral Round Simulation (30 min)',
      'Simulate a full behavioral round. 6 random questions, 2 min each. Practice delivery and conciseness. Finish with "why this company" and your questions for them.',
      'Mock',30,['6 random behavioral questions','2-min limit per question','"Why this company" + "your questions"'],false),
    t('DSA','Review','Weak Area Review Session',
      'Identify your 3 weakest problem types across all 5 weeks and re-solve 1-2 problems each. Re-read the Common Mistakes section of each.',
      'Review',90,['Review incorrect problems from earlier days','Focus on patterns not yet internalized'],false),
  ]),
];

export const TOTAL_DAYS = studyPlan.length;

export const getAllTasks = () => studyPlan.flatMap(d => d.tasks);

const TASKS_BY_ID = new Map(getAllTasks().map(t => [t.id, t]));
export const getTaskById = (id) => TASKS_BY_ID.get(id);

export const getTasksByCategory = () => {
  const all = getAllTasks();
  return {
    DSA: all.filter(t => t.category === 'DSA'),
    LLD: all.filter(t => t.category === 'LLD'),
    HLD: all.filter(t => t.category === 'HLD'),
    Behavioral: all.filter(t => t.category === 'Behavioral'),
  };
};

export const getDayData = (dayNum) => studyPlan.find(d => d.day === dayNum);

export const getWeekData = (weekNum) => studyPlan.filter(d => d.week === weekNum);

export const getTotalStats = () => {
  const all = getAllTasks();
  const byCategory = getTasksByCategory();
  return {
    total: all.length,
    byCategory: {
      DSA: byCategory.DSA.length,
      LLD: byCategory.LLD.length,
      HLD: byCategory.HLD.length,
      Behavioral: byCategory.Behavioral.length,
    },
    mustDo: all.filter(t => t.must).length,
  };
};
