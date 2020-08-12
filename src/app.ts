import path from 'path';

import { exec } from './exec';

export class App {
  constructor (
    /** Absolute path for the app e.g. /Applications/Finder.app */
    readonly path: string,
  ) {}

  /** Original App name e.g. Finder.app */
  get fileName() {
    return path.basename(this.path);
  }

  /** Normalized App name e.g. Finder */
  get appName() {
    return this.path.replace(/\.app$/, '');
  }

  async setIcon(iconPath: string): Promise<void> {
    await exec(`yarn run fileicon set "${this.path}" "${iconPath}"`);
  }

  async removeIcon(): Promise<void> {
    await exec(`yarn run fileicon rm "${this.path}"`);
  }
}
