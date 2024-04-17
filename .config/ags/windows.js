import BarWindow from "./widget/bar/Window.js";
import {
  FolderChooserWindow,
  WallpaperPickerWindow,
} from "./widget/wallpaper_picker/Window.js";
import DatemenuWindow from "./widget/datemenu/Window.js";
import AppLauncherWindow from "./widget/applauncher/Window.js";
import HyprsplashWindow from "./widget/hyprsplash/Window.js";
import BatteryWindow from "./widget/battery/Window.js";
import ControlCenterWindow from "./widget/control_center/Window.js";
import NotificationPopupWindow from "./widget/notifications/PopupWindow.js";
import NetworkWindow from "./widget/network/Window.js";
import VerificationWindow from "./widget/powermenu/VerificationWindow.js";
import PowerMenuWindow from "./widget/powermenu/PowerMenuWindow.js";
import AudioWindow from "./widget/audio/Window.js";
import SystemMonitorWindow from "./widget/system_monitor/Window.js";

App.addIcons(`${App.configDir}/assets`);

export default [
  BarWindow(),
  WallpaperPickerWindow(),
  FolderChooserWindow(),
  DatemenuWindow(),
  AppLauncherWindow(),
  BatteryWindow(),
  NetworkWindow(),
  ControlCenterWindow(),
  AudioWindow(),
  NotificationPopupWindow(),
  PowerMenuWindow(),
  VerificationWindow(),
  HyprsplashWindow(),
  SystemMonitorWindow(),
];
