// src/config/socket.js
let ioInstance = null;

function initSocket(server) {
  const { Server } = require("socket.io");

  ioInstance = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log("[SOCKET] Cliente conectado:", socket.id);

    socket.on("disconnect", () => {
      console.log("[SOCKET] Cliente desconectado:", socket.id);
    });
  });

  return ioInstance;
}

function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.IO não foi inicializado ainda.");
  }
  return ioInstance;
}

module.exports = { initSocket, getIO };
