let onlineUsers = [];

export default function (socket, io) {
//user joins or open the application
socket.on('join', (user_id) => {
    socket.join(user_id);
    //add joined user to online users
    if(!onlineUsers.some((u) => u.userId === user_id)){
        onlineUsers.push({ userId: user_id, socketId: socket.id });
    }
    //send online users to frontend
    io.emit("get-online-users", onlineUsers);

    //send socket id
    io.emit('setup socket', socket.id);
    
});

//socket disconnect
socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit('get-online-users', onlineUsers);
});

//socket offline

//join a conversation room
socket.on('join conversation', (conversation) => {
    socket.join(conversation);
});

//send and receive message
socket.on("send message", (message) => {
    console.log("new message: ------> ", message);
    let conversation = message.conversation;
    if(!conversation.users) return;
    conversation.users.forEach((user) => {
        if(user._id === message.sender._id) return;
        socket.in(user._id).emit("receive message", message);
        // console.log("here is the user", user._id)
    })
});

//typing
socket.on('typing', (conversation) => {
    socket.in(conversation).emit('typing', conversation);
})
socket.on('stop typing', (conversation) => {
    socket.in(conversation).emit("stop typing");
});

//call
socket.on("call user", (data) => {
    let userId = data.userToCall;
    let userSocketId = onlineUsers.find((user) => user.userId === userId);
    io.to(userSocketId.socketId).emit('call user', {
        signal: data.signal,
        from: data.from,
        name: data.name,
        picture: data.picture,
    });
});

//answer call 
socket.on("answer call", (data) => {
    io.to(data.to).emit('call accepted', data.signal);
});

//ending a call
socket.on("end call", (id) => {
    io.to(id).emit("end call");
});
//delete message
socket.on("delete message", (msg) => {
    let conversaion = msg.conversation;
    if(!conversaion.users) return;
    conversaion.users.forEach((user) => {
        if(user._id === msg.sender_id) return;
        socket.in(user._id).emit("deletedMessage", msg);
    })
    console.log("deleted message -------->", msg);
});

//edit message
socket.on("edit message", (msg) => {
    let conversation = msg.conversation;
    if(!conversation.users) return;
    conversation.users.forEach((user) => {
        if(user._id === msg.sender_id) return;
        socket.in(user._id).emit("editMessage", msg);
    });
    console.log("editing message  -----", msg);
});

//send reaction
socket.on("send reaction", (msg) => {
    let conversation = msg.conversation;
    if(!conversation.users) return;
    conversation.users.forEach((user) => {
        if(user._id === msg.sender_id) return;
        socket.in(user._id).emit("receiveReaction", msg);
    })
    console.log("sending reaction --------------------> ", conversation);
})
}

