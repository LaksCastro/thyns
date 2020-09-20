import ThynsGame from "./components/game";
import GameWebSocket from "./components/game-web-socket";

(async function () {
  try {
    await GameWebSocket.createConnection();

    GameWebSocket.startListeningServer();

    ThynsGame.init();
  } catch (e) {
    console.log(e);
  }
})();
