const { chromium } = require("playwright");

async function test() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  });
  const page = await context.newPage();

  page.on("response", async (response) => {
    const url = response.url();
    if (url.includes("search") && url.includes("jobapi")) {
      try {
        const json = await response.json();
        if (json.jobDetails && json.jobDetails.length > 0) {
          console.log("Job Details Keys:", Object.keys(json.jobDetails[0]));
          console.log("Job Details Sample:", JSON.stringify(json.jobDetails[0], null, 2));
        }
      } catch (err) {}
    }
  });

  await page.goto("https://www.naukri.com/node-dot-js-developer-jobs-in-india?experience=2&createdDate=7", {
    waitUntil: "networkidle",
    timeout: 45000
  });
  await page.waitForTimeout(3000);
  await browser.close();
}

test();
