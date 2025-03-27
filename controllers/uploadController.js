const csvtojson = require("csvtojson");
const mongoose = require("mongoose");

exports.uploadQuestions = async (req, res) => {
    try {
        if (!req.file) {
            console.log("No file uploaded");
            return res.status(400).json({ message: "No file uploaded" });
        }

        const subjectName = req.file.originalname.split(".")[0];

        // Convert CSV buffer to JSON
        const fileContent = req.file.buffer.toString();
        console.log("File content preview:", fileContent.substring(0, 500)); // Log first 500 chars

        const jsonArray = await csvtojson().fromString(fileContent);

        console.log("Converted JSON preview:", jsonArray.slice(0, 3)); // Show first 3 entries

        const collection = mongoose.connection.collection(subjectName);
        await collection.insertMany(jsonArray);

        res.status(201).json({
            message: `Questions added to ${subjectName} collection`,
            data: jsonArray,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Error uploading file", error: error.message });
    }
};
