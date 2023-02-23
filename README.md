# Build

I am building on a Linux machine.

## Linux target: `AppImage`

- Specify this in `quasar.config.js`
- Just build it.

## Windows target: `nsis`

- Specify this in `quasar.config.js`
- The window installer program. We need to specify main entrance file, add `"main": "src-electron/electron-main.js"` in `package.json`.

## Mac target: `dmg`

- Specify this in `quasar.config.js`
- `dmg` is better than `pkg` since we don't need to worry about the uninstaller.

Use the docker image `sickcodes/Docker-OSX`, we can run macos on linux. Use that to build `dmg`.

# Publish

1. Get github personal access token
2. Set the personal access token as environmental variable
3. Add `"repository": "https://github.com/ResearchHelper/auto-update-test"` in `package.json`
4. `quasar build -m electron -T [win32|linux|darwin] -P always`

See `build.sh`.

- The repository must be public.
- The product name must not contain space, otherwise we need to manually change it to dash `-`.

# Auto Update

1. Check for updates in `electron-main.js`
2. Use `mainWindow.webContents.send` to send information to renderer
3. Catch update infos from main process by `ipcRenderer.on`.
4. Expose API from `electron-preload.js` to the Mainworld.
5. Use the API in `.vue` files.

- See the files `electron-main.js`, `electron-preload.js` and `App.vue`.
