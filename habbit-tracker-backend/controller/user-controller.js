// Import necessary dependencies
const models = require('../../models/user');  // User model to interact with the database
const util = require('../util/util');  // Utility function to get user by email
const constant = require('../../constant/constant');  // Constant values like regex patterns
const bcrypt = require('bcrypt');  // Library for hashing passwords
const jwt = require('jsonwebtoken');

/**
 * Controller method to retrieve all users from the database.
 * 
 * This method fetches all user records from the database and returns them as a JSON response.
 * In case of an error, it sends a 500 status code with an error message.
 */
module.exports.getAllUser = async (req, res) => {
    try {
        const userData = await models.User.find();
        res.json(res)
    } catch (error) {
        res.status(500).send('server error');
    }
}

/**
 * Controller method to retrieve a single user based on the provided email query parameter.
 * 
 * This method uses the email provided in the query parameter to fetch a user and returns
 * the user data if found. If an error occurs during the retrieval, a 500 status code is sent.
 */
module.exports.getOneUser = async (req, res) => {
    try {
        const { userId } = req.query;

        // Check if the userId is provided
        if (!userId) {
            return res.status(400).json({ error: 'UserId query parameter is required' });
        }

        // Retrieve user data by ID
        const userData = await util.getUserById(userId);

        // If user not found, return 404 response
        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send the user data in response
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error retrieving user:', error.message);

        // Respond with a 500 status code for unexpected server errors
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

/**
 * Controller method to validate a user's credentials during login.
 * 
 * This method checks if the email and password are provided, validates the email format,
 * and compares the provided password with the stored hashed password in the database.
 * If valid, the user is successfully authenticated and a success response is sent.
 * In case of any invalid input or failure, the corresponding error response is sent.
 */
module.exports.validateUser = async (req, res) => {
    const request = req.body;
    try {
        // Check if email and password are provided
        if (!request.email && !request.password) {
            return res.status(400).json({ error: 'Email and Password are required' });
        }

        // Validate the email format using a regular expression
        const isValidEmail = constant.EMAIL_REGEX.test(request.email);
        if (!isValidEmail) {
            return res.status(400).json({ error: 'Not a valid email' });
        }

        // Retrieve the user by email
        const userData = await util.getUserByEmail(request.email);
        if (!userData) {
            return res.status(404).json({ error: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(request.password, userData.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = util.generateToken({ id: request.id, email: request.email })

        // If authentication is successful, send a success response
        res.status(200).json({ message: 'User validated successfully', token: token, userId: userData.id, profilePicture: userData.profilePicture });
    } catch (error) {
        // Handle server-side errors and send an error response
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
