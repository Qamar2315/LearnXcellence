const bcrypt = require('bcrypt');

/**
 * Compares a plain text password with a hashed password to see if they match.
 *
 * @param {string} password - The plain text password to be compared.
 * @param {string} toCompare - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to true if the passwords match, false otherwise.
 */
const matchPassword = async function (password, toCompare) {
    // Compare the plain text password with the hashed password
    return await bcrypt.compare(password, toCompare);
};

module.exports = matchPassword;
