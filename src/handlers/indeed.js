const axios = require("axios");
const { clean, todayStr, scoreText, matchesRole, isRecent } = require("../utils/common");

/**
 * Indeed is protected by Cloudflare Turnstile CAPTCHA and cannot be scraped with Playwright.
 *
 * This handler uses FOUR free public job APIs as reliable replacements:
 *
 * 1. RemoteOK API     – https://remoteok.com/api           (free JSON, no auth)
 * 2. Remotive API     – https://remotive.com/api/remote-jobs (free JSON, no auth)
 * 3. Arbeitnow API    – https://www.arbeitnow.com/api/job-board-api (free JSON, no auth, worldwide)
 * 4. Jobicy API       – https://jobicy.com/api/v2/remote-jobs (free JSON, no auth)
 *
 * All APIs return structured JSON with title, company, location, and apply URL.
 * Labelled Source: "Indeed/Remote" in the report.
 */

const APIS = {
  REMOTEOK:  "https://remoteok.com/api",
  REMOTIVE:  "https://remotive.com/api/remote-jobs",
  ARBEITNOW: "https://www.arbeitnow.com/api/job-board-api",
  JOBICY:    "https://jobicy.com/api/v2/remote-jobs"
};

function httpHeaders() {
  return {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept: "application/json, */*"
  };
}

/** Check if a job title is software/tech-related */
function isTechRole(title = "") {
  const t = title.toLowerCase();
  return (
    t.includes("engineer") || t.includes("developer") || t.includes("dev ") ||
    t.includes(" dev") || t.includes("backend") || t.includes("back-end") ||
    t.includes("fullstack") || t.includes("full stack") || t.includes("full-stack") ||
    t.includes("software") || t.includes("node") || t.includes("javascript") ||
    t.includes("typescript") || t.includes("api") || t.includes("programmer") ||
    t.includes("architect") || t.includes("tech lead")
  );
}

/** Build a combined searchable text from a job */
function combineText(...parts) {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

// ─── RemoteOK ────────────────────────────────────────────────────────────────
async function fetchRemoteOK(config, debug) {
  const rows = [];
  try {
    const res = await axios.get(APIS.REMOTEOK, { headers: httpHeaders(), timeout: 20000 });
    const jobs = Array.isArray(res.data) ? res.data.filter((j) => j && j.position) : [];

    for (const job of jobs) {
      const title   = clean(job.position || "");
      const company = clean(job.company  || "");
      const location = clean(job.location || job.region || "Remote");
      const tags    = Array.isArray(job.tags) ? job.tags.map((t) => String(t)).join(" ") : "";
      const desc    = clean(job.description || "").slice(0, 500);
      const combined = combineText(title, company, location, tags, desc);
      const posted   = job.epoch
        ? new Date(job.epoch * 1000).toISOString().slice(0, 10)
        : (job.date || todayStr());

      if (!isTechRole(title)) continue;
      // Match keywords against title + tags
      const roleMatches = (config.keywords || []).some((k) => `${title} ${tags}`.toLowerCase().includes(k));
      if (!roleMatches) continue;
      // Apply excludes only on title (not description — avoids false positives)
      if ((config.exclude || []).some((x) => title.toLowerCase().includes(x))) continue;
      if (!isRecent(posted)) continue;

      rows.push({
        Company: company || "Unknown", Role: title, Experience: "1-4 years",
        Location: location, Salary: clean(job.salary || "Not Specified"),
        "Apply Link": clean(job.url || ""), "Posted Date": posted,
        "Match Score": scoreText(combined, config), Source: "Indeed/Remote"
      });
    }
    if (debug?.enabled) console.log(`[REMOTEOK] fetched=${jobs.length} matched=${rows.length}`);
  } catch (err) {
    if (debug?.enabled) console.log("[REMOTEOK ERROR]", err.message);
  }
  return rows;
}

// ─── Remotive ────────────────────────────────────────────────────────────────
async function fetchRemotive(config, debug) {
  const rows = [];
  try {
    const res = await axios.get(`${APIS.REMOTIVE}?search=node+developer&limit=100`, {
      headers: httpHeaders(), timeout: 20000
    });
    const jobs = res.data?.jobs || [];

    for (const job of jobs) {
      const title    = clean(job.title || "");
      const company  = clean(job.company_name || "");
      const location = clean(job.candidate_required_location || "Remote");
      const tags     = Array.isArray(job.tags) ? job.tags.join(" ") : "";
      const desc     = clean(job.description || "").slice(0, 500);
      const combined = combineText(title, company, location, tags, desc);
      const posted   = job.publication_date
        ? new Date(job.publication_date).toISOString().slice(0, 10)
        : todayStr();

      if (!isTechRole(title)) continue;
      const roleMatches = (config.keywords || []).some((k) => combined.includes(k));
      if (!roleMatches) continue;
      if ((config.exclude || []).some((x) => title.toLowerCase().includes(x))) continue;
      if (!isRecent(posted)) continue;

      rows.push({
        Company: company || "Unknown", Role: title, Experience: "1-4 years",
        Location: location, Salary: clean(job.salary || "Not Specified"),
        "Apply Link": clean(job.url || ""), "Posted Date": posted,
        "Match Score": scoreText(combined, config), Source: "Indeed/Remote"
      });
    }
    if (debug?.enabled) console.log(`[REMOTIVE] fetched=${jobs.length} matched=${rows.length}`);
  } catch (err) {
    if (debug?.enabled) console.log("[REMOTIVE ERROR]", err.message);
  }
  return rows;
}

// ─── Arbeitnow ───────────────────────────────────────────────────────────────
async function fetchArbeitnow(config, debug) {
  const rows = [];
  try {
    // Arbeitnow paginates — fetch page 1 (50 jobs per page)
    const res = await axios.get(`${APIS.ARBEITNOW}?page=1`, { headers: httpHeaders(), timeout: 20000 });
    const jobs = res.data?.data || [];

    for (const job of jobs) {
      const title    = clean(job.title || "");
      const company  = clean(job.company_name || "");
      const location = clean(job.location || (job.remote ? "Remote" : ""));
      const tags     = Array.isArray(job.tags) ? job.tags.join(" ") : "";
      const desc     = clean(job.description || "").slice(0, 500);
      const combined = combineText(title, company, location, tags, desc);
      const posted   = job.created_at
        ? new Date(job.created_at * 1000).toISOString().slice(0, 10)
        : todayStr();

      if (!isTechRole(title)) continue;
      const roleMatches = (config.keywords || []).some((k) => combined.includes(k));
      if (!roleMatches) continue;
      if ((config.exclude || []).some((x) => title.toLowerCase().includes(x))) continue;
      if (!isRecent(posted)) continue;

      rows.push({
        Company: company || "Unknown", Role: title, Experience: "1-4 years",
        Location: location || (job.remote ? "Remote" : "Worldwide"), Salary: "Not Specified",
        "Apply Link": clean(job.url || ""), "Posted Date": posted,
        "Match Score": scoreText(combined, config), Source: "Indeed/Remote"
      });
    }
    if (debug?.enabled) console.log(`[ARBEITNOW] fetched=${jobs.length} matched=${rows.length}`);
  } catch (err) {
    if (debug?.enabled) console.log("[ARBEITNOW ERROR]", err.message);
  }
  return rows;
}

// ─── Jobicy ──────────────────────────────────────────────────────────────────
async function fetchJobicy(config, debug) {
  const rows = [];
  try {
    const res = await axios.get(`${APIS.JOBICY}?count=50&tag=nodejs`, {
      headers: httpHeaders(), timeout: 20000
    });
    const jobs = res.data?.jobs || [];

    for (const job of jobs) {
      const title    = clean(job.jobTitle || "");
      const company  = clean(job.companyName || "");
      const location = clean(job.jobGeo || "Remote");
      const tags     = clean(job.jobIndustry || "") + " " + clean(job.jobType || "");
      const desc     = clean(job.jobExcerpt || "").slice(0, 500);
      const combined = combineText(title, company, location, tags, desc);
      const posted   = job.pubDate
        ? new Date(job.pubDate).toISOString().slice(0, 10)
        : todayStr();

      if (!isTechRole(title)) continue;
      const roleMatches = (config.keywords || []).some((k) => combined.includes(k));
      if (!roleMatches) continue;
      if ((config.exclude || []).some((x) => title.toLowerCase().includes(x))) continue;
      if (!isRecent(posted)) continue;

      rows.push({
        Company: company || "Unknown", Role: title, Experience: "1-4 years",
        Location: location, Salary: clean(job.annualSalaryMin ? `$${job.annualSalaryMin}–$${job.annualSalaryMax}` : "Not Specified"),
        "Apply Link": clean(job.url || ""), "Posted Date": posted,
        "Match Score": scoreText(combined, config), Source: "Indeed/Remote"
      });
    }
    if (debug?.enabled) console.log(`[JOBICY] fetched=${jobs.length} matched=${rows.length}`);
  } catch (err) {
    if (debug?.enabled) console.log("[JOBICY ERROR]", err.message);
  }
  return rows;
}

// ─── Main collect ─────────────────────────────────────────────────────────────
/**
 * NOTE: `page` is accepted but NOT used — we use HTTP APIs, not browser scraping.
 */
async function collect(page, config, debug) {
  const [remoteOkRows, remotiveRows, arbeitnowRows, jobicyRows] = await Promise.all([
    fetchRemoteOK(config, debug),
    fetchRemotive(config, debug),
    fetchArbeitnow(config, debug),
    fetchJobicy(config, debug)
  ]);

  const all = [...remoteOkRows, ...remotiveRows, ...arbeitnowRows, ...jobicyRows];

  // Dedupe by apply link or role+company
  const seen = new Set();
  const unique = all.filter((r) => {
    const key = (r["Apply Link"] || `${r.Role}|${r.Company}`).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (debug?.enabled) console.log(`[INDEED/REMOTE] total unique=${unique.length}`);
  return unique;
}

module.exports = { collect };
