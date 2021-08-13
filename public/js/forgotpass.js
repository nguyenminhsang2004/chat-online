$(function(){

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    createError = (errorName) => {
        content = '<div class="alert alert-danger">Error: ' + errorName + '.</div>';
        return content;
    }

    $('#btnSubmit').click(function (e) { 
        $('#alert-notify .alert.alert-danger').remove();
        let flag = true;
        e.preventDefault();

        let email = $('#email').val().trim();
        let pass = $('#pass').val().trim();
        let rePass = $('#repass').val().trim();

        if(email.length === 0 || email.search('@gmail') < 2 || !validateEmail(email)){
            let content = createError('Email required');
            $('#alert-notify').append(content);
            flag = false;
        }
        if(pass.length === 0 ){
            let content = createError('Password required');
            $('#alert-notify').append(content);
            flag = false;
        }
        else if(pass !== rePass){
            let content = createError('Password not match');
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
                url: "/forgot-password",
                data: {user:_user},
                dataType: "JSON"
            }).always((res) => {
                console.log(res)
                if(res.status === 200){
                    window.location.replace("http://localhost:3000/sign-in");
                    //window.location.replace("https://app-chat-online.herokuapp.com/sign-in");
                }
                else{
                    let content = createError(res.message);
                    $('#alert-notify').append(content);

                    $('#email').val('');
                    $('#pass').val('');
                    $('#repass').val('');
                }
            });
        }
        
    });
})