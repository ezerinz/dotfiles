import Blur from "./modules/hyprlandblur.js";
import Windows from "./windows.js";

const scss = ags.App.configDir + "/scss/main.scss";
const css = ags.App.configDir + "/style.css";

ags.Utils.exec(`sassc ${scss} ${css}`);
Blur();

export default {
  style: css,
  closeWindowDelay: {
    quicksettings: 300,
    datemenu: 300,
    "notification-center": 300,
    "notification-popup": 300,
  },
  windows: Windows,
};
