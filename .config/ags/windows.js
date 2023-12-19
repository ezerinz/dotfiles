import NotificationPopup from "./widgets/notifications/PopupWindow.js";
import NotificationCenter from "./widgets/notifications/NotificationCenter.js";
import DatemenuPopup from "./widgets/datemenu/PopupWindow.js";
import QSPopup from "./widgets/quicksettings/PoupWindow.js";
import Bar from "./widgets/bar/BarWindow.js";
import PowerMenu from "./widgets/powermenu/PowerMenu.js";
import Verification from "./widgets/powermenu/Verification.js";
import Osd from "./widgets/osd/OSD.js";
import AppLauncher from "./widgets/applauncher/Applauncher.js";
import { forMonitors } from "./utils.js";

export default [
  // forMonitors(Bar),
  // forMonitors(Osd),
  // forMonitors(NotificationPopup),
  Bar(),
  Osd(),
  NotificationPopup(),
  AppLauncher(),
  PowerMenu(),
  Verification(),
  NotificationCenter(),
  DatemenuPopup(),
  QSPopup(),
];
