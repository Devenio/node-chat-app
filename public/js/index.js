let socket = io();

socket.on("connect", () => {
    console.log("Connected to server.");

    socket.emit("createMessage", {
        from: "nima",
        text: "hey it's work"
    });

    socket.on("newMessage", (data) => {
        console.log(data)
    });
});
socket.on("disconnect", () => {
    console.log("Disconnect from server.")
})