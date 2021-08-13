var express = require('express');
var multer = require('multer');

var router = express.Router();



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
})
var upload = multer({storage:storage});

router.post('/change-image', upload.single('image'), function(req, res, next) {
    const file = req.file;
    res.json({fileName:file.filename, filePath:file.path});
});

router.get("/chat/*/*.:idUser.html",(req,res) => {
    if(req.session.userLogin !== null && req.session.userLogin._id === req.params.idUser){
        res.render('chat', {data:{fullName: req.session.userLogin.full_name, id: req.session.userLogin._id}});
    }
    else res.redirect('/');
});