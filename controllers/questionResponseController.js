const { getMongoDB } = require("../config/db");

exports.storeStudentResponse = async (req, res) => {
    try {
        const { studentId, responses } = req.body;

        if (!studentId || !responses || !Array.isArray(responses)) {
            return res.status(400).json({ success: false, message: "Invalid request data" });
        }

        const mongoDb = getMongoDB();
        const responseCollection = mongoDb.collection("StudentResponses");

        await responseCollection.insertOne({
            studentId,
            responses,
            submittedAt: new Date(),
        });

        return res.json({ success: true, message: "Responses saved successfully" });
    } catch (error) {
        console.error("❌ Error storing student responses:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
