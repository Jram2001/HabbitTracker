var express = require('express');
var router = express.Router();
const habbitController = require('../controller/habbit-controller');

router.post('/getActivityStatus', habbitController.getHabbitActivityStatus);
router.get('/getActivityByUser', habbitController.getHabitActivityByUser);
router.post('/setActivityStatus', habbitController.updateActivityStatus);
router.patch('/updateActivityData', habbitController.updateActivityData);
router.delete('/deleteHabitData', habbitController.deleteActivityData);
router.post('/addNewHabit', habbitController.addNewHabbit);


module.exports = router;
