import path from "path";
import { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain } from "electron";

import { inlineUpdater } from "electron-inline-updater";

inlineUpdater();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow: BrowserWindow;
let tray: Tray;

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    height: 600,
    width: 800,
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(
        import.meta.dirname,
        `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`
      )
    );
  }

  // Open the DevTools.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.maximize();
    mainWindow.show();

    const menu = Menu.getApplicationMenu();
    const items = menu.items.filter((item) => item.role !== "help");
    Menu.setApplicationMenu(Menu.buildFromTemplate(items));
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
    ? path.join(import.meta.dirname, "..", "..", "..", "pomodoro.ico")
    : path.join(import.meta.dirname, "..", "..", "src", "pomodoro.ico");

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
