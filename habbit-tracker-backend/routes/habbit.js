var express = require('express');
var router = express.Router();

router.get('/getActivity', (req, res) => {
    res.send('Habbit activity');
});
module.exports = router;
