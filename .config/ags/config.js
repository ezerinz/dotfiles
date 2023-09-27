import { Windows, BlurWindows } from "./windows.js";

const scss = ags.App.configDir + "/scss/main.scss";
const css = ags.App.configDir + "/style.css";

ags.Utils.exec(`sassc ${scss} ${css}`);
ags.Utils.exec("swww init");
BlurWindows();

export default {
  closeWindowDelay: {
    notifications: 500, // milliseconds
    "notification-center": 500,
    datemenu: 500,
    quicksettings: 500,
  },
  notificationPopupTimeout: 5000, // milliseconds
  maxStreamVolume: 1.5, // float
  style: css,
  windows: Windows,
};
