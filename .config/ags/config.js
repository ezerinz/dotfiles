import Windows from "./windows.js";
import { App } from "./imports.js";
import * as setup from "./utils.js";

setup.scssAndWallpaper();
setup.blurWindows();
setup.globalServices();
setup.warnOnLowBattery();

export default {
  closeWindowDelay: {
    notifications: 500, // milliseconds
    "notification-center": 500,
    datemenu: 500,
    quicksettings: 500,
  },
  notificationPopupTimeout: 5000, // milliseconds
  maxStreamVolume: 1.5, // float
  style: App.configDir + "/style.css",
  windows: Windows.flat(1),
};
