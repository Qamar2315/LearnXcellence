/**
 * Generates a unique 9-character course code consisting of lowercase letters and digits.
 *
 * The function ensures that the generated course code does not already exist in the provided array of objects.
 * 
 * @param {Array} arr - An array of objects where each object should have a `classId` property.
 * @returns {string} - A unique 9-character course code.
 */
const generateCourseCode = (arr) => {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";

    // Generate a random 9-character string
    for (let i = 0; i < 9; i++) {
        randomString += characters[Math.floor(Math.random() * characters.length)];
    }

    // Check if the generated code already exists in the array
    for (let item of arr) {
        if (item.classId === randomString) {
            // If it exists, recursively generate a new code
            return generateCourseCode(arr);
        }
    }

    // Return the unique code
    return randomString;
};

module.exports = {
    generateCourseCode
};
