/**
 * Extracts the enrollment number from an email address.
 *
 * The enrollment number is expected to follow the pattern "SPXX-XXX-XXX",
 * where "XX" represents two digits and "XXX" represents a combination of letters and digits.
 * 
 * @param {string} email - The email address containing the enrollment number.
 * @returns {string|null} - The extracted enrollment number if found, or null if not found.
 */
function extractEnrollment(email) {
    // Regular expression to match the enrollment number pattern (e.g., SP20-ABC-123)
    const match = email.match(/(sp\d{2}-\w{3}-\d{3})/i);
    
    // Return the matched enrollment number, or null if no match is found
    return match ? match[0] : null;
}

module.exports = {
    extractEnrollment
};
