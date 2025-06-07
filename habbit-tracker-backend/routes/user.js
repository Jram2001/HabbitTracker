var express = require('express');
var router = express.Router();
const habbitController = require('../controller/user-controller');

router.post('/authenticate', habbitController.validateUser);
router.post('/signup', habbitController.createUser);
router.post('/send-otp', habbitController.sendOTP);
router.post('/verify-otp', habbitController.verifyOTP);

module.exports = router;
