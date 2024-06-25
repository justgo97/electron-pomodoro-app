import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";

import { PublisherGithub } from "@electron-forge/publisher-github";

import { WebpackPlugin } from "@electron-forge/plugin-webpack";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {
    executableName: "pomodoro",
    icon: "./src/pomodoro.ico",
    asar: false,
    extraResource: ["./src/pomodoro.ico"],
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: "pomodoro",
      setupIcon: __dirname + "/src/pomodoro.ico",
      iconUrl:
        "https://raw.githubusercontent.com/justgo97/electron-pomodoro-app/master/src/pomodoro.ico",
      noDelta: false,
      remoteReleases: "https://github.com/justgo97/electron-pomodoro-app",
    }),
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/index.html",
            js: "./src/renderer.ts",
            name: "main_window",
            preload: {
              js: "./src/preload.ts",
            },
          },
        ],
      },
    }),
  ],
  publishers: [
    new PublisherGithub({
      repository: { owner: "justgo97", name: "electron-pomodoro-app" },
      prerelease: false,
      draft: true,
    }),
  ],
};

export default config;
