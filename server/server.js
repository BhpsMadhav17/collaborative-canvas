const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

// Serve static client files
app.use(express.static(path.join(__dirname, "..", "client")));

// In-memory list of connected users + colors
const colors = ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231", "#911eb4"];
const userColors = {};
let strokeHistory = []; // Global stroke history for undo/redo

io.on("connection", socket => {
  console.log("User connected:", socket.id);

  // assign color to user
  userColors[socket.id] = colors[Math.floor(Math.random() * colors.length)];

  // send new user their color + updated user list to everyone
  socket.emit("assignColor", userColors[socket.id]);
  io.emit("updateUserList", userColors);

  // ---- Real-time drawing ----
  socket.on("draw", data => {
    socket.broadcast.emit("draw", data);
  });

  // ---- Real-time cursor tracking ----
  socket.on("cursor", data => {
    data.id = socket.id;
    socket.broadcast.emit("cursor", data);
  });

  // ---- Store completed strokes ----
  socket.on("strokeComplete", stroke => {
    stroke.id = Date.now(); // unique ID
    strokeHistory.push(stroke);
    socket.broadcast.emit("strokeComplete", stroke);
  });

  // ---- Global Undo (conflict-safe) ----
  socket.on("undo", () => {
    if (strokeHistory.length > 0) {
      const removed = strokeHistory.pop();
      io.emit("undo", removed.id);
    }
  });

  // ---- Global Clear Canvas ----
  socket.on("clearCanvas", () => {
    strokeHistory = [];
    io.emit("clearCanvas");
  });

  // ---- Handle user disconnect ----
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userColors[socket.id];
    io.emit("updateUserList", userColors);
    io.emit("userLeft", socket.id);
  });
});

// Fallback for any route → index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
