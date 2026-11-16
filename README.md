# Minimalist AI Mock Interviewer — Studio Edition

A lightweight, zero-dependency, self-contained AI mock interview platform featuring an award-winning dark-first aesthetic, real-time acoustic canvas visualizer, dynamic scenario archetypes, and multi-engine reasoning (Built-in Minimal, Google Gemini, and OpenAI ChatGPT).

---

## Key Highlights

- **Multi-Engine Reasoning Architecture**:
  - **⚡ Built-in Minimal**: Completely self-contained, zero-dependency, instant local heuristic engine. No API keys required, zero latency, 100% private.
  - **✨ Google Gemini AI**: Adaptive multi-turn reasoning powered by Gemini Flash with 3-tier resilient cascade.
  - **🤖 OpenAI ChatGPT**: Rigorous rubric evaluation and deep architectural interrogation via GPT-4o-mini.
- **Studio Hardware Aesthetic**: Inspired by Teenage Engineering, Nothing, Sonic Lamb, and Apple. Features an obsidian dark palette, hairline lighting, and clean typography.
- **Real-Time Acoustic Canvas Visualizer**: 60fps dynamic frequency oscilloscope that modulates with speech synthesis and microphone audio capture.
- **Native Browser Web Speech API**:
  - **Speech-to-Text (STT)**: Direct browser speech recognition with real-time transcription.
  - **Text-to-Speech (TTS)**: Natural voice synthesis with persistent voice locking.
- **Dynamic Scenario Archetypes**:
  - Automatically generates varied opening interview dynamics (Production Incidents, System Deep-Dives, Architectural Dilemmas, Greenfield Designs, and Subtle Concurrency Bottlenecks).
- **Deterministic & LLM Evaluation**:
  - Real-time concept extraction, depth metrics, and STAR method detection for behavioral tracks.
  - Executive Performance Scorecard with animated radial grade gauge, quad telemetry bars, verified competencies, and actionable recommendations.
  - Markdown report export with detailed question-by-question audit history.
- **Zero NPM Dependencies**: Runs natively on Node.js built-ins (`http`, `https`, `fs`, `path`, `url`). Instant startup with zero package bloat.

---

## Quick Start

### 1. Clone & Run
```bash
git clone https://github.com/Kamal162003/SE-Project.git
cd SE-Project
node server.js
```

### 2. Open in Browser
Visit `http://localhost:3000` in any modern web browser.

---

## Environment Variables (Optional)

Copy `.env.example` to `.env` if you wish to pre-load API keys server-side:
```env
PORT=3000
OPENAI_API_KEY=your_openai_key_here
GEMINI_API_KEY=your_gemini_key_here
```
*Note: Keys can also be entered dynamically in the browser UI without saving them to the server.*

---

## Project Structure

```
minimal-mock-interview/
├── package.json        # Minimal script metadata
├── server.js           # Zero-dependency HTTP & REST server with multi-engine proxy
├── engine.js           # NLP interview engine, scenario archetypes & scoring
├── README.md           # Documentation
├── .env.example        # Environment variable template
├── w1-w7 (*.md)        # Weekly engineering logs & ticket resolutions
└── public/             # Static frontend client
    ├── index.html      # Semantic HTML5 studio layout
    ├── style.css       # Obsidian dark-mode styling with precision responsive rules
    └── app.js          # 60fps canvas visualizer, Web Speech API & session controller
```

---

## Weekly Deliverables & Engineering Logs (W1 – W7)

| Week | Deliverable / Ticket Resolution | Documentation |
| :---: | :--- | :--- |
| **W1** | Order of Flags in Compilation Command & Linker Resolution | [w1-ticket-resolution.md](w1-ticket-resolution.md) |
| **W2** | Dynamic Linking vs Static Linking & Shared Library Resolution | [w2-ticket-resolution.md](w2-ticket-resolution.md) |
| **W3** | Zero-Score Evaluation Logic & Edge Case Remediation | [w3-zero-score-evaluation-logic.md](w3-zero-score-evaluation-logic.md) |
| **W4** | Chromium SpeechSynthesis Utterance Garbage Collection Bug | [w4-chromium-speech-synthesis-gc.md](w4-chromium-speech-synthesis-gc.md) |
| **W5** | SpeechRecognition Buffer Preservation & Audio Pipeline Continuity | [w5-speech-recognition-buffer-preservation.md](w5-speech-recognition-buffer-preservation.md) |
| **W6** | React Immutability, Stale Closures & Asynchronous State | [w6-react-immutability-stale-closures.md](w6-react-immutability-stale-closures.md) |
| **W7** | UI Contrast Ratio, Accessibility & HiDPI Canvas Scaling | [w7-ui-contrast-canvas-scaling.md](w7-ui-contrast-canvas-scaling.md) |

---

## License

MIT License. Free for personal and commercial practice.
