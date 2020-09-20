const app = require("express")();

const server = require("http").createServer(app);

const io = require("socket.io")(server);

const PORT = process.env.PORT || 3000;

let gameState = {
  players: {},
};

let allClients = [];

let linkedPlayers = {};

io.on("connection", function (socket) {
  allClients.push(socket);

  socket.emit("INIT_STATE", gameState);

  socket.once("REGISTER_PLAYER", (id) => {
    linkedPlayers[socket.id] = id;
  });

  socket.on("STATE_CHANGED", (playerId, state) => {
    gameState = {
      ...gameState,
      players: {
        ...gameState.players,
        [playerId]: state,
      },
    };

    socket.broadcast.emit("STATE_CHANGED", gameState);
  });

  socket.on("disconnect", function () {
    const i = allClients.indexOf(socket);

    const disconnectedSocket = allClients[i];

    const disconnectedPlayerId = linkedPlayers[disconnectedSocket.id];

    delete gameState.players[disconnectedPlayerId];

    allClients.splice(i, 1);

    socket.broadcast.emit("STATE_CHANGED", gameState);
  });
});

app.use("/", (_, res) => res.json({ ok: true }));

server.listen(PORT);
