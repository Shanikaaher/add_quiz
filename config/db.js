require("dotenv").config();
const mysql = require("mysql2");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

// MySQL Connection
const mysqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// MongoDB Connection (Mongoose)
const connectMongoose = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB connected successfully (Mongoose)");
    } catch (error) {
        console.error("❌ MongoDB connection error (Mongoose):", error);
        process.exit(1);
    }
};

// MongoDB Connection (MongoClient)
const mongoClient = new MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let mongoDb;

async function connectMongoDB() {
    try {
        const client = await mongoClient.connect();
        mongoDb = client.db("Questions");
        console.log("✅ Connected to MongoDB (MongoClient)");
    } catch (err) {
        console.error("❌ MongoDB Connection Error (MongoClient):", err);
    }
}

function getMongoDB() {
    if (!mongoDb) {
        throw new Error("❌ MongoDB is not connected yet!");
    }
    return mongoDb;
}

module.exports = { mysqlPool, connectMongoose, connectMongoDB, getMongoDB };
