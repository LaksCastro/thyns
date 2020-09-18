import Game from "./components/game";

try {
  const game = new Game();

  game.init();
} catch (e) {
  console.log(e);
}
