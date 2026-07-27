const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const clubRoutes = require("./routes/clubs");
const memberRoutes = require("./routes/members");
const eventRoutes = require("./routes/events");

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Backend server is running 🚀");
});

// API Status Route
app.get("/api/status", (req, res) => {
    res.json({
        status: "Online",
        dbConnected: mongoose.connection.readyState === 1,
        timestamp: new Date().toISOString()
    });
});

// Feature routes
app.use("/api/clubs", clubRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/events", eventRoutes);

// MongoDB Connection
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const MONGO_CLUSTER_URL = process.env.MONGO_CLUSTER_URL;
const mongoUri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${MONGO_CLUSTER_URL}`;

const PORT = process.env.PORT || 3000;

mongoose.connect(mongoUri)
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    });