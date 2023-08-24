import Blur from "./modules/hyprlandblur.js";
import Windows from "./windows.js";

const scss = ags.App.configDir + "/scss/main.scss";
const css = ags.App.configDir + "/style.css";

ags.Utils.exec(`sassc ${scss} ${css}`);
ags.Utils.exec("swww init");
Blur();

export default {
  style: css,
  closeWindowDelay: {
    quicksettings: 500,
    datemenu: 500,
    "notification-center": 500,
  },
  notificationPopupTimeout: 5000,
  windows: Windows,
};
