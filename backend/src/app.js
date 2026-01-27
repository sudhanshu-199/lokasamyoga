const express = require("express");
const healthRoutes = require("./routes/health");

const app = express();

app.use(express.json());

// health API
app.use("/api", healthRoutes);

// root test
app.get("/", (req, res) => {
  res.send("LokaSamyoga Backend Running");
});

module.exports = app;
