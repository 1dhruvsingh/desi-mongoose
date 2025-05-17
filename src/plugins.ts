import { DesiError } from './errors';
export class DesiPlugin {
  static plugins: Map<string, Function> = new Map();

  static lagao(name: string, fn: Function) {
    this.plugins.set(name, fn);
  }

  static chalao(name: string, ...args: any[]) {
    const plugin = this.plugins.get(name);
    if (plugin) {
      return plugin(...args);
    }
    throw new DesiError(`Plugin '${name}' nahi mila!`);
  }
}