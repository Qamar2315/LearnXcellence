const jwt = require('jsonwebtoken');

/**
 * Generates a JSON Web Token (JWT) for a given user ID.
 *
 * @param {string|number} id - The unique identifier of the user for whom the token is being generated.
 * @returns {string} - The generated JWT token, signed with a secret key.
 */
const generateToken = (id) => {
    // Generate a JWT token with the user ID as payload
    // The token is signed with a secret key ("hi") and is set to expire in 30 days
    return jwt.sign({ id }, "hi", { expiresIn: "30d" });
};

module.exports = generateToken;
