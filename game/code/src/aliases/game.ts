import { Vector } from "matter";

export type Player = {
  position: Vector;
  animation: string;
  animationIsPlaying: boolean;
  currentFrame: string;
  currentTexture: string;
  id: string;
};

export type GameState = {
  players: {
    [id: string]: Player;
  };
};
