import "phaser";

import { PhaserConfig } from "../aliases/phaser";

import InitialScene from "../scenes/initial-scene";
import PureComponent from "./pure-component";

export default class ThynsGame extends PureComponent {
  private game: Phaser.Game;

  init(): void {
    const config: PhaserConfig = {
      type: Phaser.AUTO,
      backgroundColor: "#fff9f9",
      width: window.innerWidth,
      height: window.innerHeight,
      scene: InitialScene,
    };

    this.game = new Phaser.Game(config);
  }

  getGame(): Phaser.Game {
    return this.game;
  }
}
