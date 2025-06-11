const jwt = require('jsonwebtoken');

/**
 * Middleware function to authenticate and verify JWT token from the request headers.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.headers - Request headers containing authentication information.
 * @param {string} req.headers.authorization - The authorization header containing the Bearer token.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback function to pass control to the next middleware.
 * 
 * @returns {void} - Calls `next()` if authentication is successful, otherwise sends an error response.
 *
 * @throws {Error} 
 * - Returns `401 Unauthorized` if the token is missing or expired.
 * - Returns `403 Forbidden` if the token is invalid.
 * - Returns `500 Internal Server Error` if there is an issue verifying the token.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    console.log(authHeader, 'authHeader')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token required' });
    }

    const token = authHeader.split(' ')[1]; // Extract the actual token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);

        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired, please login again' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token, authentication failed' });
        } else {
            return res.status(500).json({ message: 'Internal server error during token validation' });
        }
    }
};

module.exports = authenticateToken;






module.exports = { authenticateToken }