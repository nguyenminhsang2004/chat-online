$(function(){

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    createError = (errorName) => {
        content = '<div class="alert alert-danger">Error: ' + errorName + '.</div>';
        return content;
    }

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


    $('#btnSignIn').click((e) => {
        $('#alert-notify .alert.alert-danger').remove();
        let flag = true;
        e.preventDefault();
        let email = $('#email').val().trim();
        let pass = $('#pass').val().trim();
        if(email.length === 0 || email.search('@gmail') < 2 || !validateEmail(email)){
            let content = createError('Email required');
            $('#alert-notify').append(content);
            flag = false;
        }
        if(pass.length === 0){
            let content = createError('Password required');
            $('#alert-notify').append(content);
            flag = false;
        }

        if(flag === true){
            let _user = {
                email: email,
                password: $.md5(pass)
            };
            $.ajax({
                type: "POST",
                url: "/users/sign-in",
                data: {user:_user},
                dataType: "JSON"
            }).always((res) => {
                if(res.statusCode === 200){   
                    const uniqueSuffix = $.md5(Date.now() + Math.round(Math.random() * 1E9));
                    window.location.replace("http://localhost:3000/chat-room/chat/" + uniqueSuffix + "/" + toSlug(res.user.full_name) + "." + res.user._id + ".html");
                    //window.location.replace("https://app-chat-online.herokuapp.com/chat/" + uniqueSuffix + "/" + toSlug(res.user.full_name) + "." + res.user._id + ".html");
                }
                else{
                    let content = createError(res.message);
                    $('#alert-notify').append(content);
                }
                
            });

            $('.email-sign-in').val('');
            $('.pass-sign-in').val('');
        }

    });
});