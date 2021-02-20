// Modules
const path = require("path");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { generateMessage, generateLocationMessage } = require("./utils/message");
const validation = require("./utils/validation");
const Users = require("./utils/users");

// Define const variables
const publicPath = path.join(__dirname, "/public");
const port = process.env.PORT || 3000;
const users = new Users();

io.on("connection", (socket) => {
  console.log("New user connected.");
  
  socket.on("createLocation", (coords) => {
    io.to(users.getUser(socket.id).room).emit(
      "newLocationMessage",
      generateLocationMessage(users.getUser(socket.id).username, coords.latitude, coords.longitude)
      );
    });

    // Handle user join
  socket.on("join", (params, callback) => {
    if(!validation(params.username) || !validation(params.room)) {
      callback("invalid username or room!");
      return;
    }
    socket.join(params.room);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.username, params.room);

    io.to(params.room).emit("updateUsersList", users.getUsersList(params.room));
    socket.emit("newMessage", generateMessage("Admin", "Welcome to this group"));
    socket.broadcast.to(params.room).emit(
      "newMessage",
      generateMessage("Admin", `${params.username} joined room`)
    );

    // Handle Messages
    socket.on("createMessage", (message) => {
      console.log("createMessage: ", message);
  
      io.to(params.room).emit("newMessage", generateMessage(users.getUser(message.from).username, message.text));
    });

    callback()
  })

  socket.on("disconnect", () => {
    console.log("disconnected")
    let user = users.removeUser(socket.id);
    if(user) {
      io.to(user.room).emit("updateUsersList", users.getUsersList(user.room));
      io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.username} has left the room`))
    }
  });
});
app.use(express.static(publicPath));

// Run project on server
server.listen(port, () => console.log(`app is started on port ${port}...`));
