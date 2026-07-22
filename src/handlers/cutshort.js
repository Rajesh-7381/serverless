const { clean, todayStr, scoreText, matchesRole, matchesLocation, absoluteUrl } = require("../utils/common");

async function collect(page, config, debug) {
  const rows = [];
  await page.goto("https://cutshort.io/jobs/nodejs-jobs", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(5000);

  const nextData = await page.evaluate(() => {
    const el = document.querySelector("#__NEXT_DATA__");
    return el ? el.textContent : "";
  }).catch(() => "");

  if (nextData) {
    try {
      const parsed = JSON.parse(nextData);
      const textBlob = JSON.stringify(parsed).toLowerCase();
      if (textBlob.includes("node")) {
        const links = await page.locator("a").evaluateAll((els) =>
          els.map((a) => ({
            text: (a.innerText || "").trim(),
            href: a.getAttribute("href") || ""
          }))
        );

        for (const link of links) {
          const title = clean(link.text);
          if (!title || title.length < 8) continue;
          if (!matchesRole(title, config)) continue;

          const href = absoluteUrl(link.href, page.url());
          const combined = `${title} ${textBlob}`;

          if (!matchesLocation(combined, config)) continue;
          if ((config.exclude || []).some((x) => combined.includes(x))) continue;

          rows.push({
            Company: "",
            Role: title,
            Experience: "1-4 years",
            Location: (config.targetCities || []).find((c) => combined.includes(c)) || "India",
            Salary: "Not Specified",
            "Apply Link": href,
            "Posted Date": todayStr(),
            "Match Score": scoreText(combined, config),
            Source: "Cutshort"
          });
        }
      }
    } catch (err) {
      if (debug?.enabled) console.log("[CUTSHORT NEXTDATA ERROR]", err.message);
    }
  }

  if (!rows.length) {
    const links = await page.locator("a").evaluateAll((els) =>
      els.map((a) => ({
        text: (a.innerText || "").trim(),
        href: a.getAttribute("href") || ""
      }))
    );

    for (const link of links) {
      const title = clean(link.text);
      if (!title || title.length < 8) continue;
      if (!matchesRole(title, config)) continue;

      const href = absoluteUrl(link.href, page.url());
      if (!href) continue;

      rows.push({
        Company: "",
        Role: title,
        Experience: "1-4 years",
        Location: "India",
        Salary: "Not Specified",
        "Apply Link": href,
        "Posted Date": todayStr(),
        "Match Score": scoreText(title, config),
        Source: "Cutshort"
      });
    }
  }

  return rows;
}

module.exports = { collect };