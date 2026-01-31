const express = require("express");
const connectDB = require("./config/db");
const healthRoutes = require("./routes/health");

const app = express();

connectDB();

app.use(express.json());
app.use("/health", healthRoutes);

module.exports = app;
