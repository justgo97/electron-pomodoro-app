import path from "path";
import { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain } from "electron";

import { updateElectronApp } from "update-electron-app";
updateElectronApp();

let mainWindow: BrowserWindow;
let tray: Tray;

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  mainWindow.on("minimize", () => {
    createTray();
    mainWindow.hide();
  });

  mainWindow.on("show", () => {
    if (tray) {
      tray.destroy();
      tray = null;
    }
  });

  ipcMain.on("start-break", () => {
    //
    mainWindow.maximize();
    mainWindow.show();
    mainWindow.moveTop();
  });
};

const createTray = () => {
  const iconPath = app.isPackaged
    ? path.join(__dirname, "..", "..", "..", "pomodoro.ico")
    : path.join(__dirname, "..", "..", "src", "pomodoro.ico");

  const icon = nativeImage.createFromPath(iconPath);

  tray = new Tray(icon);

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Show",
        click: function () {
          mainWindow.maximize();
          mainWindow.show();
        },
      },
      {
        label: "Quit",
        click: function () {
          app.quit();
        },
      },
    ])
  );

  tray.on("click", () => {
    mainWindow.maximize();
    mainWindow.show();

    const menu = Menu.getApplicationMenu();
    const items = menu.items.filter((item) => item.role !== "help");
    Menu.setApplicationMenu(Menu.buildFromTemplate(items));
  });

  tray.on("mouse-move", () => {
    tray.setToolTip(mainWindow.webContents.getTitle());
  });
};

app.whenReady().then(() => {
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
