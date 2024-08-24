/**
 * Calculates the score of a quiz based on the given answers and questions.
 *
 * @param {Array} answers - The array of user's answers.
 * @param {Array} questions - The array of quiz questions.
 * @returns {number} - The calculated score of the quiz.
 */
const calculateQuizScore = ( answers, questions) => {
  let score = 0;

  // Iterate through the answers
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    const question = questions.find(
      (q) => q._id.toString() === answer.question._id.toString()
    );
    if (question && question.correct_option === answer.selectedOption) {
      score += 1;
    }
  }

  return score;
};

module.exports = { calculateQuizScore };