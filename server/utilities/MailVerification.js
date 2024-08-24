/**
 * Verifies if the provided email belongs to a teacher at COMSATS.
 *
 * @param {string} email - The email address to be verified.
 * @returns {boolean} - Returns true if the email matches the teacher's email pattern, false otherwise.
 */
const verifyTeacherEmail = (email) => {
    // Regular expression to match teacher emails from COMSATS
    const regex = /^[a-zA-Z0-9._%+-]+@faculty\.comsats\.edu\.pk$/;
    return regex.test(email);
};

/**
 * Verifies if the provided email belongs to a student at COMSATS.
 *
 * @param {string} email - The email address to be verified.
 * @returns {boolean} - Returns true if the email matches the student's email pattern, false otherwise.
 */
const verifyStudentEmail = (email) => {
    // Regular expression to match student emails from COMSATS
    const regex = /^[a-zA-Z0-9._%+-]+@isbstudent\.comsats\.edu\.pk$/;
    return regex.test(email);
};

module.exports = {
    verifyTeacherEmail,
    verifyStudentEmail
};
