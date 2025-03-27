const express = require("express");
const multer = require("multer");

const { uploadQuestions } = require("../controllers/uploadController");

const router = express.Router();

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Debugging middleware
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            console.log("No file received");
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        console.log("File received:", req.file.originalname);
        console.log("File size:", req.file.size);

        // Call the controller function
        await uploadQuestions(req, res);
    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

module.exports = router;
