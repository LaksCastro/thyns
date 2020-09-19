import "phaser";

import { PhaserConfig } from "../aliases/phaser";

import InitialScene from "../scenes/initial-scene";
import BrowserViewport from "./browser-viewport";
import PureComponent from "./pure-component";

export default class ThynsGame extends PureComponent {
  private static game: Phaser.Game;

  static init(): void {
    const config: PhaserConfig = {
      type: Phaser.AUTO,
      backgroundColor: "#fff9f9",
      width: BrowserViewport.width,
      height: BrowserViewport.height,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
        },
      },
      scene: InitialScene,
    };

    this.game = new Phaser.Game(config);
  }

  static getGame(): Phaser.Game {
    return this.game;
  }
}
