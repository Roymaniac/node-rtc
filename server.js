const path = require("path");
const http = require("http");
const express = require("express");
require("dotenv").config(); // env variable

const socketio = require("socket.io");
const formatMessage = require("./utils/messages"); // message util

const {
  userJoin,
  getCurrentUser,
  userExit,
  getRoomUser,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//  Static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when user connects
io.on("connection", (socket) => {
  console.log("Connected..");

  
  // Get the joined user details
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

  
    //  Welcome current user to the group
    socket.emit(
      "message",
      formatMessage(process.env.BOTNAME, "Welcome to ChatCord")
    );


    // Broadcast to specific room and alert to all user except user who connected
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(
          process.env.BOTNAME,
          `${user.username} has joined the group`
        )
      );


    // Send users and room info to frontend
    io.to(user.room).emit("roomUser", {
      room: user.room,
      users: getCurrentUser(user.room),
    });
  });


   //  Listen to chatMessage
   socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(`${user.username}`, msg));
  });
 
  
  //  Run when user disconnect
  socket.on("disconnect", () => {
    const user = userExit(socket.id);

    if (user) {
      // notify everyone on the group chat including the current user
      io.to(user.room).emit(
        "message",
        formatMessage(process.env.BOTNAME, `${user.username} left the group`)
      );

      // Send users and room info to frontend
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getCurrentUser(user.room),
      });
    }
  });

 
});

const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
