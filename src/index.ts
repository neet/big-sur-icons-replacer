#!/usr/bin/env node
import path from "path";
import { Presets, SingleBar } from "cli-progress";
import yargs from "yargs";
import chalk from "chalk";

import { IconRepositoryImpl, IIconRepository } from "./icon-repository";
import { AppRepositoryImpl, IAppRepository } from "./app-repository";

yargs
  .command(
    "replace-all",
    "Replace icons of all existing apps",
    (builder) =>
      builder.option("dir", {
        description: "Directory for macOS_Big_Sur_icons_replacements",
        type: "string",
        required: true,
        alias: "d",
      }),
    async ({ dir }) => {
      const appRepository: IAppRepository = new AppRepositoryImpl();
      const iconRepository: IIconRepository = new IconRepositoryImpl(path.resolve(dir));

      const apps = await appRepository.fetchAll();
      const icons = await iconRepository.fetchAll();

      const replacableApps = apps.filter((app) => {
        return icons.map((icon) => icon.appName).includes(app.appName);
      })

      const singleBar = new SingleBar(
        { clearOnComplete: true },
        Presets.shades_classic
      );
      singleBar.start(replacableApps.length, 0);

      let i = 0;

      for (const app of replacableApps) {
        const icon = await iconRepository.find(app.appName);
        if (icon == null) continue;

        try {
          await app.setIcon(icon.path);
        } catch(error) {
          console.warn(error);
        }
        singleBar.update(i++);
      }

      singleBar.stop();
      console.log(chalk.green(`Successfully set ${replacableApps.length} icons`));
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
          alias: "d",
        }),
    async ({ app: appName, dir }) => {
      const appRepository: IAppRepository = new AppRepositoryImpl();
      const iconRepository: IIconRepository = new IconRepositoryImpl(path.resolve(dir)) 

      const app = await appRepository.find(appName);
      if (app == null) {
        console.error(chalk.red(`No App for ${appName} found`));
        return;
      }

      const icon = await iconRepository.find(appName);
      if (icon == null) {
        console.error(chalk.red(`No Icon for ${appName} found`));
        return;
      }

      app.setIcon(icon.path);
      console.log(chalk.green(`Successfully set icon for ${appName}`));
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
    async ({ app: appName }) => {
      const appRepository: IAppRepository = new AppRepositoryImpl();
      const app = await appRepository.find(appName);

      if (app == null) {
        console.error(chalk.red(`No Icon for ${appName} found`));
        return;
      }

      await app.removeIcon();
      console.log(chalk.green(`Successfully removed icon for ${appName}`));
    }
  )
  .command("revert-all", "Revert all icons", {}, async () => {
    const appRepository: IAppRepository = new AppRepositoryImpl();
    const apps = await appRepository.fetchAll();

    const singleBar = new SingleBar(
      { clearOnComplete: true },
      Presets.shades_classic
    );

    singleBar.start(apps.length, 0);

    let i = 0;

    for (const app of apps) {
      try {
        await app.removeIcon();
      } catch(error) {
        console.warn(error);
      }
      singleBar.update(i++);
    }

    singleBar.stop();
    console.log(chalk.green(`Successfully removed ${apps.length} icons`));
  }).argv;
