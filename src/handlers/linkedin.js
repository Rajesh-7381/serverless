const { clean, todayStr, scoreText, matchesRole, matchesLocation, absoluteUrl } = require("../utils/common");

/**
 * Build LinkedIn public job search URLs.
 * LinkedIn public job search works without auth for unauthenticated HTML scraping.
 * Uses geoId=102713980 for India, f_WT=2 for remote worldwide.
 */
function buildSearchUrls(config) {
  const keywords = (config.keywords || ["node.js developer"]).slice(0, 2).join(" OR ");
  const query = encodeURIComponent(keywords);

  const urls = [];

  // India cities
  const indiaCities = (config.targetCities || []).filter(
    (c) => c !== "india" && c !== "remote" && c !== "pan india"
  );
  for (const city of indiaCities.slice(0, 4)) {
    urls.push(
      `https://www.linkedin.com/jobs/search/?keywords=${query}&location=${encodeURIComponent(city + ", India")}&f_TPR=r604800&sortBy=DD`
    );
  }

  // Pan India
  urls.push(
    `https://www.linkedin.com/jobs/search/?keywords=${query}&location=India&geoId=102713980&f_TPR=r604800&sortBy=DD`
  );

  // Remote worldwide
  urls.push(
    `https://www.linkedin.com/jobs/search/?keywords=${query}&f_WT=2&f_TPR=r604800&sortBy=DD`
  );

  return [...new Set(urls)];
}

/**
 * Extract structured job cards from LinkedIn public search results.
 * LinkedIn renders public job listings as <li> with class `job-search-card` or `jobs-search__results-list` items.
 */
async function extractJobCards(page, config, debug) {
  const rows = [];

  try {
    const cards = await page.evaluate(() => {
      const results = [];

      // LinkedIn public jobs page card selectors
      const cardEls = document.querySelectorAll(
        ".job-search-card, li.jobs-search-results__list-item, li[class*='job-result-card']"
      );

      cardEls.forEach((card) => {
        const titleEl = card.querySelector(
          ".job-search-card__title, h3.base-search-card__title, .job-result-card__title, a[class*='job-card-list__title']"
        );
        const companyEl = card.querySelector(
          ".job-search-card__subtitle, h4.base-search-card__subtitle, .job-result-card__subtitle, a[class*='job-card-container__company-name']"
        );
        const locationEl = card.querySelector(
          ".job-search-card__location, .base-search-card__metadata, .job-result-card__location, [class*='job-card-container__metadata-item']"
        );
        const dateEl = card.querySelector("time, [class*='date']");

        // Get link from anchor tag
        const linkEl = card.querySelector("a[href*='/jobs/view']");
        const href = linkEl ? (linkEl.getAttribute("href") || "") : "";

        results.push({
          title: (titleEl ? titleEl.innerText : "").trim(),
          company: (companyEl ? companyEl.innerText : "").trim(),
          location: (locationEl ? locationEl.innerText : "").trim(),
          date: dateEl ? (dateEl.getAttribute("datetime") || dateEl.innerText || "") : "",
          href
        });
      });

      return results;
    });

    for (const card of cards) {
      const title = clean(card.title);
      if (!title || title.length < 5) continue;
      if (!matchesRole(title, config)) continue;

      const location = clean(card.location) || "India";
      const combined = `${title} ${location} ${card.company}`.toLowerCase();
      if (!matchesLocation(combined, config)) continue;
      if ((config.exclude || []).some((x) => combined.includes(x))) continue;

      // LinkedIn hrefs are often relative or contain tracking params — clean them up
      let href = card.href;
      if (href && !href.startsWith("http")) {
        href = `https://www.linkedin.com${href}`;
      }
      // Strip tracking parameters after ?
      href = href.split("?")[0];

      const posted = card.date
        ? (new Date(card.date).toISOString().slice(0, 10) || todayStr())
        : todayStr();

      rows.push({
        Company: clean(card.company) || "Unknown",
        Role: title,
        Experience: "1-4 years",
        Location: location,
        Salary: "Not Specified",
        "Apply Link": href,
        "Posted Date": posted,
        "Match Score": scoreText(combined, config),
        Source: "LinkedIn"
      });
    }
  } catch (err) {
    if (debug?.enabled) console.log("[LINKEDIN CARD ERROR]", err.message);
  }

  // Fallback: anchor link scan
  if (!rows.length) {
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
      const href = absoluteUrl(link.href, "https://www.linkedin.com");
      if (!title || title.length < 8) continue;
      if (!href || (!href.includes("linkedin.com/jobs") && !href.includes("/jobs/view"))) continue;
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
        "Apply Link": href.split("?")[0],
        "Posted Date": todayStr(),
        "Match Score": scoreText(combined, config),
        Source: "LinkedIn"
      });
    }
  }

  return rows;
}

async function collect(page, config, debug) {
  const allRows = [];
  const urls = buildSearchUrls(config);

  for (const url of urls) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(6000);

      // Wait for job cards to render
      try {
        await page.waitForSelector(
          ".job-search-card, li.jobs-search-results__list-item, .base-search-card__title",
          { timeout: 8000 }
        );
      } catch {
        // May not appear if redirected to login — fallback will handle it
      }

      const rows = await extractJobCards(page, config, debug);
      if (debug?.enabled) console.log(`[LINKEDIN] url=${url} rows=${rows.length}`);
      allRows.push(...rows);

      // Respectful delay between pages
      await page.waitForTimeout(3000);
    } catch (err) {
      if (debug?.enabled) console.log("[LINKEDIN URL ERROR]", url, err.message);
    }
  }

  return allRows;
}

module.exports = { collect };
