import "phaser";
import { PhaserArcadeSprite, PhaserCursorKeys } from "../aliases/phaser";

export default class InitialScene extends Phaser.Scene {
  cursors: PhaserCursorKeys;
  player: PhaserArcadeSprite;
  showDebug = false;

  constructor() {
    super("initial-scene");
  }

  preload() {}

  create() {}

  update() {}
}
