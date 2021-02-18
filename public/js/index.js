const socket = io();

// Handle connection and disconnection
socket.on("connect", () => {
  console.log("Connected to server.");
});
socket.on("disconnect", () => {
  console.log("Disconnect from server.");
});

// Get message from server
socket.on("newMessage", (message) => {
  console.log(message);

  let li = $("<li></li>");
  li.text(`${message.from}: ${message.text}`);

  $("#messages").append(li);
});

// Sending message to server
$("#send-message").on("click", (event) => {
  event.preventDefault();

  socket.emit("createMessage", {
    from: "User",
    text: $("[name=message]").val(),
  });

  $("[name=message]").val("");
});

// Handle User Location
const locationsButton = $("#send-location");

locationsButton.on("click", () => {
  if (!navigator.geolocation)
    return alert("Geolocation not supported on this browser");

  locationsButton.attr("disabled", "true").text("Sending Location...")

  navigator.geolocation.getCurrentPosition(
    (position) => {
      socket.emit("createLocation", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      locationsButton.removeAttr("disabled").text("Send Location")
    },
    (err) => {
      console.log("Unable to get location", err);
      locationsButton.removeAttr("disabled").text("Send Location")
    }
  );
});

socket.on("newLocationMessage", (message) => {
  let li = $("<li></li>");
  let a = $("<a target='_blank'>see location</a>");

  a.attr("href", `${message.location_address}`);
  li.text(`${message.from} location: `).append(a);

  $("#messages").append(li);
});
