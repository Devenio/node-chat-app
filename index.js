// Modules
const path = require("path");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// Define const variables
const publicPath = path.join(__dirname, "/public");
const port = process.env.PORT || 3000;

io.on("connection", socket => {
    console.log("New user connected.");

    socket.emit("newMessage", {
        from: "Admin",
        text: "Welcome to this group",
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit("newMessage", {
        from: "Admin",
        text: "new user join",
        createdAt: new Date().getTime()
    })

    socket.on("createMessage", (message) => {
        console.log("createMessage: ", message);

        socket.broadcast.emit("newMessage", {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })
    });
    io.on("disconnect", () => {
        console.log("user was disconnected.")
    });
});
app.use(express.static(publicPath));

// Run project on server
server.listen(port, () => console.log(`app is started on port ${port}...`))


