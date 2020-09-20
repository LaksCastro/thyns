import { Vector } from "matter";

export type Player = {
  position: Vector;
  animation: string;
  currentSprite: string;
  id: string;
  isViewer: boolean;
};

export type GameState = {
  players: Player[];
};
