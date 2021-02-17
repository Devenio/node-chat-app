// Modules
const path = require("path");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const generateMessage = require("./utils/message");

// Define const variables
const publicPath = path.join(__dirname, "/public");
const port = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("New user connected.");
    console.log(socket.id)
  socket.emit(
    "newMessage",
    generateMessage("Admin", "Welcome to this group")
  );

  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "new user join")
  );

  socket.on("createMessage", (message) => {
    console.log("createMessage: ", message);

    io.emit(
      "newMessage",
      generateMessage(message.from, message.text)
    );
  });
  io.on("disconnect", () => {
    console.log("user was disconnected.");
  });
});
app.use(express.static(publicPath));

// Run project on server
server.listen(port, () => console.log(`app is started on port ${port}...`));
