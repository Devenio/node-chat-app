const socket = io();

socket.on("connect", () => {
  console.log("Connected to server.");
});

socket.on("newMessage", (message) => {
  console.log(message);

    let li = $("<li></li>");
  li.text(`${message.from}: ${message.text}`);

  $("#messages").append(li);
});

$("#send-message").on("click", (event) => {
  event.preventDefault();
  
  socket.emit("createMessage", {
      from: "User",
    text: $("[name=message]").val(),
  });
});

socket.on("disconnect", () => {
  console.log("Disconnect from server.");
});