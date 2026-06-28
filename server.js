const express = require("express");
const app = express();
const dotenv = require("dotenv");
const loadRoutes = require("./src/routes/index");
dotenv.config();

(async () => {
  try {
    await loadRoutes(app);
  } catch (error) {
    console.error("❌ Failed to initialize routes:", error.message);
    process.exit(1);
  }
})();
app.listen(process.env.PORT, () => {
  console.log(`server listened at port ${process.env.PORT}`);
});
console.log("🚀 Server is starting...");
console.log("🚀 Server is starting...");
console.log("🚀 Server is starting...");
console.log("🚀 Server is starting... 4th time");
console.log("for test")
