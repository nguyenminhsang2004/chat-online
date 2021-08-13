var express = require('express');
var multer = require('multer');
var config = require('config');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const user_md = require('../model/users');

var router = express.Router();

toSlug = (str) => {
    str = str.toLowerCase();     
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    str = str.replace(/(đ)/g, 'd');
    str = str.replace(/([^0-9a-z-\s])/g, '');
    str = str.replace(/(\s+)/g, '-');
    str = str.replace(/^-+/g, '');
    str = str.replace(/-+$/g, '');
    return str;
}

sendMail = async (user) => {

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let url =`http://localhost:3000/api/auth/verification/verify-account/${uniqueSuffix}/${toSlug(user.full_name)}-${user._id}.html`;

    const msg = {
        to: user.email, // Change to your recipient
        from: config.get('email.userAd'), // Change to your verified sender
        subject: 'Verify email.',
        html: `<div style="text-align:center;color:brown;"><h1>Welcome ${user.full_name}.</h1><a href="${url}">Verify now.</a></div>`,
    }
    return await sgMail.send(msg);
}

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

router.get('/', (req,res) => {
    res.render('home');
});

router.get("/sign-up",(req,res) => {
    res.render('signup');
});

router.post("/sign-up",(req,res) => {
    let user = req.body.user;
    user_md.userLogin(user.email).then(result => {
        if(result === null){
            user_md.addNewUser(req.body.user).then(result => {
                if(result._id){
                    sendMail(result).catch(console.error);
                    res.sendStatus(200);
                }
                else{
                    res.json({"message":"Sign up failed","statusCode":500});
                }
            });
        }
        else{
            res.json({"message":"Email is used","statusCode":500});
        }
    })
    
});

router.get("/sign-in",(req,res) => {
    res.render('signin');
});

router.post("/sign-in",(req,res) => {
    let user = req.body.user;
    user_md.userLogin(user.email).then(result => {
        if(result === null){
            res.json({"message":"Email not found","statusCode":404});
        }
        else{
            if(result.active === false){
                sendMail(result).catch(console.error);
                res.json({"message":"Account un active","statusCode":404});
            }
            else if(result.password !== user.password){
                res.json({"message":"Password wrong","statusCode":404});
            }
            else{
                req.session.userLogin = result;
                res.json({"user": result,"statusCode":200});
            }
        }
    });
});

router.get("/chat/*/*.:idUser.html",(req,res) => {
    if(req.session.userLogin !== null && req.session.userLogin._id === req.params.idUser){
        res.render('chat', {data:{fullName: req.session.userLogin.full_name, id: req.session.userLogin._id}});
    }
    else res.redirect('/');
});

router.get("/sign-out",(req,res) => {
    req.session.userLogin = null;
    res.redirect('/');
});

router.get("/forgot-password",(req,res) => {
    res.render('forgotpass');
});

router.post("/forgot-password",(req,res) => {
    let user = req.body.user;
    user_md.userLogin(user.email).then(result => {
        if(result === null){
            res.json({"message":"Email not found","statusCode":404});
        }
        else{
            result.password = user.password;
            user_md.updatePass(result).then(data => {
                if(data){
                    res.sendStatus(200);
                } 
            }).catch(error => {
                res.json({"message":error,"statusCode":500});
            });
        }
    });
    
});

router.get('/api/auth/verification/verify-account/*/*-:idUser.html', (req,res) => {
    user_md.verifyEmail(req.params.idUser).then(result => {
        if(result){
            res.render('success');
        }
    }).catch(err => {
        res.send(err);
    });
});


module.exports = router;