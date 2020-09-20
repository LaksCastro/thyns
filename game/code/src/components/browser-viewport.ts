import PureComponent from "./pure-component";

export default class BrowserViewport extends PureComponent {
  static get width(): number {
    return window.innerWidth;
  }

  static get height(): number {
    return window.innerHeight;
  }
}
