export type MapConfig = {
  spawnPointKey: string;
  tilesetKey: string;
  tilemapKey: string;
  collisionProperty: object;
  objectsKey: string;
};

export type SceneConfig = {
  map: MapConfig;
  sceneKey: string;
};
