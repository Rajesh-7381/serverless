const { clean, todayStr, scoreText, matchesRole, matchesLocation, absoluteUrl } = require("../utils/common");

async function collect(page, config, debug) {
  const rows = [];
  await page.goto("https://www.indeed.com/jobs?q=node+js+developer&l=India", {
    waitUntil: "domcontentloaded",
    timeout: 60000
  });
  await page.waitForTimeout(6000);

  const bodyText = await page.evaluate(() => document.body.innerText || "").catch(() => "");
  const lower = bodyText.toLowerCase();

  const anchors = await page.locator("a").evaluateAll((els) =>
    els.map((a) => ({
      text: (a.innerText || "").trim(),
      href: a.getAttribute("href") || ""
    }))
  );

  for (const link of anchors) {
    const title = clean(link.text);
    const href = absoluteUrl(link.href, page.url());
    if (!title || title.length < 8) continue;
    if (!href) continue;
    if (!matchesRole(title, config)) continue;

    const combined = `${title} ${lower}`;
    if (!matchesLocation(combined, config)) continue;
    if ((config.exclude || []).some((x) => combined.includes(x))) continue;

    rows.push({
      Company: "",
      Role: title,
      Experience: "1-4 years",
      Location: (config.targetCities || []).find((c) => lower.includes(c)) || "India",
      Salary: "Not Specified",
      "Apply Link": href,
      "Posted Date": todayStr(),
      "Match Score": scoreText(combined, config),
      Source: "Indeed"
    });
  }

  return rows;
}

module.exports = { collect };