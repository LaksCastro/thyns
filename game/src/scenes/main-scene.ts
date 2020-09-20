import "phaser";
import { PhaserArcadeSprite, PhaserCursorKeys } from "../aliases/phaser";

export default class MainScene extends Phaser.Scene {
  cursors: PhaserCursorKeys;
  player: PhaserArcadeSprite;
  showDebug = false;

  constructor() {
    super("initial-scene");
  }

  preload() {
    this.load.image("tiles", "assets/tilesets/dungeon-tileset.png");
    this.load.tilemapTiledJSON("map", "assets/tilemaps/main-map.json");
    this.load.atlas(
      "atlas",
      "assets/atlas/atlas.png",
      "assets/atlas/atlas.json"
    );
  }

  create() {
    const map = this.add.tilemap("map");

    const tileset = map.addTilesetImage("dungeon-tileset", "tiles");

    const decorationLayer = map.createStaticLayer("decoration", tileset, 0, 0);
    const floorLayer = map.createStaticLayer("floor", tileset, 0, 0);
    const wallsLayer = map.createStaticLayer("walls", tileset, 0, 0);

    wallsLayer.setCollisionByProperty({ collides: true });

    wallsLayer.setDepth(10);
    decorationLayer.setDepth(15);

    const spawnPoint = map.findObject(
      "objects",
      (obj) => obj.name === "spawn-point"
    ) as PhaserArcadeSprite;

    // Create a sprite with physics enabled via the physics system. The image used for the sprite has
    // a bit of whitespace, so I'm using setSize & setOffset to control the size of the this.player's body.
    this.player = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
      .setSize(30, 25)
      .setOffset(0, 24);

    // Watch the this.player and bushLayer for collisions, for the duration of the scene:
    this.physics.add.collider(this.player, wallsLayer);

    // Create the this.player's walking animations from the texture atlas. These are stored in the global
    // animation manager so any sprite can access them.
    const anims = this.anims;

    anims.create({
      key: "misa-left-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "misa-left-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "misa-right-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "misa-right-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "misa-front-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "misa-front-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "misa-back-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "misa-back-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.cursors = this.input.keyboard.createCursorKeys();

    // Help text that has a "fixed" position on the screen
    this.add
      .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff",
      })
      .setScrollFactor(0)
      .setDepth(30);

    // Debug graphics
    this.input.keyboard.once("keydown_D", () => {
      // Turn on physics debugging to show this.player's hitbox
      this.physics.world.createDebugGraphic();

      // Create bushLayer collision graphic above the this.player, but below the help text
      const graphics = this.add.graphics().setAlpha(0.75).setDepth(20);

      wallsLayer.renderDebug(graphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
      });
    });
  }

  update() {
    const normalSpeed = 150;
    const runSpeed = 500;

    const prevVelocity = this.player.body.velocity.clone();

    const speed = this.cursors.shift.isDown ? runSpeed : normalSpeed;

    // Stop any previous movement from the last frame
    this.player.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that this.player can't move faster along a diagonal
    this.player.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (this.cursors.left.isDown) {
      this.player.anims.play("misa-left-walk", true);
    } else if (this.cursors.right.isDown) {
      this.player.anims.play("misa-right-walk", true);
    } else if (this.cursors.up.isDown) {
      this.player.anims.play("misa-back-walk", true);
    } else if (this.cursors.down.isDown) {
      this.player.anims.play("misa-front-walk", true);
    } else {
      this.player.anims.stop();

      // If we were moving, pick and idle frame to use
      if (prevVelocity.x < 0) this.player.setTexture("atlas", "misa-left");
      else if (prevVelocity.x > 0)
        this.player.setTexture("atlas", "misa-right");
      else if (prevVelocity.y < 0) this.player.setTexture("atlas", "misa-back");
      else if (prevVelocity.y > 0)
        this.player.setTexture("atlas", "misa-front");
    }
  }
}
