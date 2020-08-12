import path from 'path';

export class Icon {
  constructor(
    /** Absolute path for the icon */
    readonly path: string,
  ) {}

  get fileName() {
    return path.basename(this.path);
  }

  get appName() {
    return this.fileName.replace(/\_/g, ' ', ).replace(/\.icns$/, '');
  }
}
