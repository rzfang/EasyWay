# Easy Way
a Raspberry Pi GUI app to help editing configs. For life easier.

## This project uses
- HTML, Js, CSS
- [React](https://react.dev/)
- [Tauri V2](https://v2.tauri.app/)
- [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)

## Features
- Keyboard
    - Numlock default on/off
    - Hotkeys
- Autostart after booting.
- Launcher items.
- Workspace numbers.

## Covered Config files
- $HOME/.config/labwc/autostart
- $HOME/.config/labwc/rc.xml
- $HOME/.config/wf-panel-pi.ini

## Installation
- BE CAREFUL! Easy Way will modify [config files](#covered-config-files), please backup before you use Easy Way.
- For Raspberry PI OS only.
- Be sure upgrade the default web browser to latest version.
- Go to [Google Drive](https://drive.google.com/drive/folders/1fMFv7Mn0lYgy9zxPcaq9sjPBWwtO27Eg?usp=sharing) to get the deb file.

## Known Issues
- Noisy window view in every time app runs.  
Resize the window to force rerender can fix the issue.  
Guess there still some supports not perfect with Pi.
