// Modules
const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

// Define const variables
const publicPath = path.join(__dirname, "/public");
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server)

io.on("connection", socket => {
    console.log("New user connected.")
});
io.on("disconnect", () => {
    console.log("user was disconnected.")
})
app.use(express.static(publicPath));

// Run project on server
server.listen(port, () => console.log(`app is started on port ${port}...`))


