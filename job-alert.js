require("dotenv").config();

const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const { chromium } = require("playwright");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const axios = require("axios");

const CONFIG_PATH = path.join(__dirname, "config.json");
const DEBUG_DIR = path.join(__dirname, "debug");

let config = {
  timezone: "Asia/Kolkata",
  cron: "30 8 * * *",
  dailyLimit: 100,
  whatsappChunkLimit: 3500,
  enableEmail: true,
  enableWhatsApp: true,
  enableTerminal: true,
  debug: {
    enabled: true,
    saveHtml: true,
    saveText: true,
    saveNetworkJson: true
  },
  targetCities: [],
  keywords: [],
  exclude: [],
  sources: []
};

let schedulerTask = null;
let jobRunning = false;
let lastConfigHash = "";

function nowStamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function log(...args) {
  if (config.enableTerminal !== false) console.log(new Date().toISOString(), ...args);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function clean(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

async function ensureDebugDir() {
  await fsp.mkdir(DEBUG_DIR, { recursive: true });
}

async function writeDebugFile(name, content) {
  if (!config.debug?.enabled) return;
  await ensureDebugDir();
  const file = path.join(DEBUG_DIR, name);
  await fsp.writeFile(file, content, "utf-8");
  log("[DEBUG SAVED]", file);
}

async function savePageArtifacts(sourceName, page) {
  if (!config.debug?.enabled) return;
  const stamp = `${sourceName.toLowerCase()}-${nowStamp()}`;
  try {
    if (config.debug?.saveHtml) {
      await writeDebugFile(`${stamp}.html`, await page.content());
    }
    if (config.debug?.saveText) {
      await writeDebugFile(`${stamp}.txt`, await page.evaluate(() => document.body.innerText || ""));
    }
  } catch (err) {
    log(`[DEBUG ERROR] ${sourceName}`, err.message);
  }
}

function loadConfigFile() {
  const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
  const parsed = JSON.parse(raw);
  const hash = JSON.stringify(parsed);
  return { parsed, hash };
}

function applyConfig(newConfig) {
  config = {
    ...config,
    ...newConfig,
    debug: {
      ...(config.debug || {}),
      ...(newConfig.debug || {})
    }
  };
}

function reloadConfig() {
  try {
    const { parsed, hash } = loadConfigFile();
    if (hash === lastConfigHash) return false;
    lastConfigHash = hash;
    applyConfig(parsed);
    log("[CONFIG RELOADED]", {
      timezone: config.timezone,
      cron: config.cron,
      dailyLimit: config.dailyLimit,
      enableEmail: config.enableEmail,
      enableWhatsApp: config.enableWhatsApp,
      enableTerminal: config.enableTerminal
    });
    return true;
  } catch (err) {
    log("[CONFIG ERROR]", err.message);
    return false;
  }
}

function watchConfigFile() {
  try {
    fs.watch(CONFIG_PATH, { persistent: true }, () => {
      setTimeout(() => reloadConfig(), 200);
    });
    log("[CONFIG WATCHER] active");
  } catch (err) {
    log("[CONFIG WATCHER ERROR]", err.message);
  }
}

function isRecent(postedDate) {
  if (!postedDate) return true;
  const d = new Date(postedDate);
  if (Number.isNaN(d.getTime())) return true;
  const diffDays = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}

function scoreText(text = "") {
  const t = text.toLowerCase();
  let score = 0;
  (config.keywords || []).forEach((k) => {
    if (t.includes(k)) score += 10;
  });
  (config.targetCities || []).forEach((c) => {
    if (t.includes(c)) score += 2;
  });
  (config.exclude || []).forEach((k) => {
    if (t.includes(k)) score -= 25;
  });
  return Math.max(0, Math.min(100, score));
}

function matchesRole(text = "") {
  const t = text.toLowerCase();
  return (config.keywords || []).some((k) => t.includes(k));
}

function matchesLocation(locationText = "") {
  const loc = locationText.toLowerCase().trim();
  if (!loc) return true;

  const targetCities = (config.targetCities || []).filter(
    (c) => c !== "india" && c !== "remote" && c !== "pan india"
  );

  const hasTargetCity = targetCities.some((city) => loc.includes(city));
  const isRemote = loc.includes("remote");
  const isPanIndia = loc.includes("pan india");
  const saysIndia = loc.includes("india");
  const outsideIndia = !saysIndia && !hasTargetCity && !isRemote && !isPanIndia;

  return hasTargetCity || isRemote || isPanIndia || outsideIndia;
}

function experienceMatch(text = "") {
  const t = text.toLowerCase();
  if (t.includes("1-4") || t.includes("1 to 4") || t.includes("1–4")) return true;
  if (t.includes("1-3") || t.includes("1 to 3") || t.includes("1–3")) return true;
  if (t.includes("2-4") || t.includes("2 to 4") || t.includes("2–4")) return true;
  if (t.includes("2-3") || t.includes("2 to 3") || t.includes("2–3")) return true;
  if (t.includes("3-4") || t.includes("3 to 4") || t.includes("3–4")) return true;
  if (t.includes("2 years") || t.includes("3 years") || t.includes("4 years")) return true;
  return true;
}

function dedupe(rows) {
  const seen = new Set();
  const out = [];
  for (const r of rows) {
    const key = `${clean(r.Company).toLowerCase()}|${clean(r.Role).toLowerCase()}|${clean(r["Apply Link"]).toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  log(`[DEDUPE] before=${rows.length} after=${out.length}`);
  return out;
}

function filterRows(rows) {
  const limit = config.dailyLimit || 100;
  const filtered = rows
    .filter((r) => isRecent(r["Posted Date"]))
    .filter((r) => r["Match Score"] >= 20)
    .sort((a, b) => b["Match Score"] - a["Match Score"])
    .slice(0, limit);

  log(`[FILTER] before=${rows.length} after=${filtered.length}`);
  return filtered;
}

function toHtmlTable(rows) {
  if (!rows.length) return "<p>No matching jobs found today.</p>";
  const headers = ["Company", "Role", "Experience", "Location", "Salary", "Apply Link", "Posted Date", "Match Score", "Source"];
  const head = `<tr>${headers.map((h) => `<th style="border:1px solid #ddd;padding:8px;background:#f5f5f5;">${h}</th>`).join("")}</tr>`;
  const body = rows.map((r) => `<tr>${headers.map((h) => {
    const val = r[h] || "";
    if (h === "Apply Link") return `<td style="border:1px solid #ddd;padding:8px;">${val ? `<a href="${val}">Open</a>` : "N/A"}</td>`;
    return `<td style="border:1px solid #ddd;padding:8px;">${String(val)}</td>`;
  }).join("")}</tr>`).join("");
  return `<table style="border-collapse:collapse;width:100%;">${head}${body}</table>`;
}

async function sendEmail(rows) {
  if (!config.enableEmail) {
    log("[EMAIL] disabled");
    return;
  }
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    log("[EMAIL SKIP] missing EMAIL_USER or EMAIL_PASS");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  await transporter.verify();
  const subject = `Daily Tech Jobs Report - ${todayStr()}`;
  const html = `
    <h2>Tech Developer Jobs</h2>
    <p>Last 7 days | Top ${config.dailyLimit || 100}</p>
    <p>India cities: ${(config.targetCities || []).join(", ")}</p>
    <p>Outside India: Anywhere preferred</p>
    ${toHtmlTable(rows)}
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO || "rajeshkumar93481@gmail.com",
    subject,
    html
  });

  log("[EMAIL SENT] success");
}

async function sendWhatsAppMessage(text) {
  if (!config.enableWhatsApp) {
    log("[WHATSAPP] disabled");
    return;
  }

  const phone = process.env.WHATSAPP_PHONE;
  const key = process.env.WHATSAPP_API_KEY;
  if (!phone || !key) {
    log("[WHATSAPP SKIP] missing credentials");
    return;
  }

  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(key)}`;
  const res = await axios.get(url, { timeout: 15000 });
  log(`[WHATSAPP SENT] status=${res.status}`);
}

async function sendWhatsAppReport(rows) {
  if (!config.enableWhatsApp) return;
  if (!rows.length) return;

  const chunkLimit = config.whatsappChunkLimit || 3500;
  let chunk = `*Daily Job Report - ${todayStr()}*\nFound ${rows.length} jobs.\n\n`;
  let part = 1;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const line = `${i + 1}. *${r.Company || "Unknown"}* - ${r.Role}\n📍 ${r.Location}\n🔗 ${r["Apply Link"] || "N/A"}\n\n`;

    if (chunk.length + line.length > chunkLimit) {
      await sendWhatsAppMessage(chunk);
      part++;
      chunk = `*Daily Job Report (Part ${part}) - ${todayStr()}*\n\n${line}`;
      await new Promise((r) => setTimeout(r, 2500));
    } else {
      chunk += line;
    }
  }

  if (chunk.trim()) await sendWhatsAppMessage(chunk);
  log("[WHATSAPP REPORT] done");
}

async function captureResponses(page) {
  const captured = [];
  const handler = async (response) => {
    try {
      const url = response.url();
      const ct = (response.headers()["content-type"] || "").toLowerCase();
      if (!ct.includes("json") && !url.includes("api") && !url.includes("graphql") && !url.includes("search")) return;
      const text = await response.text();
      if (!text || text.length < 20) return;
      captured.push({ url, status: response.status(), contentType: ct, text });
    } catch {}
  };
  page.on("response", handler);
  return {
    get: () => captured,
    stop: () => page.off("response", handler)
  };
}

function extractJobsFromJsonPayload(payload, sourceName) {
  const rows = [];
  const walk = (node) => {
    if (!node) return;
    if (Array.isArray(node)) return node.forEach(walk);
    if (typeof node !== "object") return;

    const keys = Object.keys(node).map((k) => k.toLowerCase());
    const looksLikeJob =
      keys.includes("title") ||
      keys.includes("jobtitle") ||
      keys.includes("company") ||
      keys.includes("companyname") ||
      keys.includes("location") ||
      keys.includes("joblocation");

    if (looksLikeJob) {
      const title = clean(node.title || node.jobTitle || node.jobtitle || "");
      const company = clean(node.company || node.companyName || node.company_name || "");
      const location = clean(node.location || node.jobLocation || node.jobGeo || node.candidate_required_location || "India");
      const url = clean(node.url || node.applyUrl || node.jobUrl || node.link || "");
      const desc = clean(node.description || node.jobDescription || node.jobExcerpt || "");
      const posted = node.pubDate || node.publication_date || node.created_at || node.postedDate || "";

      if (title && matchesRole(title)) {
        rows.push({
          Company: company,
          Role: title,
          Experience: "1-4 years",
          Location: location,
          Salary: clean(node.salary || node.salaryText || "Not Specified"),
          "Apply Link": url,
          "Posted Date": posted ? new Date(posted).toISOString().slice(0, 10) : todayStr(),
          "Match Score": scoreText(`${title} ${company} ${location} ${desc}`),
          Source: sourceName
        });
      }
    }

    for (const v of Object.values(node)) walk(v);
  };

  walk(payload);
  return rows;
}

async function getApplyLinkFromLocator(locator, pageUrl) {
  try {
    const href = await locator.getAttribute("href");
    if (!href) return "";
    return href.startsWith("http") ? href : new URL(href, pageUrl).href;
  } catch {
    return "";
  }
}

async function collectSource(page, source) {
  const sourceName = source.name;
  const rows = [];
  const debugBase = `${sourceName.toLowerCase()}-${nowStamp()}`;

  page.removeAllListeners("response");
  const capture = await captureResponses(page);

  try {
    await page.goto(source.url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(5000);

    const nextData = await page.evaluate(() => {
      const el = document.querySelector("#__NEXT_DATA__");
      return el ? el.textContent : "";
    }).catch(() => "");

    if (nextData) {
      try {
        const parsed = JSON.parse(nextData);
        rows.push(...extractJobsFromJsonPayload(parsed, sourceName));
        if (rows.length) return rows;
      } catch (err) {
        await writeDebugFile(`${debugBase}-nextdata-error.txt`, err.stack || err.message);
      }
    }

    const responses = capture.get();
    if (config.debug?.saveNetworkJson && responses.length) {
      await writeDebugFile(
        `${debugBase}-responses.json`,
        JSON.stringify(
          responses.map((r) => ({
            url: r.url,
            status: r.status,
            contentType: r.contentType,
            textHead: r.text.slice(0, 500)
          })),
          null,
          2
        )
      );
    }

    for (const r of responses) {
      try {
        const parsed = JSON.parse(r.text);
        rows.push(...extractJobsFromJsonPayload(parsed, sourceName));
      } catch {}
    }

    if (!rows.length) {
      const text = await page.evaluate(() => document.body.innerText || "").catch(() => "");
      await savePageArtifacts(sourceName, page);
      await writeDebugFile(`${debugBase}-bodytext.txt`, text);

      const lower = text.toLowerCase();
      const anchorCount = await page.locator("a").count().catch(() => 0);

      for (let i = 0; i < anchorCount; i++) {
        const a = page.locator("a").nth(i);
        const title = clean(await a.innerText().catch(() => ""));
        const href = await getApplyLinkFromLocator(a, page.url());
        if (!title || title.length < 8) continue;
        if (!href) continue;
        const combined = `${title} ${lower}`;
        if (!matchesRole(title)) continue;
        if (!matchesLocation(combined)) continue;
        if ((config.exclude || []).some((x) => combined.includes(x))) continue;

        rows.push({
          Company: "",
          Role: title,
          Experience: "1-4 years",
          Location: (config.targetCities || []).find((c) => lower.includes(c)) || "India",
          Salary: "Not Specified",
          "Apply Link": href,
          "Posted Date": todayStr(),
          "Match Score": scoreText(combined),
          Source: sourceName
        });
      }
    }

    log(`[${sourceName.toUpperCase()}] rows=${rows.length}`);
    return rows;
  } catch (err) {
    await writeDebugFile(`${debugBase}-error.txt`, err.stack || err.message);
    await savePageArtifacts(sourceName, page);
    log(`[${sourceName.toUpperCase()} ERROR]`, err.message);
    return rows;
  } finally {
    capture.stop();
  }
}

async function collectJobs() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });

  try {
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      viewport: { width: 1366, height: 900 }
    });

    const page = await context.newPage();
    const enabled = (config.sources || []).filter((s) => s.enabled !== false);
    const all = [];

    for (const source of enabled) {
      all.push(...(await collectSource(page, source)));
    }

    return all;
  } finally {
    await browser.close().catch(() => {});
  }
}

async function runJob() {
  if (jobRunning) {
    log("[JOB SKIP] already running");
    return;
  }

  jobRunning = true;
  try {
    log("[JOB START]");
    const allRaw = await collectJobs();
    log(`[COLLECTED] raw=${allRaw.length}`);

    let all = dedupe(allRaw);
    all = filterRows(all);

    if (!all.length) {
      log("[NO JOBS] no matches after filters");
      return;
    }

    await sendEmail(all);
    await sendWhatsAppReport(all);

    if (config.enableTerminal !== false) {
      console.table(all.slice(0, 20));
    }

    log(`[JOB DONE] sent=${all.length}`);
  } catch (err) {
    log("[JOB FATAL]", err.stack || err.message);
  } finally {
    jobRunning = false;
  }
}

function startOrRestartScheduler() {
  if (schedulerTask) {
    schedulerTask.stop();
    schedulerTask.destroy?.();
    schedulerTask = null;
  }

  schedulerTask = cron.schedule(
    config.cron || "30 8 * * *",
    async () => {
      await runJob();
    },
    {
      timezone: config.timezone || "Asia/Kolkata",
      noOverlap: true
    }
  );

  log("[SCHEDULER] started", {
    cron: config.cron,
    timezone: config.timezone
  });
}

function watchConfigFile() {
  try {
    fs.watch(CONFIG_PATH, { persistent: true }, () => {
      setTimeout(() => {
        reloadConfig();
        startOrRestartScheduler();
      }, 200);
    });
    log("[CONFIG WATCHER] active");
  } catch (err) {
    log("[CONFIG WATCHER ERROR]", err.message);
  }
}

async function main() {
  try {
    await ensureDebugDir();
    reloadConfig();
    startOrRestartScheduler();
    watchConfigFile();
    await runJob();
  } catch (err) {
    console.error("[BOOT ERROR]", err.stack || err.message);
    process.exitCode = 1;
  }
}

main();