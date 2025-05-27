var express = require('express');
var router = express.Router();
const habbitController = require('../controller/habbit-controller');

router.post('/getActivityStatus', habbitController.getHabbitActivityStatus);
router.get('/getActivityByUser', habbitController.getHabitActivityByUser);


module.exports = router;
