import { Battery, App, Utils, Variable } from "./imports.js";
import Gdk from "gi://Gdk";
import icons from "./widgets/icons.js";
import Powerprofile from "./widgets/services/powerProfile.js";

export function scssAndWallpaper() {
  const scss = App.configDir + "/scss/main.scss";
  const css = App.configDir + "/style.css";

  Utils.exec(`sassc ${scss} ${css}`);
  Utils.exec("swww init");
}

const notifSent = Variable(0);

export function warnOnLowBattery() {
  Battery.connect("notify::percent", () => {
    if (Math.round(Battery.percent) < 20) {
      if (notifSent.value === 0) {
        Utils.execAsync([
          "notify-send",
          `${Math.round(Battery.percent)}% Battery Percentage`,
          "Your battery is low, power saver mode activated.",
          "-i",
          icons.battery.warning,
          "-u",
          "critical",
        ]).then(() => {
          notifSent.setValue(1);
          Powerprofile.powerprofile = "power-saver";
        });
      }
    } else {
      notifSent.setValue(0);
    }
  });

  Battery.connect("notify::charging", () => {
    if (Battery.charging) {
      Powerprofile.powerprofile = "performance";
    }
  });
}

export function blurWindows() {
  try {
    App.connect("config-parsed", () => {
      for (const [name] of App.windows) {
        if (
          !name.includes("desktop") &&
          name !== "verification" &&
          name !== "powermenu"
        ) {
          Utils.execAsync([
            "hyprctl",
            "keyword",
            "layerrule",
            `unset, ${name}`,
          ]).then(() => {
            Utils.execAsync([
              "hyprctl",
              "keyword",
              "layerrule",
              `blur, ${name}`,
            ]);
            if (name.includes("bar")) {
              Utils.execAsync([
                "hyprctl",
                "keyword",
                "layerrule",
                `ignorealpha 0.2, ${name}`,
              ]);
            } else {
              Utils.execAsync([
                "hyprctl",
                "keyword",
                "layerrule",
                `ignorealpha 0.6, ${name}`,
              ]);
            }
          });
        }
      }

      for (const name of ["verification", "powermenu"])
        Utils.execAsync(["hyprctl", "keyword", "layerrule", `blur, ${name}`]);
    });

    JSON.parse(Utils.exec("hyprctl -j monitors")).forEach(({ name }) => {
      Utils.execAsync(`hyprctl keyword monitor ${name},addreserved,0,0,0,0`);
    });
  } catch (error) {
    logError(error);
  }
}

export async function globalServices() {
  globalThis.ags = await import("./imports.js");
  globalThis.recorder = (
    await import("./widgets/services/screenRecord.js")
  ).default;
}

export function range(length, start = 1) {
  return Array.from({ length }, (_, i) => i + start);
}

export function forMonitors(widget) {
  const n = Gdk.Display.get_default().get_n_monitors();
  return range(n, 0).map(widget);
}
