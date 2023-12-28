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
    })
});

//typing
socket.on('typing', (conversation) => {
    socket.in(conversation).emit('typing', conversation);
})
socket.on('stop typing', (conversation) => {
    socket.in(conversation).emit("stop typing");
});

}