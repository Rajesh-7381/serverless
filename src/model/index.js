const sequelize = require("../config/db");
const fs = require("fs");
const path = require("path");

const models = {};

function loadModels(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    // Skip index.js & association.js
    if (file === "index.js" || file === "association.js") {
      continue;
    }

    // Recursive folder loading
    if (stat.isDirectory()) {
      loadModels(fullPath);
      continue;
    }

    if (!file.endsWith(".js")) {
      continue;
    }

    const model = require(fullPath);

    if (!model || !model.name) {
      console.warn(`⚠️ Skipping Invalid Model: ${fullPath}`);
      continue;
    }

    console.log(`✅ Loaded Model: ${model.name}`);

    models[model.name] = model;
  }
}

loadModels(__dirname);

// Load Associations
const associationFile = path.join(__dirname, "association.js");

if (fs.existsSync(associationFile)) {
  require(associationFile);
}

// Associate Models
Object.values(models).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

console.log("📦 Registered Models:", Object.keys(models));

models.sequelize = sequelize;
models.Sequelize = require("sequelize");

module.exports = models;