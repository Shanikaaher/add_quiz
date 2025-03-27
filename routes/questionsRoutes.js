const express = require("express");
const multer = require("multer");

const { getQuestionsForStudent } = require("../controllers/questionController");
const questionResponse = require("../controllers/questionResponseController");
const { uploadQuestions } = require("../controllers/uploadController");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/:studentId", getQuestionsForStudent);
router.post("/submit-responses", questionResponse.storeStudentResponse);
router.post("/upload", upload.single("file"), uploadQuestions);

module.exports = router;
