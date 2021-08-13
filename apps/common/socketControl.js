module.exports = (io) => {
    let users = [];
    io.sockets.on('connection', (socket) => {
        socket.on('addNewUser', (user) => {
            let temp = users.filter(item => item.idUser === user.idUser);
            if(temp.length === 0){
                users.push(user);
            }
            socket.userName = user.userName;
            socket.idUser = user.idUser;

            let data = {
                sender:"SERVER",
                message:"You have join chat room",
                listUsers:users
            }

            socket.emit('notify', data);

            data.message = user.userName + " have join to chat room";

            socket.broadcast.emit('notify',data);

        });

        socket.on('sendMessage', (data) => {
            users.map((value) => {
                if(value.idUser === data.idUser){
                    value.imageLink = data.imageLink;
                }
            });

            let _data = {
                sender:"You",
                message:data.message,
                imageLink:data.imageLink,
                listUsers:users
            }

            socket.emit('updateMessage', _data);

            _data.sender = socket.userName;

            socket.broadcast.emit('updateMessage',_data);
        });

        socket.on('updateAvatar', (data) => {
            users.map(value => {
                if(value.idUser === data.idUser){
                    value.imageLink = data.imageLink;
                }
            });
            
            socket.broadcast.emit('notifyUpdateAvt',users);
        })

        socket.on('disconnect', () => {
            users = users.filter(item => item.idUser !== socket.idUser);
            let data = {
                sender:"SERVER",
                message: socket.userName + " out chat room",
                listUsers:users
            }
            socket.broadcast.emit('notify',data);
        });
    });
}