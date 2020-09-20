const app = require("express")();

const server = require("http").createServer(app);

const io = require("socket.io")(server);

const PORT = process.env.PORT || 3000;

io.on("connection", function (socket) {
  console.log("Conexão estabelecida");
  console.log(socket);
});

server.listen(PORT);
