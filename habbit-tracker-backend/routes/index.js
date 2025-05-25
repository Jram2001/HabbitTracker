var express = require('express');
var router = express.Router();
const habbitRouter = require('./habbit')
const userRouter = require('./user')

router.use('/habbits', habbitRouter);
router.use('/user', userRouter);
router.get('/test', (req, res) => {
    res.send('User route works!');
});

module.exports = router;
