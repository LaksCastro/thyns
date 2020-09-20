import { GameState } from "../aliases/game";
import { Listener } from "../aliases/utils";

import GameEvents from "./game-events";
import PureComponent from "./pure-component";

export default class GameWebSocket extends PureComponent {
  static socket: SocketIOClient.Socket;
  static listeners: Listener<GameState>[] = [];

  static async createConnection(): Promise<void> {
    GameWebSocket.socket = io("http://localhost:3000");

    return new Promise(function (resolve) {
      GameWebSocket.socket.on("connect", resolve);
    });
  }

  static startListeningServer(): void {
    GameWebSocket.socket.on(GameEvents.STATE_CHANGED, (newState: GameState) => {
      GameWebSocket.listeners.forEach((listener) =>
        listener.callback(newState)
      );
    });
  }

  static emitNewState(newState: GameState): void {
    GameWebSocket.socket.emit(GameEvents.STATE_CHANGED, newState);
  }

  static addStateListener(listener: Listener<GameState>): void {
    GameWebSocket.listeners.push(listener);
  }

  static removeStateListener(key: string): void {
    GameWebSocket.listeners = this.listeners.filter(
      (listener) => listener.key !== key
    );
  }
}
