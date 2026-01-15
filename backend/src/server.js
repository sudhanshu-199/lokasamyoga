const express = require("express");

const app = express();

// middleware (future use)
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("LokaSamyoga Backend Running");
});

const PORT = 3001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// prevent accidental exit (macOS safety)
process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated");
  });
});
