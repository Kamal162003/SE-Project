// Minimalist AI Mock Interviewer — Studio Edition Flow Controller
// Zero External API dependencies, Native Browser Web Speech (STT + TTS)
// Real-time Canvas Acoustic Visualizer & Hardware Control Binding

// State
let sessionId = null;
let currentReport = null;
let recognition = null;
let isRecording = false;
let isSpeakingActive = false;

// DOM Elements
const views = {
  setup: document.getElementById("pageSetup"),
  interview: document.getElementById("pageInterview"),
  report: document.getElementById("pageReport")
};

const steps = {
  1: document.getElementById("step1"),
  2: document.getElementById("step2"),
  3: document.getElementById("step3")
};

// Form inputs
const trackSelect = document.getElementById("trackSelect");
const engineSelect = document.getElementById("engineSelect");
const apiKeyGroup = document.getElementById("apiKeyGroup");
const apiKeyLabel = document.getElementById("apiKeyLabel");
const apiKeyInput = document.getElementById("apiKeyInput");
const apiKeyHint = document.getElementById("apiKeyHint");
const expLevelSelect = document.getElementById("expLevelSelect");
const personaSelect = document.getElementById("personaSelect");
const questionCountSelect = document.getElementById("questionCountSelect");
const voiceToggle = document.getElementById("voiceToggle");
const startBtn = document.getElementById("startBtn");

// Interview screen elements
const sessionRole = document.getElementById("sessionRole");
const sessionExp = document.getElementById("sessionExp");
const sessionPersona = document.getElementById("sessionPersona");
const sessionEngine = document.getElementById("sessionEngine");
const endEarlyBtn = document.getElementById("endEarlyBtn");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const chatViewport = document.getElementById("chatViewport");
const speakingBanner = document.getElementById("speakingBanner");
const speakingText = document.getElementById("speakingText");
const answerInput = document.getElementById("answerInput");
const micBtn = document.getElementById("micBtn");
const submitBtn = document.getElementById("submitBtn");
const liveWordCounter = document.getElementById("liveWordCounter");

// Report screen elements
const reportSubtitle = document.getElementById("reportSubtitle");
const reportGrade = document.getElementById("reportGrade");
const reportOverallScore = document.getElementById("reportOverallScore");
const reportTechScore = document.getElementById("reportTechScore");
const reportCommScore = document.getElementById("reportCommScore");
const reportWordAvg = document.getElementById("reportWordAvg");
const reportStrengths = document.getElementById("reportStrengths");
const reportImprovements = document.getElementById("reportImprovements");
const reportTurnsContainer = document.getElementById("reportTurnsContainer");
const downloadReportBtn = document.getElementById("downloadReportBtn");
const newInterviewBtn = document.getElementById("newInterviewBtn");

// Page Navigation
function navigateTo(stepNum) {
  Object.values(views).forEach((v) => {
    if (v) v.classList.add("hidden");
  });
  Object.values(steps).forEach((s) => {
    if (s) s.classList.remove("active");
  });

  if (stepNum === 1 && views.setup) {
    views.setup.classList.remove("hidden");
    if (steps[1]) steps[1].classList.add("active");
  } else if (stepNum === 2 && views.interview) {
    views.interview.classList.remove("hidden");
    if (steps[2]) steps[2].classList.add("active");
  } else if (stepNum === 3 && views.report) {
    views.report.classList.remove("hidden");
    if (steps[3]) steps[3].classList.add("active");
  }
}

// ==========================================================================
// REAL-TIME ACOUSTIC CANVAS VISUALIZER (Sonic Lamb & Teenage Engineering)
// ==========================================================================
const audioCanvas = document.getElementById("audioCanvas");
let canvasCtx = null;
let visualizerAnimationId = null;

function initAudioVisualizer() {
  if (!audioCanvas) return;
  canvasCtx = audioCanvas.getContext("2d");

  function resizeCanvas() {
    const rect = audioCanvas.getBoundingClientRect();
    if (rect.width > 0) {
      audioCanvas.width = rect.width * (window.devicePixelRatio || 1);
      audioCanvas.height = rect.height * (window.devicePixelRatio || 1);
    }
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  let phase = 0;
  function renderFrame() {
    if (!canvasCtx || !audioCanvas) return;
    const w = audioCanvas.width;
    const h = audioCanvas.height;
    canvasCtx.clearRect(0, 0, w, h);

    // Active state dynamics
    const active = isSpeakingActive || isRecording;
    const baseAmp = active ? (isRecording ? 28 : 22) : 6;
    const freq = active ? 0.02 : 0.01;
    phase += active ? 0.045 : 0.015;

    // Centerline baseline
    const centerY = h / 2;

    // Harmonic layers
    const waves = [
      { color: isRecording ? "rgba(244, 63, 94, 0.85)" : "rgba(99, 102, 241, 0.85)", amp: baseAmp, speed: 1.0, offset: 0, lineWidth: 2.2 },
      { color: isRecording ? "rgba(251, 146, 60, 0.65)" : "rgba(168, 85, 247, 0.65)", amp: baseAmp * 0.75, speed: 1.3, offset: Math.PI / 3, lineWidth: 1.8 },
      { color: isRecording ? "rgba(245, 158, 11, 0.45)" : "rgba(56, 189, 248, 0.45)", amp: baseAmp * 0.5, speed: 0.8, offset: Math.PI / 1.8, lineWidth: 1.2 }
    ];

    waves.forEach((wave) => {
      canvasCtx.beginPath();
      canvasCtx.strokeStyle = wave.color;
      canvasCtx.lineWidth = wave.lineWidth;

      for (let x = 0; x < w; x += 3) {
        const normX = x / w;
        // Hanning window envelope to taper nicely at both edges
        const envelope = Math.sin(normX * Math.PI);
        const y = centerY + Math.sin(x * freq * wave.speed + phase + wave.offset) * wave.amp * envelope;
        if (x === 0) canvasCtx.moveTo(x, y);
        else canvasCtx.lineTo(x, y);
      }
      canvasCtx.stroke();
    });

    visualizerAnimationId = requestAnimationFrame(renderFrame);
  }

  renderFrame();
}

// ==========================================================================
// INTERACTIVE DOMAIN CHIPS & ENGINE CARDS SYNC
// ==========================================================================
const domainChips = document.querySelectorAll("#domainChips .domain-chip");
if (domainChips.length > 0 && trackSelect) {
  domainChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      domainChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const val = chip.getAttribute("data-value");
      trackSelect.value = val;
    });
  });
}

const engineCards = document.querySelectorAll("#engineCards .engine-card");
if (engineCards.length > 0 && engineSelect) {
  engineCards.forEach((card) => {
    card.addEventListener("click", () => {
      engineCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      const engine = card.getAttribute("data-engine");
      engineSelect.value = engine;
      updateApiKeyVisibility();
    });
  });
}

// Domain select change sync
if (trackSelect) {
  trackSelect.addEventListener("change", () => {
    if (domainChips.length > 0) {
      domainChips.forEach((chip) => {
        chip.classList.toggle("active", chip.getAttribute("data-value") === trackSelect.value);
      });
    }
  });
}

// Live Word Counter
if (answerInput && liveWordCounter) {
  answerInput.addEventListener("input", () => {
    const text = answerInput.value.trim();
    const count = text ? text.split(/\s+/).length : 0;
    liveWordCounter.textContent = `${count} word${count === 1 ? "" : "s"}`;
    if (count >= 50 && count <= 90) {
      liveWordCounter.style.color = "var(--accent-emerald)";
    } else if (count > 90) {
      liveWordCounter.style.color = "var(--accent-amber)";
    } else {
      liveWordCounter.style.color = "var(--text-muted)";
    }
  });
}

// Server config & persistent key storage
let serverConfig = { hasOpenAIKey: false, hasGeminiKey: false };

async function loadServerConfig() {
  try {
    const res = await fetch("/api/config");
    serverConfig = await res.json();
    updateApiKeyVisibility();
  } catch (e) {}
}

function updateApiKeyVisibility() {
  if (!engineSelect || !apiKeyGroup) return;
  const val = engineSelect.value;

  // Sync cards state
  if (engineCards.length > 0) {
    engineCards.forEach((c) => c.classList.toggle("active", c.getAttribute("data-engine") === val));
  }

  if (val === "local") {
    apiKeyGroup.classList.add("hidden");
    return;
  }

  apiKeyGroup.classList.remove("hidden");
  const isChatGPT = val === "chatgpt";
  const hasEnvKey = isChatGPT ? serverConfig.hasOpenAIKey : serverConfig.hasGeminiKey;

  if (apiKeyLabel) {
    apiKeyLabel.textContent = isChatGPT
      ? (hasEnvKey ? "OpenAI API Key (✓ Loaded from server .env)" : "OpenAI API Key (Required)")
      : (hasEnvKey ? "Google Gemini API Key (✓ Loaded from server .env)" : "Google Gemini API Key (Required)");
  }

  const savedKey = localStorage.getItem(`apikey_${val}`) || "";
  if (apiKeyInput) {
    apiKeyInput.value = savedKey;
    apiKeyInput.placeholder = hasEnvKey
      ? "Loaded from server .env (leave blank to use .env key)"
      : (isChatGPT ? "Paste OpenAI key: sk-..." : "Paste Gemini key: AIzaSy...");

    if (!hasEnvKey && !apiKeyInput.value) {
      apiKeyInput.focus();
    }
  }
}

if (engineSelect) {
  engineSelect.addEventListener("change", updateApiKeyVisibility);
}

if (apiKeyInput) {
  apiKeyInput.addEventListener("input", () => {
    const val = engineSelect ? engineSelect.value : "local";
    if (val !== "local") {
      localStorage.setItem(`apikey_${val}`, apiKeyInput.value.trim());
    }
  });
}

// ==========================================================================
// WEB SPEECH RECOGNITION (STT)
// ==========================================================================
function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (micBtn) {
      micBtn.style.opacity = "0.5";
      micBtn.title = "Speech recognition is not supported in this browser.";
    }
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (e) => {
    let transcript = "";
    for (let i = 0; i < e.results.length; i++) {
      transcript += e.results[i][0].transcript + " ";
    }
    if (answerInput) {
      answerInput.value = transcript.trim();
      answerInput.dispatchEvent(new Event("input"));
    }
  };

  recognition.onerror = () => stopRecording();
  recognition.onend = () => { if (isRecording) stopRecording(); };
}

function startRecording() {
  if (!recognition) return;
  try {
    recognition.start();
    isRecording = true;
    if (micBtn) micBtn.classList.add("recording");
  } catch (e) {}
}

function stopRecording() {
  if (!recognition) return;
  try {
    recognition.stop();
  } catch (e) {}
  isRecording = false;
  if (micBtn) micBtn.classList.remove("recording");
}

if (micBtn) {
  micBtn.addEventListener("click", () => {
    if (isRecording) stopRecording();
    else startRecording();
  });
}

// ==========================================================================
// TEXT-TO-SPEECH (TTS) WITH PERSISTENT VOICE PINNING
// ==========================================================================
let pinnedVoice = null;

function getConsistentVoice() {
  if (pinnedVoice) return pinnedVoice;
  if (!("speechSynthesis" in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  pinnedVoice =
    voices.find((v) => v.name === "Google US English") ||
    voices.find((v) => v.name.includes("Google") && v.lang.startsWith("en")) ||
    voices.find((v) => v.name.includes("Natural") && v.lang.startsWith("en")) ||
    voices.find((v) => v.name.includes("Samantha") && v.lang.startsWith("en")) ||
    voices.find((v) => v.lang === "en-US") ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0];

  return pinnedVoice;
}

if ("speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    if (!pinnedVoice) getConsistentVoice();
  };
}

function speak(text, onComplete) {
  if (voiceToggle && voiceToggle.value !== "on") {
    if (onComplete) onComplete();
    return;
  }
  if (!("speechSynthesis" in window)) {
    if (onComplete) onComplete();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  const voice = getConsistentVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang || "en-US";
  }

  if (speakingBanner) speakingBanner.classList.remove("hidden");
  if (speakingText) speakingText.textContent = "Interviewer is speaking...";
  isSpeakingActive = true;

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(safetyTimer);
    isSpeakingActive = false;
    if (speakingBanner) speakingBanner.classList.add("hidden");
    if (onComplete) onComplete();
  };

  const safetyTimer = setTimeout(finish, Math.min(25000, Math.max(3000, text.length * 85)));

  utterance.onend = finish;
  utterance.onerror = finish;
  window.speechSynthesis.speak(utterance);
}

// Chat bubble builder
function appendBubble(sender, text, isWarning = false) {
  if (!chatViewport) return;

  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}${isWarning ? " warning" : ""}`;

  if (sender === "interviewer") {
    const metaTag = document.createElement("div");
    metaTag.className = "interviewer-meta-tag";
    metaTag.innerHTML = `<span>QUESTION // TECHNICAL QUERY</span>`;
    bubble.appendChild(metaTag);
  }

  const p = document.createElement("p");
  p.textContent = text;
  bubble.appendChild(p);

  if (isWarning) {
    const badge = document.createElement("div");
    badge.className = "retry-badge";
    badge.textContent = "Please elaborate on your technical approach.";
    bubble.appendChild(badge);
  }

  chatViewport.appendChild(bubble);
  chatViewport.scrollTop = chatViewport.scrollHeight;
}

function appendNotice(text) {
  if (!chatViewport) return;
  const notice = document.createElement("div");
  notice.className = "engine-notice";
  notice.textContent = text;
  chatViewport.appendChild(notice);
  chatViewport.scrollTop = chatViewport.scrollHeight;
}

// Progress update
function updateProgress(current, total) {
  if (progressFill && progressText) {
    const pct = Math.min(100, Math.round((current / total) * 100));
    progressFill.style.width = `${pct}%`;
    progressText.textContent = `Question ${current} of ${total}`;
  }
}

// ==========================================================================
// PAGE 1: START INTERVIEW
// ==========================================================================
if (startBtn) {
  startBtn.addEventListener("click", async () => {
    if (engineSelect && engineSelect.value !== "local") {
      const isChatGPT = engineSelect.value === "chatgpt";
      const hasServerKey = isChatGPT ? serverConfig.hasOpenAIKey : serverConfig.hasGeminiKey;
      const enteredKey = apiKeyInput ? apiKeyInput.value.trim() : "";

      if (!hasServerKey && !enteredKey) {
        alert(
          `An API Key is required to run with ${isChatGPT ? "ChatGPT (OpenAI)" : "Google Gemini"}.\n\nPlease paste your ${
            isChatGPT ? "OpenAI API key (sk-...)" : "Gemini API key"
          } in the box below, or switch back to the Built-in Engine to practice for free without any key.`
        );
        if (apiKeyInput) apiKeyInput.focus();
        return;
      }
    }

    const payload = {
      track: trackSelect ? trackSelect.value : "software-engineer",
      provider: engineSelect ? engineSelect.value : "local",
      apiKey: apiKeyInput ? apiKeyInput.value.trim() : "",
      customDescription: "",
      experienceLevel: expLevelSelect ? expLevelSelect.value : "mid",
      persona: personaSelect ? personaSelect.value : "neutral",
      questionCount: questionCountSelect ? questionCountSelect.value : "4"
    };

    startBtn.disabled = true;

    try {
      const res = await fetch("/api/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start");

      sessionId = data.sessionId;
      if (sessionRole) sessionRole.textContent = data.title;
      if (sessionExp && expLevelSelect) {
        sessionExp.textContent = expLevelSelect.options[expLevelSelect.selectedIndex].text.split(" ")[0];
      }
      if (sessionPersona && personaSelect) {
        sessionPersona.textContent = personaSelect.options[personaSelect.selectedIndex].text.split(" ")[0];
      }
      if (sessionEngine) {
        sessionEngine.textContent = data.providerName || (engineSelect.value === "chatgpt" ? "ChatGPT" : engineSelect.value === "gemini" ? "Gemini" : "Built-in");
      }

      if (chatViewport) chatViewport.innerHTML = "";
      updateProgress(1, data.totalQuestions);

      navigateTo(2); // Go to Page 2
      if (data.notice) {
        appendNotice(data.notice);
      }
      appendBubble("interviewer", data.firstQuestion);
      speak(data.firstQuestion);
      if (answerInput) {
        answerInput.value = "";
        answerInput.focus();
        if (liveWordCounter) liveWordCounter.textContent = "0 words";
      }
    } catch (err) {
      alert("Could not start interview: " + err.message);
    } finally {
      startBtn.disabled = false;
    }
  });
}

// ==========================================================================
// PAGE 2: SUBMIT ANSWER
// ==========================================================================
async function submitTurn() {
  if (!answerInput) return;
  const answer = answerInput.value.trim();
  if (!answer || !sessionId) return;

  if (isRecording) stopRecording();

  appendBubble("user", answer);
  answerInput.value = "";
  if (liveWordCounter) liveWordCounter.textContent = "0 words";
  answerInput.disabled = true;
  if (submitBtn) submitBtn.disabled = true;

  try {
    const res = await fetch("/api/turn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, answer })
    });
    const data = await res.json();

    if (data.retryRequired) {
      appendBubble("interviewer", data.nextPrompt, true);
      speak(data.nextPrompt, () => {
        answerInput.disabled = false;
        if (submitBtn) submitBtn.disabled = false;
        answerInput.focus();
      });
      return;
    }

    if (data.notice) {
      appendNotice(data.notice);
    }

    appendBubble("interviewer", data.nextPrompt);

    if (data.finished) {
      speak(data.nextPrompt, async () => {
        const repRes = await fetch(`/api/report?sessionId=${sessionId}`);
        const repData = await repRes.json();
        renderReport(repData.report);
      });
    } else {
      if (data.progress) {
        updateProgress(data.progress.current, data.progress.total);
      }
      speak(data.nextPrompt, () => {
        answerInput.disabled = false;
        if (submitBtn) submitBtn.disabled = false;
        answerInput.focus();
      });
    }
  } catch (err) {
    alert("Error processing answer: " + err.message);
    answerInput.disabled = false;
    if (submitBtn) submitBtn.disabled = false;
  }
}

if (submitBtn) submitBtn.addEventListener("click", submitTurn);
if (answerInput) {
  answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitTurn();
    }
  });
}

// ==========================================================================
// PAGE 2: END TEST EARLY
// ==========================================================================
if (endEarlyBtn) {
  endEarlyBtn.addEventListener("click", async () => {
    if (!confirm("Are you sure you want to end the test now? Your scorecard will be generated based on answers provided so far.")) {
      return;
    }

    window.speechSynthesis.cancel();
    if (isRecording) stopRecording();

    try {
      const res = await fetch("/api/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });
      const data = await res.json();
      renderReport(data.report);
    } catch (err) {
      alert("Could not end test: " + err.message);
    }
  });
}

// ==========================================================================
// PAGE 3: RENDER REPORT
// ==========================================================================
function renderReport(report) {
  if (!report) return;
  currentReport = report;

  if (reportSubtitle) {
    reportSubtitle.textContent = `${report.roleTitle} • Level: ${report.experienceLevel.toUpperCase()} • Engine: ${report.providerName || "Built-in"}`;
  }
  if (reportGrade) reportGrade.textContent = report.grade;
  if (reportOverallScore) reportOverallScore.textContent = `${report.overallScore}%`;
  if (reportTechScore) reportTechScore.textContent = `${report.technicalScore}%`;
  if (reportCommScore) reportCommScore.textContent = `${report.communicationScore}%`;
  if (reportWordAvg) reportWordAvg.textContent = report.avgWordsPerAnswer;

  // Animated SVG Circular Gauge
  const scoreGaugeBar = document.getElementById("scoreGaugeBar");
  if (scoreGaugeBar) {
    const circumference = 314.159; // 2 * PI * 50
    scoreGaugeBar.style.strokeDasharray = `${circumference}`;
    const offset = circumference - (report.overallScore / 100) * circumference;
    scoreGaugeBar.style.strokeDashoffset = `${offset}`;
  }

  // Telemetry Quad Bars
  const techFillBar = document.getElementById("techFillBar");
  if (techFillBar) techFillBar.style.width = `${report.technicalScore}%`;

  const commFillBar = document.getElementById("commFillBar");
  if (commFillBar) commFillBar.style.width = `${report.communicationScore}%`;

  const wordFillBar = document.getElementById("wordFillBar");
  if (wordFillBar) wordFillBar.style.width = `${Math.min(100, Math.round((report.avgWordsPerAnswer / 80) * 100))}%`;

  // Strengths
  if (reportStrengths) {
    reportStrengths.innerHTML = "";
    (report.strengths && report.strengths.length ? report.strengths : ["Engaged with questions and articulated technical concepts."]).forEach((s) => {
      const li = document.createElement("li");
      li.textContent = s;
      reportStrengths.appendChild(li);
    });
  }

  // Improvements
  if (reportImprovements) {
    reportImprovements.innerHTML = "";
    (report.improvements && report.improvements.length ? report.improvements : ["Continue expanding on practical edge cases and system bottlenecks."]).forEach((i) => {
      const li = document.createElement("li");
      li.textContent = i;
      reportImprovements.appendChild(li);
    });
  }

  // Turn Breakdown
  if (reportTurnsContainer) {
    reportTurnsContainer.innerHTML = "";
    if (!report.turns || report.turns.length === 0) {
      reportTurnsContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;">No answers were submitted during this session.</p>`;
    } else {
      report.turns.forEach((t, idx) => {
        const card = document.createElement("div");
        card.className = "turn-card";
        card.innerHTML = `
          <div class="turn-top">
            <span style="color: var(--text-dim)">0${idx + 1} // ${(t.category || "TECHNICAL").toUpperCase()}</span>
            <span style="color: var(--accent-primary-light); font-weight: 700;">Score: ${t.score}/100</span>
          </div>
          <p class="turn-q">${t.question}</p>
          <p class="turn-a"><strong>Your Answer:</strong> ${t.userAnswer}</p>
          <p class="turn-feedback"><strong>Feedback:</strong> ${t.feedback}</p>
        `;
        reportTurnsContainer.appendChild(card);
      });
    }
  }

  navigateTo(3); // Go to Page 3
}

// Download Markdown Report
if (downloadReportBtn) {
  downloadReportBtn.addEventListener("click", () => {
    if (!currentReport) return;
    let md = `# Mock Interview Performance Report\n\n`;
    md += `**Role:** ${currentReport.roleTitle}\n`;
    md += `**Experience Level:** ${currentReport.experienceLevel}\n`;
    md += `**Overall Score:** ${currentReport.overallScore}% (Grade: ${currentReport.grade})\n`;
    md += `**Technical Mastery:** ${currentReport.technicalScore}%\n`;
    md += `**Communication & Depth:** ${currentReport.communicationScore}%\n\n`;

    md += `## Key Strengths\n`;
    currentReport.strengths.forEach((s) => (md += `- ${s}\n`));
    md += `\n## Areas for Improvement\n`;
    currentReport.improvements.forEach((i) => (md += `- ${i}\n`));

    md += `\n## Question-by-Question Breakdown\n\n`;
    (currentReport.turns || []).forEach((t, i) => {
      md += `### Q${i + 1}: ${t.question}\n`;
      md += `**Score:** ${t.score}/100\n`;
      md += `**Candidate Answer:** ${t.userAnswer}\n`;
      md += `**Feedback:** ${t.feedback}\n\n`;
    });

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

// Restart Interview (Go back to Page 1)
if (newInterviewBtn) {
  newInterviewBtn.addEventListener("click", () => {
    window.speechSynthesis.cancel();
    sessionId = null;
    currentReport = null;
    navigateTo(1);
  });
}

// Initialize on page load
initAudioVisualizer();
initSpeechRecognition();
loadServerConfig();
getConsistentVoice();
navigateTo(1);
