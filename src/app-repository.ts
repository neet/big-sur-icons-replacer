import fs from 'fs';
import path from 'path';

import { App } from './app';

export interface IAppRepository {
  find(appName: string): Promise<App | undefined>;
  fetchAll(): Promise<App[]>;
}

export class AppRepositoryImpl implements IAppRepository {
  private readonly baseDir = '/Applications';

  async find(appName: string): Promise<App | undefined> {
    const appFileName = this.convertAppNameToAppFileName(appName);
    const appPath = this.convertAppFileNameToPath(appFileName);
    const exists = fs.existsSync(appPath);
    if (!exists) return;
    return new App(appPath);
  }

  /** Fetch all apps in /Applications */
  async fetchAll(): Promise<App[]> {
    return fs.readdirSync(this.baseDir)
      .filter((iconFileName) => iconFileName.match(/\.app$/))
      .map((iconFileName) => this.convertAppFileNameToPath(iconFileName))
      .map((path) => new App(path));
  }

  /** Finder -> Finder.app */
  private convertAppNameToAppFileName(appName: string) {
    return appName + '.app';
  }

  private convertAppFileNameToPath(appFileName: string) {
    return path.join(this.baseDir, appFileName);
  }
}
