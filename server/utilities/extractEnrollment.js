function extractEnrollment(email) {
    // Use a regular expression to match the enrollment number pattern
    const match = email.match(/(sp\d{2}-\w{3}-\d{3})/i);
    return match ? match[0] : null;
}

module.exports= {
    extractEnrollment
};