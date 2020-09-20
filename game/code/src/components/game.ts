import "phaser";

import { PhaserConfig } from "../aliases/phaser";

import ThynsScenes from "../scenes/index";
import BrowserViewport from "./browser-viewport";
import PureComponent from "./pure-component";

export default class ThynsGame extends PureComponent {
  private static game: Phaser.Game;

  static init(): void {
    const config: PhaserConfig = {
      type: Phaser.AUTO,
      backgroundColor: "#25131A",
      width: BrowserViewport.width,
      height: BrowserViewport.height,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
        },
      },
      scene: ThynsScenes.MainScene,
    };

    this.game = new Phaser.Game(config);
  }

  static getGame(): Phaser.Game {
    return this.game;
  }
}
