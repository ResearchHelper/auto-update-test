import { app, BrowserWindow, nativeTheme, ipcMain } from "electron";
import { initialize, enable } from "@electron/remote/main";
import { autoUpdater } from "electron-updater";
import path from "path";
import os from "os";

initialize();

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();
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

app.whenReady().then(createWindow);

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

// auto updater
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "verbose";
autoUpdater.logger.transports.file.resolvePathFn = () =>
  path.join("/home/huntfeng/Desktop", "app.log");

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

autoUpdater.on("checking-for-update", () => {
  mainWindow.webContents.send("updateMessage", "checking for updates");
});
autoUpdater.on("update-available", (info) => {
  mainWindow.webContents.send("updateAvailable", true);

  mainWindow.webContents.send(
    "updateMessage",
    `Newer version ${info.version} is available`
  );
});
autoUpdater.on("update-not-available", (info) => {
  mainWindow.webContents.send("updateAvailable", false);
  mainWindow.webContents.send("updateMessage", "App is up-to-date");
});
autoUpdater.on("download-progress", (info) => {
  mainWindow.webContents.send(
    "updateMessage",
    `Downloading: ${Math.round(info.percent)}%`
  );
});
autoUpdater.on("update-downloaded", (event) => {
  mainWindow.webContents.send(
    "updateMessage",
    "Download complete, restart app to install."
  );
});
autoUpdater.on("error", (error, info) => {
  mainWindow.webContents.send("updateMessage", info);
});

ipcMain.on("checkForUpdates", () => {
  autoUpdater.checkForUpdates();
});

ipcMain.on("downloadUpdate", (event) => {
  autoUpdater.downloadUpdate();
});
