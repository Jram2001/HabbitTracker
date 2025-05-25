var express = require('express');
var router = express.Router();
const habbitRouter = require('./habbit')
const userRouter = require('./user')
const habbitController = require('../controller/user-controller');

router.use('/habbits', habbitRouter);
router.use('/user', userRouter);
router.get('/test', (req, res) => {
    res.send('User route works!');
});
router.post('/authenticate', habbitController.validateUser);

module.exports = router;
