#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { Presets, SingleBar } from 'cli-progress';
import yargs from "yargs";
import chalk from "chalk";
import { exec } from "child_process";
import {
  readAllInstalledApps,
  normalizeAppFilename,
  normalizeBSIRFilename,
} from "./utils";

interface BSIRIcon {
  filename: string;
  path: string;
  appName: string;
}

yargs
  .command(
    "replace-all",
    "Replace icons of all existing apps",
    (builder) =>
      builder.option("dir", {
        description: "Directory for macOS_Big_Sur_icons_replacements",
        type: "string",
        required: true,
      }),
    async ({ dir }) => {
      const apps = readAllInstalledApps().map((app) =>
        normalizeAppFilename(app)
      );

      const iconsDir =path.resolve(dir, "icons");
      const replacements: BSIRIcon[] = fs
        .readdirSync(iconsDir)
        .map((filename) => ({
          filename,
          path: path.join(iconsDir, filename),
          appName: normalizeBSIRFilename(filename),
        }));


      const supportedApps = replacements.map((bsir) => bsir.appName);
      const replacableApps = apps.filter((app) => supportedApps.includes(app));
      const singleBar = new SingleBar(
        { clearOnComplete: true,  },
        Presets.shades_classic,
      );
      singleBar.start(replacableApps.length, 0);

      let i = 0;

      for (const app of replacableApps) {
        const bsir = replacements.find(
          (replacement) => replacement.appName === app
        );
        if (bsir == null) continue;

        try {
          await new Promise((resolve, reject) => {
            const appPath = path.join('/Applications', app + '.app');
            exec(`yarn run fileicon set "${appPath}" ${bsir.path}`, (error) => {
              if (error != null) reject(error);
              resolve();
            });
          });
        } catch(error) {
          console.error(error)
        }

        singleBar.update(i++);
      }

      singleBar.stop();
      console.log('Successfully set icons');
      process.exit(0);
    }
  )
  .command(
    "replace",
    "Replace single icon",
    (builder) =>
      builder
        .option("app", {
          description: "Name of the app",
          type: "string",
          required: true,
        })
        .option("dir", {
          description: "Directory for macOS_Big_Sur_icons_replacements",
          type: "string",
          required: true,
        }),
    async ({ app, dir }) => {
      const iconsDir = path.resolve(dir, "icons");
      const replacement= fs
        .readdirSync(iconsDir)
        .map((filename): BSIRIcon => ({
          filename,
          path: path.join(iconsDir, filename),
          appName: normalizeBSIRFilename(filename),
        }))
        .find((bsir) => bsir.appName === app);
      
      console.log(replacement);
      if (replacement == null) return;

      exec(`yarn run fileicon set ${path.join('/Applications', app + ".app")} ${replacement.path}`);
    }
  )
  .command(
    "revert",
    "Revert single icon",
    (builder) =>
      builder.option("app", {
        description: "Name of the app",
        type: "string",
        required: true,
      }),
    async ({ app }) => {
      const appPath = path.join("/Applications", app + ".app");
      console.log(`Removing icon override for ${appPath}`)
      exec(`yarn run fileicon rm ${appPath}`);
    }
  )
  .command('revert-all', 'Revert all icons', {}, async() => {
      const apps = fs.readdirSync('/Applications').filter(name => name.match(/\.app$/));
      const singleBar = new SingleBar(
        { clearOnComplete: true,  },
        Presets.shades_classic,
      )

      singleBar.start(apps.length, 0);

      let i = 0;

      for (const app of apps) {
        const appPath = path.join('/Applications', app);

        try {
          await new Promise((resolve, reject) => {
            exec(`yarn run fileicon rm "${appPath}"`, (error) => {
              if (error != null) reject(error);
              resolve();
            });
          });
        } catch (error) {
          console.error(error);
        }

        singleBar.update(i++);
      }

      singleBar.stop();
      console.log('Successfully removed icons');
      process.exit(0);
  }).argv;
