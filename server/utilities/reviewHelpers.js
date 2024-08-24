/**
 * Retrieves the latest review from an array of vivas based on their token number.
 *
 * @param {Array} vivas - An array of viva objects, each with a `status`, `tokenNumber`, and `review` property.
 * @returns {Object|boolean} - The latest review object if available, or false if no 'taken' vivas are found.
 */
const getLatestReview = (vivas) => {
    if (vivas.length === 0) {
        return false; // Return false if the array is empty
    }

    let latestViva = null;

    // Find the latest viva with 'taken' status
    for (const viva of vivas) {
        if (viva.status === 'taken') {
            if (!latestViva || viva.tokenNumber > latestViva.tokenNumber) {
                latestViva = viva;
            }
        }
    }

    // Return the review of the latest viva, or false if no 'taken' viva was found
    return latestViva ? latestViva.review : false;
};

/**
 * Calculates the average review scores from an array of vivas.
 *
 * @param {Array} vivas - An array of viva objects, each with a `status` and `review` property.
 * @returns {Object|null} - An object with average review scores or null if no 'taken' vivas are found.
 */
const getAverageReview = (vivas) => {
    const totalReviews = {
        difficulty: 0,
        relevence: 0,
        clarity: 0,
        conceptual: 0,
        overallFeedback: 0
    };
    let numReviews = 0;

    // Accumulate total review scores from 'taken' vivas
    for (const viva of vivas) {
        if (viva.status === 'taken') {
            const review = viva.review;
            totalReviews.difficulty += review.difficulty;
            totalReviews.relevence += review.relevence;
            totalReviews.clarity += review.clarity;
            totalReviews.conceptual += review.conceptual;
            totalReviews.overallFeedback += review.overallFeedback;
            numReviews++;
        }
    }

    // Return null if no 'taken' vivas were found
    if (numReviews === 0) {
        return null;
    }

    // Calculate average review scores
    const averageReview = {
        difficulty: Math.round(totalReviews.difficulty / numReviews),
        relevence: Math.round(totalReviews.relevence / numReviews),
        clarity: Math.round(totalReviews.clarity / numReviews),
        conceptual: Math.round(totalReviews.conceptual / numReviews),
        overallFeedback: Math.round(totalReviews.overallFeedback / numReviews)
    };

    return averageReview;
};

module.exports = {
    getLatestReview,
    getAverageReview
};
