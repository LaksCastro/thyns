import { GameState, Player } from "../aliases/game";
import { Listener, ListenerHashMap } from "../aliases/utils";

import GameEvents from "./game-events";
import PureComponent from "./pure-component";

export default class GameWebSocket extends PureComponent {
  static socket: SocketIOClient.Socket;
  static listeners: ListenerHashMap<GameState> = {};
  private static currentState: GameState;

  static async createConnection(): Promise<void> {
    GameWebSocket.socket = io("https://thyns.lakscastro.repl.co");

    return new Promise(function (resolve) {
      GameWebSocket.socket.on("connect", () => {
        GameWebSocket.socket.on("INIT_STATE", (initialState: GameState) => {
          GameWebSocket.currentState = initialState;
          resolve();
        });
      });
    });
  }

  static startListeningServer(): void {
    GameWebSocket.socket.on(GameEvents.STATE_CHANGED, (newState: GameState) => {
      GameWebSocket.currentState = newState;

      Object.keys(GameWebSocket.listeners).forEach((key) => {
        GameWebSocket.listeners[key](GameWebSocket.currentState);
      });
    });
  }

  static emitNewState(playerId: string, newState: Player): void {
    GameWebSocket.socket.emit(GameEvents.STATE_CHANGED, playerId, newState);
  }

  static registerPlayer(id: string): void {
    GameWebSocket.socket.emit(GameEvents.REGISTER_PLAYER, id);
  }

  static getCurrentState(): GameState {
    return GameWebSocket.currentState;
  }

  static addStateListener(key: string, listener: Listener<GameState>): void {
    GameWebSocket.listeners[key] = listener;
  }

  static removeStateListener(key: string): void {
    delete GameWebSocket.listeners[key];
  }
}
