// Format question with options or a text box
function formatQuestion(q) {
    if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
        return {
            question: q.question,
            textBox: {
                textBox: true
            }
        };
    }
    return {
        question: q.question,
        options: {
            A: q.options[0] || "",
            B: q.options[1] || "",
            C: q.options[2] || "",
            D: q.options[3] || ""
        }
    };
}

// Shuffle array for randomness
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

module.exports = { formatQuestion, shuffleArray };
