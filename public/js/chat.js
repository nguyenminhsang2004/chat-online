$(function(){

    $('#message').emojioneArea({
        pickerPosition: "top"
    });

    $('#btnCloseNotify').on('click', () => {
        $('.toast-content').removeClass('active-notify');
    });

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

    let imageLink = "/public/images/user.png";
    let userName = $('title').attr('name');
    let idUser = $('title').attr('id');

    //const socket = io.connect('https://app-chat-online.herokuapp.com');
    const socket = io.connect('http://localhost:3000');
    socket.on('connect', () => {
        let user = {
            idUser: idUser,
            userName:userName,
            imageLink:imageLink
        }
        socket.emit('addNewUser',user);
    });

    updateUserOnline = (listUsers) => {
        $('#user-online ul#list-users li.user-item').remove();
        listUsers.map((value) => {
            let content = '<li class="user-item">';
            content += '<div class="card-body box-profile" style="padding: .25rem;">';
            content += '<div class="text-center">';
            content += '<img class="profile-user-img img-fluid img-circle '+ toSlug(value.userName) + '-' + value.idUser +'" src="' + value.imageLink + '" alt="User profile picture">';
            content += ' <i class="color-active fa fa-circle"></i>';
            content += '</div>';
            content += '<h6 class="profile-username text-center">' + value.userName + '</h6>';
            content += '</div>';
            content += '</li>';
            $('#user-online ul#list-users').append(content);
        });
    }

    socket.on('notify', (data) => {
        $('#toastTitle').html(data.sender);
        $('#toastContent').html(data.message);
        $('.toast-content').addClass('active-notify');
        updateUserOnline(data.listUsers);
        setTimeout(() => {
            $('.toast-content').removeClass('active-notify');
        }, 3000);      
    });

    $('.image-user-change').on('change', (e) => {
        let fileData = e.target.files[0];
        if(fileData){
            var formData = new FormData();
            formData.append('image', fileData);
            $.ajax({
                url:"/chat-room/change-image",
                dataType: 'text/html',
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
                type: 'POST'
            }).always((res) => {
                let result = JSON.parse(res.responseText);
                imageLink = "/" + result.filePath;
                $('.imageUserBackground').attr('src',imageLink);
                $('label#fileNameImageUser').html(result.fileName);
                $('.'+ toSlug(userName) + '-' + idUser).attr('src',imageLink);

                let data = {
                    idUser: idUser,
                    imageLink: imageLink
                }

                socket.emit('updateAvatar',data);
            });
        }
    });

    $('.form-message').keypress(e => {
        if(e.keyCode === 13){
            e.preventDefault();
            let message = $("#message")[0].emojioneArea.getText().trim();
            if(message.length !== 0){
                let data = {
                    message:message,
                    imageLink:imageLink,
                    userName:userName,
                    idUser: idUser
                }
                socket.emit('sendMessage',data);
            } 
            $(".emojionearea-editor").html(''); 
        }
    });

    socket.on('notifyUpdateAvt', (data) => {
        updateUserOnline(data);
    })

    socket.on('updateMessage', (data) => {
        let time = new Date();
        if(data.sender === "You"){
            let content = '<li class="mottinnhan message-of-you">';
            content += '<div class="message-content" id="content-message-chat">';
            content += '<div class="user-block">';
            content += '<img class="image-user imageUserBackground" src="' + data.imageLink + '" alt="user image">';
            content += '<span class="username">';
            content += '<a href="#">'+ data.sender + '</a>';
            content += '</span>';
            content += '<span class="description">' + time.toString().split(' ')[4] +' Today</span>';
            content += '</div>';
            content += '<div class="message">'+ data.message +'</div>';
            content += '</div>';
            content += '</li>';
            $('#content-message-chat').append(content);
            $('.imageUserBackground').attr('src',data.image);
        }
        else{
            let content = '<li class="mottinnhan message-of-other">';
            content += '<div class="message-content" id="content-message-chat">';
            content += '<div class="user-block">';
            content += '<img class="image-user imageUserBackgroundOrder" src="' + data.imageLink + '" alt="user image">';
            content += '<span class="username">';
            content += '<a href="#">'+ data.sender + '</a>';
            content += '</span>';
            content += '<span class="description">' + time.toString().split(' ')[4] +' Today</span>';
            content += '</div>';
            content += '<div class="message">'+ data.message +'</div>';
            content += '</div>';
            content += '</li>';
            $('#content-message-chat').append(content);
        }
        updateUserOnline(data.listUsers);
    });
});
    