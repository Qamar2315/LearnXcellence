const getLatestReview=(vivas)=> {
    if(vivas.length == 0){
        return false;
    }
    var latestViva;
    for(let viva of vivas){
        if(viva.status=='taken'){
            latestViva=viva;
            break;
        }
    }
    for(let viva of vivas){
        if(viva.status=='taken'){
            if(viva.tokenNumber > latestViva.tokenNumber){
                latestViva=viva;
            }
        }
    }
    return latestViva.review;
}

const getAverageReview=(vivas)=>{
    let totalReviews = {
        difficulty: 0,
        relevence: 0,
        clarity: 0,
        conceptual: 0,
        overallFeedback: 0
    };
    let numReviews = 0;

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

    if (numReviews === 0) {
        return null; // Return null if no 'talen' vivas found
    }

    const averageReview = {
        difficulty: Math.round(totalReviews.difficulty / numReviews),
        relevence: Math.round(totalReviews.relevence / numReviews),
        clarity: Math.round(totalReviews.clarity / numReviews),
        conceptual: Math.round(totalReviews.conceptual / numReviews),
        overallFeedback: Math.round(totalReviews.overallFeedback / numReviews)
    };

    return averageReview;
}


module.exports={
    getLatestReview,
    getAverageReview
}