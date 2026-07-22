function clean(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function scoreText(text = "", config = {}) {
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

function matchesRole(text = "", config = {}) {
  const t = text.toLowerCase();
  return (config.keywords || []).some((k) => t.includes(k));
}

function matchesLocation(locationText = "", config = {}) {
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

function isRecent(postedDate) {
  if (!postedDate) return true;
  const d = new Date(postedDate);
  if (Number.isNaN(d.getTime())) return true;
  const diffDays = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}

function absoluteUrl(href, baseUrl) {
  if (!href) return "";
  try {
    return href.startsWith("http") ? href : new URL(href, baseUrl).href;
  } catch {
    return href;
  }
}

module.exports = {
  clean,
  todayStr,
  scoreText,
  matchesRole,
  matchesLocation,
  isRecent,
  absoluteUrl
};