// Import necessary dependencies
const models = require('../models/user-model');  // User model to interact with the database
const util = require('../util/util');  // Utility function to get user by email
const constant = require('../constant/constant');  // Constant values like regex patterns
const bcrypt = require('bcrypt');  // Library for hashing passwords
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const otpStore = {};
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.GMAIL_PASS
    }
});
const verifiedEmails = new Set();

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
    } catch (err) {
        // Handle server-side errors and send an error response
        res.status(500).json({ error: `Internal server error ${err}` });
    }
}


/**
 * Controller method to create a new user.
 * 
 * This method first validates the email and password formats, then checks if the email
 * is already registered. If not, it hashes the password, creates a new user record, and
 * saves it to the database. A success response is returned if the user is created successfully.
 * In case of any validation or server-side errors, appropriate error responses are sent.
 */
module.exports.createUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        console.log(email, password, name)
        if (!email || !password || !name) {
            return res.status(400).json({ error: "Missing required feilds" });
        }

        // Validate the email format
        const isValidEmail = constant.EMAIL_REGEX.test(email);
        if (!isValidEmail) {
            return res.status(400).json({ error: { value: 'email', message: 'In-valid email address' } });
        }

        // Validate the password format
        const isValidPassword = constant.PASSWORD_REGEX.test(password);
        if (!isValidPassword) {
            return res.status(400).json({ error: { value: 'password', message: 'Password is not strong enough' } });
        }

        console.log(verifiedEmails.has(req.body.email), email, 'email', verifiedEmails, `[${req.body.email}]`)
        // Check if email is verified via OTP
        if (!verifiedEmails.has(req.body.email)) {
            return res.status(400).json({ error: 'Email is not verified with OTP' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new models.User({
            email,
            password: hashedPassword,
            name
        });

        // Save user
        await newUser.save();

        return res.status(200).json({ message: 'User created successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


/**
 * @desc    Sends a One-Time Password (OTP) to the user's email for verification,
 *          only if the email is not already registered.
 * @route   POST /api/send-otp
 * @access  Public
 */
module.exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Check if the email is already registered in the database
        const existingUser = await models.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set OTP expiry time (5 minutes)
        const expires = Date.now() + 5 * 60 * 1000;

        // Store OTP and expiry in your in-memory store
        otpStore[email] = { code: otp, expires };

        // Send OTP email using transporter
        await transporter.sendMail({
            from: `"Habbit tracker" <${process.env.email}>`,
            to: email,
            subject: "Verify your account using this OTP",
            text: `Your OTP is ${otp}`
        });

        console.log(`OTP sent to ${email}: ${otp}`);

        res.json({ message: "OTP sent to your email" });

    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ error: "Failed to send OTP" });
    }
};

/**
 * @desc    Verify the OTP sent to the user's email.
 * @route   POST /api/verify-otp
 * @access  Public
 */
module.exports.verifyOTP = (req, res) => {
    try {
        const { email, otp } = req.body;

        // Check if email and otp are provided
        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        // Get stored OTP data from temporary store
        const record = otpStore[email];

        // Check if OTP exists for the email
        if (!record) {
            return res.status(400).json({ error: "OTP not found or expired" });
        }

        // Check if OTP has expired
        if (Date.now() > record.expires) {
            delete otpStore[email]; // Clean up expired OTP
            return res.status(400).json({ error: "OTP has expired" });
        }

        // Check if the OTP matches
        if (otp !== record.code) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        verifiedEmails.add(email);

        // OTP is valid - delete it to prevent reuse
        delete otpStore[email];

        // Send success response
        return res.json({ message: "OTP verified successfully" });

    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};