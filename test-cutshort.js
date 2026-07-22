const { chromium } = require("playwright");

async function test() {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  });
  const page = await context.newPage();

  page.on("response", async (response) => {
    const url = response.url();
    if (url.includes("api/v1/jobs") || url.includes("jobs/api") || url.includes("graphql") || url.includes("search")) {
      console.log("Intercepted potential Cutshort API url:", url.slice(0, 150));
      try {
        const text = await response.text();
        console.log("Length:", text.length);
        if (text.startsWith("{")) {
          console.log("Response starts with JSON keys:", Object.keys(JSON.parse(text)).slice(0, 5));
        }
      } catch (err) {}
    }
  });

  console.log("Navigating to Cutshort...");
  try {
    await page.goto("https://cutshort.io/jobs/nodejs-jobs", { waitUntil: "networkidle", timeout: 45000 });
    console.log("Navigation complete. Waiting 5s...");
    await page.waitForTimeout(5000);

    // Let's also check if we can select job cards from DOM
    // Typically Cutshort uses elements that contain job information. Let's print some text from selectors.
    console.log("Printing body text sample...");
    const bodyText = await page.innerText("body");
    console.log(bodyText.slice(0, 500));
  } catch (err) {
    console.error("Navigation error:", err.message);
  }

  await browser.close();
}

test();
