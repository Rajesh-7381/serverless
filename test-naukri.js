const { chromium } = require("playwright");

async function test() {
  console.log("Launching browser using system Chrome channel...");
  try {
    const browser = await chromium.launch({
      headless: true,
      channel: "chrome" // Use system Chrome
    });
    console.log("Success! Chrome launched.");
    
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    });
    const page = await context.newPage();

    console.log("Monitoring network requests...");
    page.on("response", async (response) => {
      const url = response.url();
      if (url.includes("search") && url.includes("jobapi")) {
        console.log("Found Job API request:", url);
        try {
          const json = await response.json();
          console.log("Success! Job API response keys:", Object.keys(json));
          console.log("Number of jobs returned:", json.jobDetails?.length || json.jobs?.length || 0);
        } catch (err) {
          console.error("Error reading JSON:", err.message);
        }
      }
    });

    console.log("Navigating to Naukri...");
    await page.goto("https://www.naukri.com/node-dot-js-developer-jobs-in-india", {
      waitUntil: "networkidle",
      timeout: 45000
    });
    console.log("Waiting 5s for dynamic loads...");
    await page.waitForTimeout(5000);
    await browser.close();
    console.log("Browser closed.");
  } catch (err) {
    console.error("Failed launching system Chrome:", err.message);
  }
}

test();
