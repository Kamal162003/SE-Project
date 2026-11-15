// Minimalist AI Mock Interview Engine
// Deterministic NLP concept-matching, STAR detection, multi-track questioning & grading

const TRACKS = {
  "software-engineer": {
    title: "Software Development Engineer (General)",
    questions: [
      {
        id: "intro",
        question: "Welcome! To start off, please briefly introduce yourself and walk me through a challenging technical project you recently worked on.",
        category: "behavioral",
        keyConcepts: ["architecture", "scale", "problem", "challenge", "solution", "result", "tech stack", "learned"],
        followUps: ["What was the most difficult technical trade-off you had to make in that project?", "If you had to build it again from scratch today, what would you change?"]
      },
      {
        id: "ds-algo",
        question: "When would you choose a Hash Map over a Balanced Binary Search Tree (like a Red-Black tree), and what are the trade-offs in terms of time and space complexity?",
        category: "technical",
        keyConcepts: ["o(1)", "o(log n)", "collision", "worst case", "ordered", "range queries", "memory", "rehashing"],
        followUps: ["How do modern hash maps handle hash collisions under high load factors?", "Can you describe a scenario where O(log n) tree traversal is strictly preferable?"]
      },
      {
        id: "debugging",
        question: "Imagine a production service suddenly exhibits high latency and CPU spikes after a deployment. Walk me through your step-by-step diagnostic and remediation process.",
        category: "situational",
        keyConcepts: ["logs", "metrics", "rollback", "profiling", "thread dump", "reproduce", "monitoring", "alert", "post-mortem", "isolate"],
        followUps: ["If rolling back is not an immediate option, how would you triage active traffic?"]
      },
      {
        id: "testing",
        question: "How do you maintain a balance between unit tests, integration tests, and end-to-end tests in a continuous delivery pipeline?",
        category: "technical",
        keyConcepts: ["test pyramid", "mock", "speed", "confidence", "ci/cd", "flaky", "regression", "coverage"],
        followUps: ["How do you address flaky end-to-end tests that block your deployment pipeline?"]
      },
      {
        id: "api-design",
        question: "What design principles do you adhere to when building backward-compatible, secure RESTful or GraphQL APIs?",
        category: "technical",
        keyConcepts: ["idempotency", "versioning", "authentication", "rate limiting", "status codes", "pagination", "schema"],
        followUps: ["How do you deprecate an old API version without breaking existing client integrations?"]
      }
    ]
  },
  "backend": {
    title: "Backend Engineer",
    questions: [
      {
        id: "db-indexing",
        question: "How do B-Tree indexes work in relational databases, and what happens behind the scenes during write vs read operations?",
        category: "technical",
        keyConcepts: ["b-tree", "disk", "node", "leaf", "binary search", "write overhead", "index maintenance", "selectivity", "range scan"],
        followUps: ["When might an index actually degrade query performance instead of helping?", "What is a composite index and why does column order matter?"]
      },
      {
        id: "caching",
        question: "What strategies do you use for cache invalidation, and how do you prevent common issues like cache stampede (thundering herd) and cache penetration?",
        category: "technical",
        keyConcepts: ["cache aside", "write through", "ttl", "mutex", "bloom filter", "redis", "invalidation", "stale data"],
        followUps: ["How would you design a distributed locking mechanism using Redis or similar tools?"]
      },
      {
        id: "concurrency",
        question: "Explain the difference between optimistic and pessimistic locking. When should each be used to prevent race conditions?",
        category: "technical",
        keyConcepts: ["version", "timestamp", "lock", "deadlock", "contention", "rollback", "throughput", "transaction isolation"],
        followUps: ["What isolation levels are you familiar with, and what is phantom read vs dirty read?"]
      },
      {
        id: "acid-base",
        question: "How do you achieve consistency in microservices where each service owns its own database? Compare 2-Phase Commit (2PC) with the Saga Pattern.",
        category: "technical",
        keyConcepts: ["saga", "compensating transaction", "2pc", "eventual consistency", "orchestration", "choreography", "outbox pattern"],
        followUps: ["How do you guarantee idempotent message consumption in a distributed event-driven saga?"]
      }
    ]
  },
  "frontend": {
    title: "Frontend Engineer",
    questions: [
      {
        id: "rendering",
        question: "Explain how browser rendering works from receiving HTML/CSS/JS to painting pixels on screen, and how you optimize the Critical Rendering Path.",
        category: "technical",
        keyConcepts: ["dom", "cssom", "render tree", "layout", "reflow", "repaint", "composite", "async", "defer", "bundle"],
        followUps: ["What causes layout thrashing and how can you detect and fix it in DevTools?"]
      },
      {
        id: "state-management",
        question: "How do you decide between local component state, context, and external state management solutions? What are the performance implications?",
        category: "technical",
        keyConcepts: ["re-render", "prop drilling", "context", "memoization", "selector", "immutability", "reactivity"],
        followUps: ["How does React reconciliation (Virtual DOM / Fiber) optimize re-rendering cycles?"]
      },
      {
        id: "web-vitals",
        question: "What Core Web Vitals (such as LCP, FID/INP, and CLS) do you track, and what specific steps do you take to improve them?",
        category: "technical",
        keyConcepts: ["lcp", "cls", "inp", "fid", "lazy load", "code splitting", "cdn", "image optimization", "font display"],
        followUps: ["How would you debug and fix unexpected Cumulative Layout Shift caused by dynamic content?"]
      },
      {
        id: "accessibility",
        question: "How do you build accessible (WCAG compliant) web applications, and what tooling or automated checks do you integrate into your workflow?",
        category: "technical",
        keyConcepts: ["aria", "semantic html", "keyboard navigation", "screen reader", "contrast", "focus management", "axe"],
        followUps: ["How do you manage focus trap in modal dialogs for keyboard-only navigation?"]
      }
    ]
  },
  "system-design": {
    title: "System Design & Distributed Architecture",
    questions: [
      {
        id: "rate-limiter",
        question: "Design a distributed rate limiter for a public API that receives 100,000 requests per second. Walk me through the architecture and algorithms you would choose.",
        category: "technical",
        keyConcepts: ["token bucket", "leaky bucket", "sliding window", "redis", "concurrency", "distributed", "race condition", "latency", "http 429"],
        followUps: ["How would you ensure accuracy when requests are distributed across multi-region datacenters?"]
      },
      {
        id: "event-driven",
        question: "When would you design a system around event-driven asynchronous messaging (e.g. Kafka or RabbitMQ) instead of synchronous REST/gRPC calls?",
        category: "technical",
        keyConcepts: ["decoupling", "backpressure", "idempotency", "ordering", "consumer groups", "eventual consistency", "dead letter queue"],
        followUps: ["How do you guarantee exactly-once or at-least-once message processing in distributed consumers?"]
      },
      {
        id: "cap-theorem",
        question: "Explain the CAP theorem and describe how your choice between consistency and availability influences database selection for a financial transaction system vs an analytics system.",
        category: "technical",
        keyConcepts: ["consistency", "availability", "partition tolerance", "acid", "base", "paxos", "raft", "replication", "trade-off"],
        followUps: ["How does PACELC theorem expand on CAP when there are no active network partitions?"]
      },
      {
        id: "url-shortener",
        question: "Walk me through the high-level design of a URL shortener like bit.ly capable of generating 100 million new URLs per month with sub-20ms redirect latency.",
        category: "technical",
        keyConcepts: ["base62", "hashing", "key generation service", "caching", "read heavy", "sharding", "analytics"],
        followUps: ["How would you prevent collision in key generation across multiple concurrent app servers?"]
      }
    ]
  },
  "devops": {
    title: "DevOps & Cloud Infrastructure",
    questions: [
      {
        id: "k8s-arch",
        question: "Explain the core architecture of Kubernetes (Control Plane vs Worker Nodes) and walk through what happens when you deploy a new Pod.",
        category: "technical",
        keyConcepts: ["kube-apiserver", "etcd", "kube-scheduler", "kubelet", "kube-proxy", "cni", "container runtime"],
        followUps: ["How does Kubernetes handle graceful termination of Pods during a rolling update?"]
      },
      {
        id: "cicd-security",
        question: "How do you enforce security and compliance within a CI/CD pipeline without slowing down engineering deployment frequency?",
        category: "technical",
        keyConcepts: ["sast", "dast", "secrets management", "container scanning", "least privilege", "pipeline as code", "sign images"],
        followUps: ["How do you safely inject production secrets into ephemeral CI test environments?"]
      },
      {
        id: "iac-drift",
        question: "What strategies and tools do you use for Infrastructure as Code (IaC) to detect and remediate configuration drift in production environments?",
        category: "technical",
        keyConcepts: ["terraform", "state file", "drift detection", "immutable infrastructure", "gitops", "argo", "plan"],
        followUps: ["How do you manage concurrent Terraform runs and avoid state file corruption?"]
      }
    ]
  },
  "aiml": {
    title: "AI / Machine Learning & Data Engineering",
    questions: [
      {
        id: "mlops-pipeline",
        question: "Describe your end-to-end MLOps pipeline from feature engineering and training to model validation, deployment, and real-time monitoring.",
        category: "technical",
        keyConcepts: ["feature store", "data drift", "concept drift", "model registry", "ci/cd for ml", "inference latency", "canary"],
        followUps: ["How do you detect and alert on data distribution shifts in streaming inference data?"]
      },
      {
        id: "rag-architecture",
        question: "How do you design a high-accuracy Retrieval-Augmented Generation (RAG) system? What chunking, embedding, and re-ranking techniques do you use?",
        category: "technical",
        keyConcepts: ["chunking", "vector database", "embedding", "cosine similarity", "re-ranking", "hallucination", "hybrid search"],
        followUps: ["How do you handle multi-modal context or tables within document retrieval?"]
      },
      {
        id: "data-lakehouse",
        question: "Compare Data Lakehouse architectures (e.g., Delta Lake / Apache Iceberg) with traditional Data Warehouses for both batch and streaming analytical workloads.",
        category: "technical",
        keyConcepts: ["acid transactions", "parquet", "schema evolution", "time travel", "streaming ingestion", "partitioning", "concurrency"],
        followUps: ["How does Apache Iceberg metadata layout eliminate directory listing bottlenecks on object stores?"]
      }
    ]
  },
  "behavioral": {
    title: "Behavioral & Leadership (STAR Method)",
    questions: [
      {
        id: "conflict",
        question: "Tell me about a time you strongly disagreed with a peer or engineering lead regarding a technical decision or architecture. How did you handle it, and what was the outcome?",
        category: "behavioral",
        keyConcepts: ["situation", "task", "action", "result", "data", "consensus", "compromise", "respect", "trade-off"],
        followUps: ["Looking back, was the agreed decision the right one, and what did you learn from the experience?"]
      },
      {
        id: "failure",
        question: "Describe a project or technical initiative that failed or did not meet expectations. What was your role, how did you respond, and what changes did you institute afterwards?",
        category: "behavioral",
        keyConcepts: ["ownership", "root cause", "post-mortem", "accountability", "blameless", "learnings", "prevention"],
        followUps: ["How did you communicate the setback to key stakeholders or team leadership?"]
      },
      {
        id: "deadline",
        question: "Tell me about a situation where you had to deliver a high-stakes project under tight deadlines with ambiguous or evolving requirements.",
        category: "behavioral",
        keyConcepts: ["prioritize", "scope", "mvp", "communication", "stakeholder", "trade-off", "clarification"],
        followUps: ["What trade-offs did you make between code quality and speed to hit the deadline?"]
      },
      {
        id: "mentorship",
        question: "Give an example of how you mentored a junior engineer or influenced your team's technical culture and engineering standards.",
        category: "behavioral",
        keyConcepts: ["coaching", "feedback", "growth", "standards", "code review", "documentation", "empathy"],
        followUps: ["How do you handle a team member who repeatedly resists adopting agreed-upon coding best practices?"]
      }
    ]
  }
};

// Reusable text normalization helper
function normalize(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Concept & Keyword matching
function analyzeKeywords(text, targetList) {
  const norm = normalize(text);
  const words = norm.split(" ");
  const matched = [];
  const missing = [];

  for (const concept of targetList) {
    const term = concept.toLowerCase();
    if (term.includes(" ") ? norm.includes(term) : words.includes(term)) {
      matched.push(concept);
    } else {
      missing.push(concept);
    }
  }

  const coverageRatio = targetList.length ? matched.length / targetList.length : 0;
  return { matched, missing, coverageRatio };
}

// Behavioral STAR detection
function detectSTAR(text) {
  const norm = normalize(text);
  const indicators = {
    situation: ["situation", "context", "background", "problem was", "at my previous", "working on"],
    task: ["task", "responsibility", "goal", "needed to", "my role", "objective"],
    action: ["action", "implemented", "decided", "built", "engineered", "collaborated", "refactored", "analyzed"],
    result: ["result", "outcome", "impact", "reduced", "improved", "increased", "learned", "metric", "percentage"]
  };

  const detected = {};
  let count = 0;
  for (const [phase, phrases] of Object.entries(indicators)) {
    const found = phrases.some((p) => norm.includes(p));
    detected[phase] = found;
    if (found) count++;
  }
  return { detected, score: (count / 4) * 100 };
}

// Validate answer quality to filter out gibberish, spam, or evasive non-answers
function validateAnswerQuality(text) {
  const norm = normalize(text);
  if (!norm || norm.length < 5) {
    return { valid: false, reason: "I need a bit more substance than that to evaluate your technical background." };
  }

  const words = norm.split(" ").filter(Boolean);
  const evasions = ["idk", "dont know", "dont", "no idea", "pass", "skip", "whatever", "dunno", "nothing", "na", "no", "yes", "ok", "nope", "not sure", "test", "testing", "asdf", "qwerty", "who knows", "bla", "blah"];

  if (words.length <= 4) {
    if (evasions.some((e) => norm === e || norm.startsWith(e + " ") || norm.endsWith(" " + e))) {
      return { valid: false, reason: "In a real technical interview, it's important to reason through the problem even if you're not 100% certain." };
    }
  }

  if (words.length < 3) {
    return { valid: false, reason: "That's a bit too brief to evaluate your technical depth." };
  }

  // Check for keyboard mashing, repeated characters, or vowel-less gibberish
  let gibberishWords = 0;
  for (const w of words) {
    if (w.length >= 5 && !/[aeiouy]/.test(w)) gibberishWords++;
    if (/(.)\1{3,}/.test(w)) gibberishWords++;
  }

  if (gibberishWords >= Math.ceil(words.length / 2)) {
    return { valid: false, reason: "That didn't quite come through as a coherent answer." };
  }

  return { valid: true };
}

// Realistic human conversational synthesizer for natural interview flow
function buildConversationalResponse(matched, missing, score, isFollowUp, followUpQ, nextQ) {
  const highAcks = [
    "Understood, that makes good sense.",
    "Got it—that's a practical and well-structured approach.",
    "Makes sense, I see how you're thinking about the problem.",
    "Fair point. That aligns well with standard production patterns.",
    "Right, that's an effective way to handle that constraint."
  ];

  const midAcks = [
    "I see what you mean.",
    "Fair enough, that gives me a reasonable starting picture.",
    "Understood.",
    "Got it—that addresses the core idea.",
    "Okay, that makes sense at a high level."
  ];

  const briefAcks = [
    "Understood. That touches on the basics.",
    "Okay, I follow your initial thought.",
    "Fair enough, though there's more depth to explore here."
  ];

  let ack = "";
  if (score >= 75) {
    ack = highAcks[Math.floor(Math.random() * highAcks.length)];
  } else if (score >= 55) {
    ack = midAcks[Math.floor(Math.random() * midAcks.length)];
  } else {
    ack = briefAcks[Math.floor(Math.random() * briefAcks.length)];
  }

  // Organic concept tie-in (varied)
  let conceptRemark = "";
  if (matched.length > 0 && Math.random() > 0.45) {
    const concept = matched[0];
    const remarks = [
      `Your point on ${concept} is particularly relevant here.`,
      `Bringing in ${concept} is a good call for this scenario.`,
      `Focusing on ${concept} makes sense.`
    ];
    conceptRemark = " " + remarks[Math.floor(Math.random() * remarks.length)];
  }

  // Smooth natural transition
  if (isFollowUp) {
    const followUpBridges = [
      "Let me probe a bit further on that:",
      "To take that a step deeper:",
      "How would you address this specific trade-off, though:",
      "Let's look at the constraints around that:"
    ];
    const bridge = followUpBridges[Math.floor(Math.random() * followUpBridges.length)];
    return `${ack}${conceptRemark} ${bridge} ${followUpQ}`;
  }

  if (nextQ) {
    const nextBridges = [
      "Let's shift gears to the next topic.",
      "Moving along to our next question.",
      "Let's explore another area.",
      "Now, let's look at a different technical challenge.",
      "Next, I'd like to hear your thoughts on this:"
    ];
    const bridge = nextBridges[Math.floor(Math.random() * nextBridges.length)];
    return `${ack}${conceptRemark} ${bridge} ${nextQ.question}`;
  }

  return `${ack}${conceptRemark} That brings us to the end of all the interview questions! Let's pull up your performance scorecard now.`;
}

// Dynamic questions from custom job description
function parseCustomRole(jobDescription) {
  const norm = normalize(jobDescription);
  const skillsMatrix = [
    { tag: "react", q: "How do you manage state and component re-render performance in large React applications?", concepts: ["hooks", "memo", "virtual dom", "state", "bundle"] },
    { tag: "node", q: "How does Node.js event loop handle asynchronous I/O, and how do you prevent blocking it?", concepts: ["event loop", "libuv", "call stack", "microtask", "streams", "worker threads"] },
    { tag: "python", q: "How do you optimize CPU-bound vs I/O-bound tasks in Python given the Global Interpreter Lock (GIL)?", concepts: ["gil", "multiprocessing", "asyncio", "threading", "profiling"] },
    { tag: "docker", q: "What best practices do you follow for multi-stage Docker builds and container security in CI/CD?", concepts: ["multi-stage", "layer caching", "non-root", "image size", "vulnerability"] },
    { tag: "sql", q: "How do you diagnose and optimize slow SQL queries that involve complex joins on million-row tables?", concepts: ["explain plan", "indexes", "normalization", "execution plan", "partitioning"] },
    { tag: "aws", q: "How do you architect resilient, auto-scaling applications on cloud platforms using best practices?", concepts: ["load balancer", "auto scaling", "iam", "multi-az", "cost", "monitoring"] },
    { tag: "microservices", q: "How do you handle distributed transactions and service discovery in a microservices ecosystem?", concepts: ["saga pattern", "eventual consistency", "api gateway", "circuit breaker"] }
  ];

  const matchedQuestions = [];
  for (const item of skillsMatrix) {
    if (norm.includes(item.tag)) {
      matchedQuestions.push({
        id: `custom-${item.tag}`,
        question: item.q,
        category: "technical",
        keyConcepts: item.concepts,
        followUps: ["Can you share a real-world scenario where you applied this in production?"]
      });
    }
  }

  if (matchedQuestions.length === 0) {
    matchedQuestions.push(
      {
        id: "custom-generic-arch",
        question: "Based on this role's requirements, walk me through how you would architect a scalable system to meet its core business goals.",
        category: "technical",
        keyConcepts: ["scalability", "maintainability", "testing", "monitoring", "trade-offs"],
        followUps: ["What would be your primary technical bottleneck under heavy usage?"]
      },
      {
        id: "custom-generic-collab",
        question: "How do you align technical engineering goals with tight product deadlines in cross-functional teams?",
        category: "behavioral",
        keyConcepts: ["prioritization", "communication", "stakeholders", "deliverables"],
        followUps: ["How do you handle scope creep during a sprint?"]
      }
    );
  }

  return matchedQuestions;
}

// Native Zero-Dependency LLM API Dispatcher (OpenAI & Google Gemini)
async function callLLM(provider, apiKey, systemInstruction, userMessage) {
  if (!apiKey) {
    throw new Error(`API key required for ${provider === "chatgpt" ? "ChatGPT (OpenAI)" : "Google Gemini"}. Please provide your API key in setup or configure environment variables.`);
  }

  if (provider === "chatgpt") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userMessage }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.error?.message || `OpenAI returned HTTP ${res.status}`;
      if (res.status === 429 || msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("credit")) {
        throw new Error("OpenAI account quota exceeded (insufficient credits). Please switch to Google Gemini or Built-in Engine.");
      }
      throw new Error(msg);
    }
    const data = await res.json();
    return data.choices[0].message.content;
  }

  if (provider === "gemini") {
    // Resilient multi-tier model cascade: gemini-3.5-flash -> gemini-3.5-flash-lite -> gemini-3.8-flash
    const candidateModels = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash"];
    let lastErr = null;

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemInstruction}\n\nCandidate Input:\n${userMessage}` }]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "application/json"
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          return data.candidates[0].content.parts[0].text;
        }

        const err = await res.json().catch(() => ({}));
        lastErr = new Error(err.error?.message || `Gemini (${model}) returned HTTP ${res.status}`);
      } catch (e) {
        lastErr = e;
      }
    }

    throw lastErr || new Error("Failed to contact Google Gemini API");
  }

  throw new Error(`Unsupported engine provider: ${provider}`);
}

// In-memory active session store
const sessions = new Map();
let lastFirstQuestionId = null;

// True uniform Fisher-Yates shuffle
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 6 Diverse Opening Archetypes to guarantee a fresh, non-repetitive interview start every single time
const OPENING_ARCHETYPES = [
  {
    style: "Production Incident & Triage",
    prompt: "Open with a high-stakes, realistic production emergency or sudden latency/outage scenario tailored to the role. Put the candidate in the hot seat to test their incident diagnostic intuition right from the start."
  },
  {
    style: "Architectural Dilemma & Hard Trade-offs",
    prompt: "Open directly with an architectural design dilemma or scaling bottleneck (e.g. choosing between consistency models, storage tiers, or caching topologies). Skip generic intros and challenge their architectural depth immediately."
  },
  {
    style: "System Deep-Dive & Engineering Ownership",
    prompt: "Challenge the candidate to dissect a complex, distributed production project they engineered, focusing specifically on their biggest technical bottleneck, what broke, and what they would re-architect differently today."
  },
  {
    style: "Green-Field Architecture Pitch",
    prompt: "Frame this as a green-field design challenge: the candidate is brought in on Day 1 to architect a core new scalable service for this domain. Ask for their immediate architectural blueprint, data model, and risk mitigations."
  },
  {
    style: "Technical Disagreement & Architecture Debate",
    prompt: "Frame this as a real-world scenario involving conflicting architectural philosophies on an engineering team. Ask the candidate how they navigate technical friction and evaluate competing trade-offs between velocity and long-term maintainability."
  },
  {
    style: "Subtle Concurrency & Edge-Case Investigation",
    prompt: "Frame this around a subtle, insidious edge case in production (e.g. race conditions under concurrent mutations, thundering herds, or partial network partitions). Challenge the candidate on how they prevent and debug this failure mode."
  }
];

let lastUsedArchetypeIndex = -1;

function getNextOpeningArchetype() {
  let idx = Math.floor(Math.random() * OPENING_ARCHETYPES.length);
  if (idx === lastUsedArchetypeIndex && OPENING_ARCHETYPES.length > 1) {
    idx = (idx + 1) % OPENING_ARCHETYPES.length;
  }
  lastUsedArchetypeIndex = idx;
  return OPENING_ARCHETYPES[idx];
}

class InterviewSession {
  constructor(id, trackKey, options = {}) {
    this.id = id;
    this.trackKey = trackKey;
    this.provider = options.provider || "local";
    this.apiKey = (options.apiKey || "").trim() || (this.provider === "chatgpt" ? process.env.OPENAI_API_KEY : this.provider === "gemini" ? process.env.GEMINI_API_KEY : "") || "";
    this.providerName = this.provider === "chatgpt" ? "ChatGPT (OpenAI)" : this.provider === "gemini" ? "Google Gemini" : "Built-in Minimal Engine";
    this.experienceLevel = options.experienceLevel || "mid"; // 'entry', 'mid', 'senior', 'staff'
    this.persona = options.persona || "neutral"; // 'supportive', 'challenging', 'neutral'
    this.customDescription = options.customDescription || "";
    this.currentQuestionIndex = 0;
    this.inFollowUp = false;
    this.turns = [];
    this.finished = false;

    // Load questions based on track
    let rawQuestions = [];
    if (trackKey === "custom" && this.customDescription) {
      rawQuestions = parseCustomRole(this.customDescription);
      this.title = "Custom Area Interview";
    } else {
      const track = TRACKS[trackKey] || TRACKS["software-engineer"];
      rawQuestions = [...track.questions];
      this.title = track.title;
    }

    // Limit questions based on questionCount option and shuffle with true Fisher-Yates
    const limit = Math.max(2, Math.min(10, parseInt(options.questionCount, 10) || 4));
    let shuffled = shuffleArray(rawQuestions);
    // Guarantee opening question is different from previous session
    if (lastFirstQuestionId && shuffled.length > 1 && shuffled[0].id === lastFirstQuestionId) {
      const swapIdx = Math.floor(Math.random() * (shuffled.length - 1)) + 1;
      [shuffled[0], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[0]];
    }
    if (shuffled[0]) {
      lastFirstQuestionId = shuffled[0].id;
    }
    this.questions = shuffled.slice(0, limit);
  }

  getCurrentQuestion() {
    if (this.finished || this.currentQuestionIndex >= this.questions.length) {
      return null;
    }
    return this.questions[this.currentQuestionIndex];
  }

  async submitAnswer(userAnswer) {
    const q = this.getCurrentQuestion();
    if (!q) {
      this.finished = true;
      return { finished: true, report: this.generateReport() };
    }

    const activeQuestion = this.inFollowUp ? q.followUps[0] : q.question;

    // 1. Rational Quality & Gibberish Check
    const quality = validateAnswerQuality(userAnswer);
    if (!quality.valid) {
      const retryPrompts = [
        `${quality.reason} Walk me through your thinking on this: "${activeQuestion}"`,
        `${quality.reason} Please take a moment to rethink and rewrite your approach: "${activeQuestion}"`,
        `${quality.reason} Let's try this question again: "${activeQuestion}"`
      ];
      return {
        retryRequired: true,
        reason: quality.reason,
        turn: null,
        nextPrompt: retryPrompts[Math.floor(Math.random() * retryPrompts.length)],
        finished: false,
        progress: {
          current: Math.min(this.currentQuestionIndex + 1, this.questions.length),
          total: this.questions.length
        }
      };
    }

    // Optional LLM Provider evaluation and dynamic question generation (ChatGPT or Gemini)
    if (this.provider === "chatgpt" || this.provider === "gemini") {
      try {
        const isLast = (this.currentQuestionIndex + 1 >= this.questions.length);

        const sysPrompt = `You are an expert technical interviewer conducting a mock interview for "${this.title}" (${this.experienceLevel} level, ${this.persona} persona).
The candidate was asked: "${activeQuestion}"
Current progress: Question ${this.currentQuestionIndex + 1} of ${this.questions.length}.

Evaluate the candidate's answer rationally.
- If the response is gibberish, spam, or evasive non-answers, set "isRubbish": true and provide a constructive redirect in "rubbishReason".
- Otherwise, rate technical depth and relevance (30 to 100) in "score".
- Identify key technical concepts demonstrated in "matchedConcepts" (array of strings, max 4).
- Identify relevant trade-offs or technical concepts missed in "missingConcepts" (array of strings, max 4).
- Provide constructive critique for the scorecard in "feedback".
- In "conversationalReply":
  ${isLast
    ? "Provide a natural human acknowledgment of their response and state that this concludes the questions for the interview."
    : "Provide a natural human acknowledgment of their response (mentioning a technical detail or trade-off from their answer), followed immediately by your next original technical question."
  }
- In "nextQuestionText": ${isLast ? '""' : '"The exact new technical question you are asking next (without conversational preamble)."'}

${isLast
  ? "This is the final interview question. Conclude the interview."
  : `Formulate Question ${this.currentQuestionIndex + 2} dynamically: either dive deeper into an edge case or scale challenge of their previous answer, or transition to an original engineering scenario for a ${this.experienceLevel} ${this.title}. DO NOT use textbook question templates.`
}

Respond STRICTLY in valid JSON matching this exact structure:
{
  "isRubbish": false,
  "rubbishReason": "",
  "score": 85,
  "matchedConcepts": ["concept1", "concept2"],
  "missingConcepts": ["concept3"],
  "conversationalReply": "Natural human acknowledgment and transition asking the next question",
  "nextQuestionText": "The question text",
  "feedback": "Constructive critique for the scorecard"
}`;

        const rawLLM = await callLLM(this.provider, this.apiKey, sysPrompt, userAnswer);
        let parsed = null;
        try {
          const cleanJson = rawLLM.replace(/```json/gi, "").replace(/```/g, "").trim();
          parsed = JSON.parse(cleanJson);
        } catch (e) {
          parsed = {
            score: 75,
            matchedConcepts: ["technical explanation"],
            missingConcepts: [],
            conversationalReply: rawLLM,
            nextQuestionText: upcomingFallback || "",
            feedback: "Evaluated by AI Engine."
          };
        }

        if (parsed.isRubbish) {
          return {
            retryRequired: true,
            reason: parsed.rubbishReason || "The response needs more technical substance.",
            turn: null,
            nextPrompt: `${parsed.rubbishReason || "I need a bit more technical substance on that."} Walk me through your thinking: "${activeQuestion}"`,
            finished: false,
            progress: {
              current: Math.min(this.currentQuestionIndex + 1, this.questions.length),
              total: this.questions.length
            }
          };
        }

        const llmTurnRecord = {
          questionId: q.id,
          question: activeQuestion,
          userAnswer,
          wordCount: (userAnswer.trim().split(/\s+/).filter(Boolean)).length,
          score: Math.min(100, Math.max(20, Math.round(parsed.score || 70))),
          matched: parsed.matchedConcepts || [],
          missing: parsed.missingConcepts || [],
          feedback: parsed.feedback || "Good discussion.",
          category: q.category
        };
        this.turns.push(llmTurnRecord);

        this.currentQuestionIndex++;
        if (this.currentQuestionIndex >= this.questions.length) {
          this.finished = true;
        } else {
          // Robustly determine and assign the next dynamic question
          let nextQStr = (parsed.nextQuestionText || parsed.nextQuestion || "").trim();
          if (nextQStr.length < 10 && parsed.conversationalReply) {
            // Extract the question part from conversationalReply
            const sentences = parsed.conversationalReply.split(/(?<=[.?!])\s+/);
            const questionSentence = sentences.reverse().find(s => s.trim().endsWith("?"));
            if (questionSentence && questionSentence.trim().length > 10) {
              nextQStr = questionSentence.trim();
            } else {
              nextQStr = parsed.conversationalReply.trim();
            }
          }
          if (nextQStr && this.questions[this.currentQuestionIndex]) {
            this.questions[this.currentQuestionIndex].question = nextQStr;
          }
        }

        return {
          turn: llmTurnRecord,
          nextPrompt: parsed.conversationalReply || parsed.nextQuestionText || "Let's move to the next question.",
          isFollowUpPrompt: false,
          finished: this.finished,
          progress: {
            current: Math.min(this.currentQuestionIndex + 1, this.questions.length),
            total: this.questions.length
          }
        };
      } catch (err) {
        console.warn(`[${this.provider}] LLM evaluation failed: ${err.message}. Falling back gracefully to local engine for this turn.`);
      }
    }

    // Deterministic Local NLP Engine fallback/default
    const wordCount = (userAnswer.trim().split(/\s+/).filter(Boolean)).length;
    const { matched, missing, coverageRatio } = analyzeKeywords(userAnswer, q.keyConcepts);

    let starData = null;
    if (q.category === "behavioral") {
      starData = detectSTAR(userAnswer);
    }

    let baseMultiplier = 60;
    let expectedWords = 50;
    if (this.experienceLevel === "entry") {
      baseMultiplier = 70;
      expectedWords = 35;
    } else if (this.experienceLevel === "senior" || this.experienceLevel === "staff") {
      baseMultiplier = 50;
      expectedWords = 70;
    }

    let score = Math.round(coverageRatio * baseMultiplier);
    const depthScore = Math.min(25, Math.round((wordCount / expectedWords) * 25));
    score += depthScore;

    if (starData) {
      score += Math.round(starData.score * 0.15);
    } else {
      score += 15;
    }
    score = Math.min(100, Math.max(30, score));

    const matchedMention = matched.length > 0 ? `Demonstrated knowledge of ${matched.slice(0, 2).join(" and ")}.` : "";
    const missingMention = missing.length > 0 && missing.length <= 4 ? `Explore implications on ${missing.slice(0, 2).join(" and ")}.` : "";

    let feedback = "";
    if (this.persona === "supportive") {
      feedback = (score >= 75 ? `Well reasoned. ${matchedMention}` : `Good attempt. ${matchedMention} ${missingMention}`).trim();
    } else if (this.persona === "challenging") {
      feedback = (score >= 80 ? `Solid technical depth. ${matchedMention}` : `High-level response. ${matchedMention} ${missingMention}`).trim();
    } else {
      feedback = (score >= 80 ? `Strong answer. ${matchedMention}` : `Reasonable foundation. ${matchedMention} ${missingMention}`).trim();
    }

    const turnRecord = {
      questionId: q.id,
      question: activeQuestion,
      userAnswer,
      wordCount,
      score,
      matched,
      missing,
      feedback,
      category: q.category
    };
    this.turns.push(turnRecord);

    let nextPrompt = "";
    let isFollowUpPrompt = false;

    if (!this.inFollowUp && q.followUps && q.followUps.length > 0 && (wordCount < 40 || coverageRatio < 0.45)) {
      this.inFollowUp = true;
      isFollowUpPrompt = true;
      nextPrompt = buildConversationalResponse(matched, missing, score, true, q.followUps[0], null);
    } else {
      this.inFollowUp = false;
      this.currentQuestionIndex++;

      const nextTargetQ = this.getCurrentQuestion();
      if (nextTargetQ) {
        nextPrompt = buildConversationalResponse(matched, missing, score, false, null, nextTargetQ);
      } else {
        this.finished = true;
        nextPrompt = buildConversationalResponse(matched, missing, score, false, null, null);
      }
    }

    return {
      turn: turnRecord,
      nextPrompt,
      isFollowUpPrompt,
      finished: this.finished,
      progress: {
        current: Math.min(this.currentQuestionIndex + 1, this.questions.length),
        total: this.questions.length
      }
    };
  }

  endEarly() {
    this.finished = true;
    return this.generateReport();
  }

  generateReport() {
    if (this.turns.length === 0) {
      return {
        roleTitle: this.title,
        experienceLevel: this.experienceLevel,
        overallScore: 0,
        grade: "N/A",
        avgWordsPerAnswer: 0,
        totalQuestions: 0,
        technicalScore: 0,
        communicationScore: 0,
        strengths: ["Interview ended before answering any questions."],
        improvements: ["Try answering at least 2-3 questions to get a complete assessment."],
        turns: []
      };
    }

    const avgScore = Math.round(
      this.turns.reduce((sum, t) => sum + t.score, 0) / this.turns.length
    );

    const totalWords = this.turns.reduce((sum, t) => sum + t.wordCount, 0);
    const avgWordsPerAnswer = Math.round(totalWords / this.turns.length);

    // Category scores
    const techTurns = this.turns.filter((t) => t.category !== "behavioral");
    const techScore = techTurns.length
      ? Math.round(techTurns.reduce((s, t) => s + t.score, 0) / techTurns.length)
      : avgScore;

    const commScore = Math.min(100, Math.max(40, Math.round((avgWordsPerAnswer / 65) * 50 + 40)));

    let grade = "A";
    if (avgScore < 60) grade = "C";
    else if (avgScore < 75) grade = "B";
    else if (avgScore < 90) grade = "A";
    else grade = "A+";

    const allStrengths = [];
    const allImprovements = [];

    this.turns.forEach((t) => {
      if (t.matched.length > 0) {
        allStrengths.push(`Demonstrated knowledge of ${t.matched.slice(0, 3).join(", ")} in ${t.category} questions`);
      }
      if (t.missing.length > 1) {
        allImprovements.push(`Explore more on ${t.missing.slice(0, 2).join(", ")} to demonstrate senior-level depth`);
      }
    });

    if (avgWordsPerAnswer >= 50) {
      allStrengths.push("Provided well-elaborated, detailed answers rather than one-line responses.");
    } else {
      allImprovements.push("Provide more structured depth and context in your answers (aim for 50-80 words).");
    }

    return {
      roleTitle: this.title,
      experienceLevel: this.experienceLevel,
      provider: this.provider,
      providerName: this.providerName,
      overallScore: avgScore,
      technicalScore: techScore,
      communicationScore: commScore,
      grade,
      avgWordsPerAnswer,
      totalQuestions: this.turns.length,
      totalScheduled: this.questions.length,
      strengths: [...new Set(allStrengths)].slice(0, 4),
      improvements: [...new Set(allImprovements)].slice(0, 4),
      turns: this.turns
    };
  }
}

async function startSession(trackKey, options) {
  const sessionId = "session_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
  const session = new InterviewSession(sessionId, trackKey, options);

  if (session.provider === "chatgpt" && !session.apiKey) {
    throw new Error("OpenAI API Key is required to run with ChatGPT. Please paste your key in the setup form or configure OPENAI_API_KEY in .env.");
  }
  if (session.provider === "gemini" && !session.apiKey) {
    throw new Error("Google Gemini API Key is required to run with Gemini. Please paste your key in the setup form or configure GEMINI_API_KEY in .env.");
  }

  let engineNotice = null;
  // If AI engine is selected, initialize the opening question dynamically with the AI
  if (session.provider === "chatgpt" || session.provider === "gemini") {
    try {
      const archetype = getNextOpeningArchetype();
      const initPrompt = `You are an expert technical interviewer conducting a mock interview for the role of "${session.title}" (${session.experienceLevel} level, ${session.persona} persona).
${session.customDescription ? `Role context & focus: "${session.customDescription}"` : ""}

INTERVIEW OPENING STYLE FOR THIS SESSION: [${archetype.style}]
${archetype.prompt}

Generate a sharp, realistic, and authentic opening question following this specific interview angle.
DO NOT use cliché pleasantries like "Welcome, let's dive right in" or repetitive formulas. Jump straight into the technical scenario with professional punch.
Respond STRICTLY in valid JSON:
{
  "question": "Your original opening question here"
}`;
      const raw = await callLLM(session.provider, session.apiKey, initPrompt, "Start the interview with the first question.");
      const clean = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (parsed.question && parsed.question.trim().length > 10) {
        if (session.questions[0]) {
          session.questions[0].question = parsed.question.trim();
        }
      }
    } catch (err) {
      console.warn(`[${session.provider}] Dynamic opening question generation: ${err.message}. Curated track question active.`);
      if (err.message.toLowerCase().includes("quota") || err.message.toLowerCase().includes("credit") || err.message.toLowerCase().includes("key")) {
        session.provider = "local";
        session.providerName = "Built-in Minimal Engine (Fallback)";
      }
      engineNotice = `AI Notice: ${err.message}`;
    }
  }

  sessions.set(sessionId, session);
  return {
    sessionId,
    title: session.title,
    firstQuestion: session.getCurrentQuestion().question,
    totalQuestions: session.questions.length,
    experienceLevel: session.experienceLevel,
    persona: session.persona,
    provider: session.provider,
    providerName: session.providerName,
    notice: engineNotice
  };
}

async function processTurn(sessionId, userAnswer) {
  const session = sessions.get(sessionId);
  if (!session) throw new Error("Session not found or expired.");
  return await session.submitAnswer(userAnswer);
}

function endSessionEarly(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) throw new Error("Session not found.");
  return session.endEarly();
}

function getReport(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) throw new Error("Session not found.");
  return session.generateReport();
}

module.exports = {
  startSession,
  processTurn,
  endSessionEarly,
  getReport
};
