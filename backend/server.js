const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const connectDB = require("./config/db");
const healthRoutes = require("./routes/healthRoutes.js");
const reviewRoutes = require("./routes/review.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const historyRoutes = require("./routes/history.routes.js");

connectDB();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on ${PORT}`));