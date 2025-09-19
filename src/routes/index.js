const fs = require("fs").promises;
const path = require("path");

module.exports = async (app) => {
  const { API_VERSION } = require("../api/api");
  const versionDirPath = path.join(__dirname, `../api/${API_VERSION.toLowerCase()}`);
  console.log(`📦 Loading routes from: ${versionDirPath}`);

  const files = await fs.readdir(versionDirPath, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile() && file.name.endsWith(".routes.js")) {
      const routePath = path.join(versionDirPath, file.name);

      try {
        const route = require(routePath);
        // console.log(`✅ typeof route: ${typeof route}`);
        // console.dir(route);

        // ✅ DO NOT check for route.use — routers are callable
        if (typeof route !== "function") {
          throw new Error("Module is not an Express Router");
        }

        app.use(route); // mounted at root
        console.log(`✅ Registered: ${file.name}`);
      } catch (err) {
        console.error(`❌ Failed to load ${file.name}: ${err.message}`);
      }
    }
  }
};
