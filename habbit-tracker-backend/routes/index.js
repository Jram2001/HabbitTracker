var express = require('express');
var router = express.Router();
const habbitRouter = require('./habbit')
const userRouter = require('./user')
const habbitController = require('../controller/user-controller');
const todoRouter = require('./todo');

router.use('/habbits', habbitRouter);
router.use('/user', userRouter);
router.use('/todo', todoRouter);
router.get('/test', (req, res) => {
    res.send('User route works!');
});
router.get('/', (req, res) => {
  res.send('Habit Tracker API is running!');
});
router.post('/authenticate', habbitController.validateUser);

module.exports = router;
