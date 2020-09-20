import { Vector } from "matter";
import "phaser";
import { GameState, Player } from "../aliases/game";
import {
  PhaserArcadeSprite,
  PhaserCursorKeys,
  PhaserTilemap,
} from "../aliases/phaser";
import { SceneConfig } from "../aliases/scene";
import Config from "../components/config";
import GameWebSocket from "../components/game-web-socket";
import Utils from "../utils/utils";

import debounce from "lodash.debounce";

type RenderedPlayersHashMap = {
  [id: string]: PhaserArcadeSprite;
};

export default class MainScene extends Phaser.Scene {
  cursors: PhaserCursorKeys;

  player: PhaserArcadeSprite;
  renderedPlayers: RenderedPlayersHashMap = {};

  showDebug = false;

  viewerPlayerId = Utils.randomId();

  gameState: GameState;

  sceneConfig: SceneConfig = {
    map: {
      spawnPointKey: "spawn-point",
      tilemapKey: "main-map",
      tilesetKey: "dungeon-tileset",
      objectsKey: "objects",
      collisionProperty: { collides: true },
    },
    sceneKey: "main-scene",
  };

  constructor() {
    super("main-scene");
  }

  stateListener(newState: GameState): void {
    Object.keys(this.renderedPlayers)
      .filter((player) => {
        return !Object.keys(newState.players).includes(player);
      })
      .forEach((disconnectedId) => this.removePlayer(disconnectedId));

    Object.keys(newState.players).forEach((playerId) => {
      if (playerId === this.viewerPlayerId) {
        return;
      }

      const newPlayerData = newState.players[playerId];
      const renderedPlayerData = this.renderedPlayers[playerId];

      // The player was rendered but changed the state
      if (renderedPlayerData !== undefined) {
        this.renderedPlayers[playerId].setPosition(
          newPlayerData.position.x,
          newPlayerData.position.y
        );

        if (newPlayerData.animationIsPlaying) {
          this.renderedPlayers[playerId].anims.play(
            newPlayerData.animation,
            true
          );
        } else {
          this.renderedPlayers[playerId].anims.stop();

          this.renderedPlayers[playerId].setTexture(
            newPlayerData.currentTexture,
            newPlayerData.currentFrame
          );
        }

        return;
      }

      // A new player, then render this and add to rendered players
      const newPlayerSprite = this.renderPlayer(
        newPlayerData.position.x,
        newPlayerData.position.y
      );

      this.registerNewPlayer(playerId, newPlayerSprite);
    });
  }

  registerNewPlayer(id: string, data: PhaserArcadeSprite): void {
    if (this.renderedPlayers[id] !== undefined) {
      console.warn("Tried to register a existent player!");
      return;
    }

    this.renderedPlayers[id] = data;
  }

  removePlayer(id: string): void {
    if (this.renderedPlayers[id] === undefined) {
      console.warn("Tried to remove a no rendered-player!");
      return;
    }

    this.renderedPlayers[id].destroy();

    delete this.renderedPlayers[id];
  }

  renderViewerPlayer(): void {
    const map = this.add.tilemap("map");

    const tileset = map.addTilesetImage(
      this.sceneConfig.map.tilesetKey,
      "tiles"
    );

    const decorationLayer = map.createStaticLayer("decoration", tileset, 0, 0);
    const floorLayer = map.createStaticLayer("floor", tileset, 0, 0);
    const belowLayer = map.createStaticLayer("below-player", tileset, 0, 0);
    const aboveLayer = map.createStaticLayer("above-player", tileset, 0, 0);

    belowLayer.setCollisionByProperty(this.sceneConfig.map.collisionProperty);

    aboveLayer.setDepth(10);
    decorationLayer.setDepth(15);

    const spawnPoint = this.getSpawnPoint(map);

    this.player = this.renderPlayer(spawnPoint.x, spawnPoint.y);

    this.physics.add.collider(this.player, belowLayer);

    const camera = this.cameras.main;

    camera.startFollow(this.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.cursors = this.input.keyboard.createCursorKeys();

    // Help text that has a "fixed" position on the screen
    // this.add
    //   .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
    //     font: "18px monospace",
    //     fill: "#000000",
    //     padding: { x: 20, y: 10 },
    //     backgroundColor: "#ffffff",
    //   })
    //   .setScrollFactor(0)
    //   .setDepth(30);
  }

  renderPlayer(x: number, y: number): PhaserArcadeSprite {
    return this.physics.add
      .sprite(x, y, "atlas", "misa-front")
      .setSize(30, 40)
      .setOffset(0, 24);
  }

  definePlayerSpriteAnimations(): void {
    this.anims.create({
      key: "misa-left-walk",
      frames: this.anims.generateFrameNames("atlas", {
        prefix: "misa-left-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "misa-right-walk",
      frames: this.anims.generateFrameNames("atlas", {
        prefix: "misa-right-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "misa-front-walk",
      frames: this.anims.generateFrameNames("atlas", {
        prefix: "misa-front-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "misa-back-walk",
      frames: this.anims.generateFrameNames("atlas", {
        prefix: "misa-back-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  getSpawnPoint(map: PhaserTilemap): PhaserArcadeSprite {
    return map.findObject(
      this.sceneConfig.map.objectsKey,
      (obj) => obj.name === this.sceneConfig.map.spawnPointKey
    ) as PhaserArcadeSprite;
  }

  preload(): void {
    this.load.image(
      "tiles",
      Config.TILESET_PATH + this.sceneConfig.map.tilesetKey + ".png"
    );

    this.load.tilemapTiledJSON(
      "map",
      Config.TILEMAP_PATH + this.sceneConfig.map.tilemapKey + ".json"
    );

    this.load.atlas(
      "atlas",
      "assets/atlas/atlas.png",
      "assets/atlas/atlas.json"
    );
  }

  create(): void {
    GameWebSocket.addStateListener(
      this.viewerPlayerId,
      this.stateListener.bind(this)
    );

    GameWebSocket.registerPlayer(this.viewerPlayerId);

    this.gameState = GameWebSocket.getCurrentState();

    this.definePlayerSpriteAnimations();

    this.renderViewerPlayer();
  }

  update(): void {
    GameWebSocket.emitNewState(this.viewerPlayerId, {
      animation: this.player.anims.currentAnim?.key,
      currentTexture: this.player.texture.key,
      currentFrame: this.player.frame.name,
      id: this.viewerPlayerId,
      animationIsPlaying: this.player.anims.isPlaying,
      position: {
        x: this.player.x,
        y: this.player.y,
      },
    });

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
