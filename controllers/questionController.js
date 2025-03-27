const { mysqlPool, getMongoDB } = require("../config/db");
const { formatQuestion, shuffleArray } = require("../utils/helpers");

exports.getQuestionsForStudent = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const studentInterests = await getStudentInterests(studentId);

        console.log("🟢 Student Interests:", studentInterests);

        if (!studentInterests || studentInterests.length === 0) {
            return res.status(404).json({ success: false, message: "No interests found for student." });
        }

        const questions = await fetchQuestionsFromMongo(studentInterests);
        console.log("🟢 Fetched Questions:", questions);

        return res.json({ success: true, questions });
    } catch (error) {
        console.error("❌ Error in getQuestionsForStudent:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

function getStudentInterests(studentId) {
    return new Promise((resolve, reject) => {
        mysqlPool.query(
            "SELECT Computed_Final_Interests FROM Prediction WHERE Student_id = ?",
            [studentId],
            (err, results) => {
                if (err) {
                    console.error("❌ MySQL Query Error:", err);
                    return reject(err);
                }
                if (results.length === 0) return resolve([]);

                const interests = results[0].Computed_Final_Interests.split(",").map(i => i.trim());
                resolve(interests);
            }
        );
    });
}

async function fetchQuestionsFromMongo(subjects) {
    try {
        const mongoDb = getMongoDB();
        let selectedQuestions = [];
        const totalQuestions = 20;
        const primaryQuestionCount = Math.floor(totalQuestions * 0.6);
        const commonQuestionCount = totalQuestions - primaryQuestionCount;

        for (let subject of subjects.slice(0, 2)) {
            const collection = mongoDb.collection(subject);
            if (!collection) continue;

            const questions = await collection.find({}, { projection: { _id: 0, question: 1, options: 1 } })
                .limit(primaryQuestionCount / subjects.length)
                .toArray();

            questions.forEach(q => selectedQuestions.push(formatQuestion(q)));
        }

        const commonSubjects = ["Logical", "Scenario_based", "Reasoning", "SciFi"];
        for (let subject of commonSubjects) {
            if (selectedQuestions.length >= totalQuestions) break;
            const collection = mongoDb.collection(subject);
            if (!collection) continue;

            const questions = await collection.find({}, { projection: { _id: 0, question: 1, options: 1 } })
                .limit(commonQuestionCount / commonSubjects.length)
                .toArray();

            questions.forEach(q => selectedQuestions.push(formatQuestion(q)));
        }

        return shuffleArray(selectedQuestions.slice(0, totalQuestions));
    } catch (error) {
        console.error("❌ Error Fetching Questions from MongoDB:", error);
        return [];
    }
}
