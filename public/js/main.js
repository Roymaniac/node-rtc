/* Getting the elements from the html file. */
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");


// Room and user detail
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});


const socket = io();



// When a user join Room
socket.emit("joinRoom", { username, room });



// Get rooms and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});



// Message from server
socket.on("message", (message) => {
  outputMessage(message);

  // Scroll to the bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
});



chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form text value
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input field
  e.target.elements.msg.value = " ";
  e.target.elements.msg.focus();
});



// DOM manipulation to output message
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = `${room}`;
}

function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
