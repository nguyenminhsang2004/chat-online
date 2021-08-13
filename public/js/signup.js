$(function(){
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    createError = (errorName) => {
        content = '<div class="alert alert-danger">Error: ' + errorName + '.</div>';
        return content;
    }

    $('#btnSignUp').click((e) => {
        $('#alert-notify .alert.alert-danger').remove();
        let flag = true;
        e.preventDefault();

        let fullName = $('#name').val().trim();
        let email = $('#email').val().trim();
        let pass = $('#pass').val().trim();
        let rePass = $('#repass').val().trim();
        if(fullName.length === 0){
            let content = createError('Name required');
            $('#alert-notify').append(content);
            flag = false;
        }
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
                full_name: fullName,
                email: email,
                password: $.md5(pass),
                active: false
            };
            $.ajax({
                type: "POST",
                url: "/users/sign-up",
                data: {user:_user},
                dataType: "JSON"
            }).always((res) => {
                if(res.status === 200){
                    window.location.replace("http://localhost:3000/users/sign-in");
                    //window.location.replace("https://app-chat-online.herokuapp.com/sign-in");
                }
                else{
                    let content = createError(res.message);
                    $('#alert-notify').append(content);
                    $('#name').val('');
                    $('#email').val('');
                    $('#pass').val('');
                    $('#repass').val('');
                }
            });
        }
    });
})