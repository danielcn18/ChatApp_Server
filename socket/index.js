const initSocket =  (server, corsOptions) => {
    const io = require("socket.io")(server, { cors: corsOptions });
    let users = [];

    const addUser = (userId, socketId) => {
        !users.some((user) => user.userId === userId) && 
            users.push({ userId, socketId });
    };
    
    const removeUser = (socketId) => {
        users = users.filter((user) => user.socketId !== socketId);
    }

    const getUser = (userId) => {
        return users.find((user) => user.userId === userId);
    }

    io.on("connection", (socket) => {
        // take userId and socketId from user
        socket.on("addUser", (userId) => {
            addUser(userId, socket.id);
        });

        socket.on("sendMessage", ({ sender, receivers, message }) => {
            receivers.forEach((receiverId) => {
                let user = getUser(receiverId);
                if (user) {
                    // if the other users are online send them the new message
                    io.to(user.socketId).emit("getNewMessage", {
                        sender, 
                        message,
                    });
                }
            });
        });

        // when disconnect
        socket.on("disconnect", () => {
            removeUser(socket.id);
        });
    });
}

module.exports = initSocket;