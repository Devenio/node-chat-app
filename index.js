// Modules
const path = require("path");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { generateMessage, generateLocationMessage } = require("./utils/message");
const validation = require("./utils/validation");

// Define const variables
const publicPath = path.join(__dirname, "/public");
const port = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("New user connected.");
  
  socket.on("createLocation", (coords) => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
      );
    });

    // Handle user join
  socket.on("join", (params, callback) => {
    if(!validation(params.username) || !validation(params.room)) {
      callback("invalid username or room!");
      return;
    }
    socket.join(params.room)
    socket.emit("newMessage", generateMessage("Admin", "Welcome to this group"));
    socket.broadcast.to(params.room).emit(
      "newMessage",
      generateMessage("Admin", `${params.username} joined room`)
    );
    socket.on("createMessage", (message) => {
      console.log("createMessage: ", message);
  
      io.to(params.room).emit("newMessage", generateMessage(message.from, message.text));
    });

    callback()
  })

  // socket.on("createMessage", (message) => {
  //   console.log("createMessage: ", message);

  //   io.emit("newMessage", generateMessage(message.from, message.text));
  // });

  io.on("disconnect", () => {
    console.log("user was disconnected.");
  });
});
app.use(express.static(publicPath));

// Run project on server
server.listen(port, () => console.log(`app is started on port ${port}...`));
