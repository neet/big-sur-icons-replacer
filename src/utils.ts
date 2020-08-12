import fs from 'fs';

export const readAllInstalledApps = (path = '/Applications'): string[] => {
  return fs.readdirSync(path).filter(name => name.match(/\.app$/));
}

// BSIR stands for "Big Sur Icons Replacements"
export const normalizeBSIRFilename = (name: string) => {
  return name.replace(/\_/g, ' ', ).replace(/\.icns$/, '');
}


export const normalizeAppFilename = (name: string) => {
  return name.replace(/\.app$/, '');
}
