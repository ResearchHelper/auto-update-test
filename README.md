# Build and Publish

I am building on a Linux machine.

## Linux target: AppImage

Just build it.

## Windows target: nsis

The window installer program. We need to specify main entrance file.

## Mac target: dmg

`dmg` is better than `pkg` since we don't need to worry about the uninstaller.

Use the docker image `sickcodes/Docker-OSX`, we can run macos on linux. Use that to build `dmg`.

# Auto Update

See the files `electron-main.js`, `electron-preload.js` and `App.vue`.
