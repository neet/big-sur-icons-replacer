import fs from 'fs';
import path from 'path';

import { Icon } from "./icon";

export interface IIconRepository {
  find(appName: string): Promise<Icon | undefined>;
  fetchAll(): Promise<Icon[]>;
}

export class IconRepositoryImpl implements IIconRepository {
  constructor(
    /** Base directory of macOS_Big_Sur_icons_replacements/icons */
    private readonly baseDir: string,
  ) {}

  async find(appName: string): Promise<Icon | undefined> {
    const iconFileName = this.convertAppNameToIconFileName(appName);
    const iconPath = this.covertIconFileNameToPath(iconFileName)
    const exists = fs.existsSync(iconPath);
    if (!exists) return;
    return new Icon(iconPath);
  }

  async fetchAll(): Promise<Icon[]> {
    return fs.readdirSync(this.baseDir)
      .filter((iconFileName) => iconFileName.match(/\.icns$/))
      .map((iconFileName) => this.covertIconFileNameToPath(iconFileName))
      .map((path) => new Icon(path));
  }

  /** Google Chrome -> Google_Chrome.icns */
  private convertAppNameToIconFileName(appName: string) {
    return appName.replace(/\s/g, '_') + '.icns';
  }

  /** Make filename absolute */
  private covertIconFileNameToPath(iconFileName: string) {
    return path.join(this.baseDir, iconFileName);
  }
}
