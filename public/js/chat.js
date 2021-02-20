const socket = io();

function autoScroll() {
  const messages = $("#messages");
  const newMessage = messages.children("li:last-child");

  const clientHeight = messages.prop("clientHeight");
  const scrollTop = messages.prop("scrollTop");
  const scrollHeight = messages.prop("scrollHeight");

  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    $(".messages-box").scrollTop(scrollHeight);
  }
}

// Handle connection and disconnection
socket.on("connect", () => {
  console.log("Connected to server.");

  let params = jQuery.deparam(window.location.search); // username and room

  socket.emit("join", params, (err) => {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("no error");
    }
  });
});
socket.on("disconnect", () => {
  console.log("Disconnect from server.");
});

// Handle users list
socket.on("updateUsersList", (users) => {
  $(".chat__users").text('')
  users.forEach((username) => {
    $(".chat__users").append($("<li class='chat__user-list'></li>").text(`User ${users.indexOf(username)+1}: ${username}`));
  });
});

// Get message from server
socket.on("newMessage", (message) => {
  const formatTime = moment(message.createdAt).format("hh:mm:ss a");

  const template = $("#message-template").html();
  const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formatTime,
  });

  $("#messages").append(html);
  autoScroll();
});

// Sending message to server
$("#send-message").on("click", (event) => {
  event.preventDefault();

  socket.emit("createMessage", {
    from: socket.id,
    text: $("[name=message]").val(),
  });

  $("[name=message]").val("");
});

// Handle User Location
const locationsButton = $("#send-location");

locationsButton.on("click", () => {
  if (!navigator.geolocation)
    return alert("Geolocation not supported on this browser");

  locationsButton.attr("disabled", "true").text("Sending Location...");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      socket.emit("createLocation", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      locationsButton.removeAttr("disabled").text("Send Location");
    },
    (err) => {
      console.log("Unable to get location", err);
      locationsButton.removeAttr("disabled").text("Send Location");
    }
  );
});

socket.on("newLocationMessage", (message) => {
  const formatTime = moment(message.createdAt).format("hh:mm:ss a");

  const template = $("#location-template").html();
  const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formatTime,
  });

  $("#messages").append(html);
  autoScroll();
});
