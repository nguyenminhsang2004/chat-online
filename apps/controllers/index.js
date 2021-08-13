var express = require('express');
var router = express.Router();

router.use('/users', require(__dirname + '/users'));
router.use('/chat-room', require(__dirname + '/chat'));

router.get('/', (req,res) => {
    res.render('home');
});

module.exports = router;