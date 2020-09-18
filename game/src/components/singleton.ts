import PureComponent from "./pure-component";

export default class Singleton extends PureComponent {
  private static registeredSingletons: object = {};

  static setInstance<T>(key: string, singleton: T): void {
    this.registeredSingletons[key] = singleton;
  }

  static getInstance<T>(key: string): T {
    return this.registeredSingletons[key] as T;
  }
}
