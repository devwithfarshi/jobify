// - npm packages
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt.js");

/**
 * Generates a JWT token for a given user.
 *
 * @param {Object} user - The user object containing the user's ID and email.
 * @returns {string} - The generated JWT token.
 */
const generateAccessToken = (user, role) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: role.role,
  };
  return jwt.sign(payload, jwtConfig.ACCESS_TOKEN_SECRET, {
    expiresIn: jwtConfig.ACCESS_TOKEN_LIFE,
  });
};

/**
 * Verifies a given JWT token.
 *
 * @param {string} token - The JWT token to verify.
 * @returns {Object} - The decoded payload if the token is valid.
 * @throws {Error} - Throws an error if the token is invalid or expired.
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, jwtConfig.ACCESS_TOKEN_SECRET);
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
};
