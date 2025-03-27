const express = require("express");
const dotenv = require("dotenv");
const { connectMongoDB, connectMongoose } = require("./config/db");

dotenv.config();
const app = require("./src/app");

const PORT = process.env.PORT || 5002;

connectMongoDB();
connectMongoose();

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
