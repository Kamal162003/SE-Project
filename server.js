// Minimalist Zero-Dependency HTTP & REST Server
const http = require("http");
const fs = require("fs");
const path = require("path");

// Load .env automatically if present (native zero-dependency)
const envFile = path.join(__dirname, ".env");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8").split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const k = trimmed.substring(0, idx).trim();
        const v = trimmed.substring(idx + 1).trim();
        if (!process.env[k]) process.env[k] = v;
      }
    }
  });
}

const engine = require("./engine");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function sendJSON(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function serveStatic(req, res, pathname) {
  let relativePath = pathname === "/" ? "index.html" : pathname;
  const safePath = path.normalize(path.join(PUBLIC_DIR, relativePath));
  if (!safePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(safePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("Not Found");
    }
    const ext = path.extname(safePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "text/plain" });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const { pathname, searchParams } = parsedUrl;

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    });
    return res.end();
  }

  try {
    if (pathname === "/api/config" && req.method === "GET") {
      return sendJSON(res, 200, {
        hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 5),
        hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5)
      });
    }

    if (pathname === "/api/start" && req.method === "POST") {
      const data = await parseBody(req);
      const sessionInfo = await engine.startSession(data.track || "software-engineer", {
        provider: data.provider || "local",
        apiKey: data.apiKey || "",
        experienceLevel: data.experienceLevel || "mid",
        persona: data.persona || "neutral",
        questionCount: data.questionCount || 4,
        customDescription: data.customDescription || ""
      });
      return sendJSON(res, 200, sessionInfo);
    }

    if (pathname === "/api/turn" && req.method === "POST") {
      const data = await parseBody(req);
      if (!data.sessionId || typeof data.answer !== "string") {
        return sendJSON(res, 400, { error: "Missing sessionId or answer string." });
      }
      const turnResult = await engine.processTurn(data.sessionId, data.answer);
      return sendJSON(res, 200, turnResult);
    }

    if (pathname === "/api/end" && req.method === "POST") {
      const data = await parseBody(req);
      if (!data.sessionId) {
        return sendJSON(res, 400, { error: "Missing sessionId." });
      }
      const report = engine.endSessionEarly(data.sessionId);
      return sendJSON(res, 200, { report });
    }

    if (pathname === "/api/report" && req.method === "GET") {
      const sessionId = searchParams.get("sessionId");
      if (!sessionId) {
        return sendJSON(res, 400, { error: "Missing sessionId query parameter." });
      }
      const report = engine.getReport(sessionId);
      return sendJSON(res, 200, { report });
    }

    serveStatic(req, res, pathname);
  } catch (error) {
    console.error("Server Error:", error.message);
    sendJSON(res, 500, { error: error.message || "Internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`Minimal AI Mock Interview engine running at http://localhost:${PORT}`);
});
