const { Server } = require("socket.io");

let io;
const initSocket = (server) => {
  io = new Server(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

const getSocket = () => io;

module.exports = { initSocket, getSocket };
