var express = require('express');
var router = express.Router();
const habbitController = require('../controller/user-controller');

router.post('/authenticate', habbitController.validateUser);

module.exports = router;
