import "phaser";

import BrowserViewport from "../components/browser-viewport";

export default class InitialScene extends Phaser.Scene {
  constructor() {
    super("initial-scene");
  }

  preload() {
    this.load.image("logo", "assets/phaser3-logo.png");
    this.load.image("libs", "assets/libs.png");
    this.load.glsl("bundle", "assets/plasma-bundle.glsl.js");
    this.load.glsl("stars", "assets/starfields.glsl.js");
  }

  create() {
    this.add
      .shader(
        "RGB Shift Field",
        0,
        0,
        BrowserViewport.width,
        BrowserViewport.height
      )
      .setOrigin(0);
  }
}
