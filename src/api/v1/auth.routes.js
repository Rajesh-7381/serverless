const express = require("express");
const router = express.Router();
const { endPoints } = require("../api");

router.post(endPoints.auth.login, (req, res) => {
  res.send("Login");
});

module.exports = router; 
