var express = require('express');
const user_md = require('../model/users');
var router = express.Router();

router.use('/users', require(__dirname + '/users'));
router.use('/chat-room', require(__dirname + '/chat'));

router.get('/', (req,res) => {
    res.render('home');
});


module.exports = router;