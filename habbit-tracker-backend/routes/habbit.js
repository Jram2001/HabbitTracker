var express = require('express');
var router = express.Router();
const habbitController = require('../controller/habbit-controller');
const middleware = require('../middleware/authenticate-token');

router.post('/getActivityStatus', middleware.authenticateToken, habbitController.getHabbitActivityStatus);
router.get('/getActivityByUser', middleware.authenticateToken, habbitController.getHabitActivityByUser);
router.post('/setActivityStatus', middleware.authenticateToken, habbitController.updateActivityStatus);
router.patch('/updateActivityData', middleware.authenticateToken, habbitController.updateActivityData);
router.delete('/deleteHabitData', middleware.authenticateToken, habbitController.deleteActivityData);
router.post('/addNewHabit', middleware.authenticateToken, habbitController.addNewHabbit);


module.exports = router;
