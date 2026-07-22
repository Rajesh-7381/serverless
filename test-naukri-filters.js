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
      console.log("\nIntercepted Job API request URL:", url);
      try {
        const json = await response.json();
        console.log("noOfJobs in response:", json.noOfJobs);
        if (json.jobDetails && json.jobDetails.length > 0) {
          const sample = json.jobDetails[0];
          console.log("Sample Job Title:", sample.title);
          console.log("Sample Job Company:", sample.companyName);
          console.log("Sample Job Experience:", sample.experience);
          console.log("Sample Job Date String (created date):", sample.createdDate);
          console.log("Sample Job Footer Placeholder (contains actual date usually):", sample.footerPlaceholderLabel);
        }
      } catch (err) {
        console.error("Error reading JSON:", err.message);
      }
    }
  });

  // Test different filter URLs to see what gets forwarded to the internal API
  const testUrl = "https://www.naukri.com/node-dot-js-developer-jobs-in-india?experience=2&createdDate=7";
  console.log(`Navigating to: ${testUrl}`);
  
  try {
    await page.goto(testUrl, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(3000);
  } catch (err) {
    console.error(err.message);
  }

  await browser.close();
}

test();
