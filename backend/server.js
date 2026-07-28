const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const connectDB = require("./config/db");
const { validateEnv } = require("./config/env");
const { errorMiddleware } = require("./utils/errorHandler");
const healthRoutes = require("./routes/healthRoutes.js");
const reviewRoutes = require("./routes/review.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const historyRoutes = require("./routes/history.routes.js");
const savedRoutes = require("./routes/saved.routes.js");

validateEnv();
connectDB();

const app = express();
app.use(helmet());

// Comma-separated list of allowed origins in production, e.g. "https://app.example.com,https://example.com"
// Falls back to allowing any origin in development so local Vite ports just work.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : true;
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json({ limit: "2mb" }));

app.use("/api/health", healthRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/saved", savedRoutes);

// 404 for anything that didn't match a route above
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Must be registered last so it catches errors from all routes above
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on ${PORT}`));