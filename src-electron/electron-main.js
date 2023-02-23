import { app, BrowserWindow, nativeTheme } from "electron";
import { initialize, enable } from "@electron/remote/main";
import { autoUpdater } from "electron-updater";
import path from "path";
import os from "os";

initialize();

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "verbose";
autoUpdater.logger.transports.file.resolvePathFn = () =>
  path.join("/home/huntfeng/Desktop", "app.log");

try {
  if (platform === "win32" && nativeTheme.shouldUseDarkColors === true) {
    require("fs").unlinkSync(
      path.join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}

let mainWindow;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      sandbox: false,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  enable(mainWindow.webContents);
  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  autoUpdater.checkForUpdates();
  autoUpdater.on("update-available", (info) => {
    mainWindow.webContents.send("updateMessage", info);
  });
  autoUpdater.on("update-not-available", (info) => {
    mainWindow.webContents.send("updateMessage", info);
  });
  autoUpdater.on("checking-for-update", () => {
    mainWindow.webContents.send("updateMessage", "checking for updates");
  });
  autoUpdater.on("error", (error, info) => {
    mainWindow.webContents.send("updateMessage", info);
  });
});

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
