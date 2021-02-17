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

// Handle User Location
const locationsButton = $("#send-location");

locationsButton.on("click", () => {
  if (!navigator.geolocation)
    return alert("Geolocation not supported on this browser");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      socket.emit("createLocation", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (err) => console.log("Unable to get location", err)
  );
});

socket.on("newLocationMessage", (message) => {
  let li = $("<li></li>");
  let a = $("<a target='_blank'>see location</a>");

  a.attr("href", `${message.location_address}`)
  li.text(`${message.from} location: `).append(a);
  
  $("#messages").append(li);
});
