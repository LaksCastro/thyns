import PureComponent from "../components/pure-component";

import InitialScene from "./initial-scene";
import MainScene from "./main-scene";

export default class ThynsScenes extends PureComponent {
  static InitialScene: Function = InitialScene;
  static MainScene: Function = MainScene;
}
