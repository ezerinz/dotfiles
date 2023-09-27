import NotificationPopup from "./widgets/notifications/PopupWindow.js";
import NotificationCenter from "./widgets/notifications/NotificationCenter.js";
import DatemenuPopup from "./widgets/datemenu/PopupWindow.js";
import QSPopup from "./widgets/quicksettings/PoupWindow.js";
import Bar from "./widgets/bar/BarWindow.js";
import PowerMenu from "./widgets/powermenu/PowerMenu.js";
import Verification from "./widgets/powermenu/Verification.js";
import Osd from "./widgets/osd/OSD.js";
import AppLauncher from "./widgets/applauncher/Applauncher.js";
const { execAsync } = ags.Utils;

export const Windows = [
  AppLauncher(),
  Osd(),
  PowerMenu(),
  Verification(),
  NotificationPopup(),
  NotificationCenter(),
  DatemenuPopup(),
  QSPopup(),
  Bar(),
];

export function BlurWindows() {
  try {
    ags.App.instance.connect("config-parsed", () => {
      for (const [name] of ags.App.windows) {
        if (
          !name.includes("desktop") &&
          name !== "verification" &&
          name !== "powermenu"
        ) {
          execAsync(["hyprctl", "keyword", "layerrule", `unset, ${name}`]).then(
            () => {
              execAsync(["hyprctl", "keyword", "layerrule", `blur, ${name}`]);
              execAsync([
                "hyprctl",
                "keyword",
                "layerrule",
                `ignorealpha 0.6, ${name}`,
              ]);
            },
          );
        }
      }

      for (const name of ["verification", "powermenu"])
        execAsync(["hyprctl", "keyword", "layerrule", `blur, ${name}`]);
    });
  } catch (error) {
    logError(error);
  }
}
