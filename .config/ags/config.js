import Windows from "./windows.js";
import { App } from "./imports.js";
import * as setup from "./utils.js";

function init() {
  setup.scssAndWallpaper();
  setup.blurWindows();
  setup.globalServices();
  setup.warnOnLowBattery();
}

export default {
  onConfigParsed: init,
  closeWindowDelay: {
    notifications: 500, // milliseconds
    "notification-center": 500,
    datemenu: 500,
    quicksettings: 500,
  },
  // notificationPopupTimeout: 5000, // milliseconds
  // maxStreamVolume: 1.5, // float
  style: App.configDir + "/style.css",
  windows: Windows.flat(1),
};
