const express = require("express");

const router = express.Router();

// Health check API
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is healthy",
  });
});

module.exports = router;
