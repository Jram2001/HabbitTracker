const Models = require('../models/user-model');

/**
 * Utility function to get a user by user ID.
 * 
 * @param {string} userId - The ID of the user to be fetched.
 * @returns {Promise<Object|null>} - Resolves to the user object if found, or null if not found.
 * @throws {Error} - Throws an error if the query fails.
 */
const getUserById = async (userId) => {
    try {
        // Validate userId
        if (!ObjectId.isValid(userId)) {
            throw new Error('Invalid userId format');
        }

        // Fetch user from the database
        const user = await Models.User.findOne({ '_id': new ObjectId(userId) });

        // Return the user or null if not found
        return user || null;
    } catch (error) {
        console.error('Error retrieving user:', error.message);
        throw new Error('Error retrieving user');
    }
};

/**
 * Generates a JWT token.
 * @param {object} payload - Data to encode in the token
 * @param {string} expiresIn - Token expiry duration (e.g., '1h', '7d')
 * @returns {string} - Signed JWT token
 */
const generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, SECRENT_TOKEN, { expiresIn });
};


/**
 * Utility function to get a user by email.
 * @param {string} email - The email of the user to be fetched.
 * @returns {Promise} - Resolves to the user object if found, or null if not found.
 */
const getUserByEmail = async (email) => {
    try {
        const user = await Models.User.findOne({ 'email': email });
        console.log(user, email)
        return user
    }
    catch (error) {
        return Error('Error retriving user', error)
    }
}


module.exports = {
    getUserByEmail,
    generateToken,
    getUserById
}