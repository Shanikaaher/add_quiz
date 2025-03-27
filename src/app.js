const express = require("express");
const cors = require("cors");
const { connectMongoDB } = require("../config/db"); // Import MongoDB connection function
const questionsRoute = require("../routes/questionsRoutes");



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/questions", questionsRoute);

// Connect to MongoDB before setting up routes
connectMongoDB().then(() => {
    app.use(questionsRoute);
});


module.exports = app;
