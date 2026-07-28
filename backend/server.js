const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Import routes
const healthRoutes = require("./routes/healthRoutes.js");
const reviewRoutes = require("./routes/review.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const historyRoutes = require("./routes/history.routes.js");

// Import middleware
const { connectDB } = require("./config/db");
const { handleError } = require("./utils/errorHandler");

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  handleError(err, res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 CORS enabled for: ${allowedOrigins.join(', ')}`);
  console.log(`🔐 Security: Helmet, Rate Limiting, Input Validation enabled`);
});

module.exports = app;
