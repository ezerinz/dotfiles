import { Battery, App, Utils, Variable, Audio, Hyprland } from "./imports.js";
import Gdk from "gi://Gdk";
import icons from "./widgets/icons.js";
import Powerprofile from "./widgets/services/powerProfile.js";
import { capsLockState } from "./vars.js";

function sendBatch(batch) {
  const cmd = batch
    .filter((x) => !!x)
    .map((x) => `keyword ${x}`)
    .join("; ");

  Hyprland.sendMessage(`[[BATCH]]/${cmd}`);
}

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
  const noIgnorealpha = ["verification", "powermenu", "lockscreen"];

  sendBatch(
    App.windows.flatMap(({ name }) => [
      `layerrule blur, ${name}`,
      noIgnorealpha.some((skip) => name?.includes(skip))
        ? ""
        : `layerrule ignorealpha 0.6, ${name}`,
    ]),
  );
}

export async function globalServices() {
  globalThis.ags = await import("./imports.js");
  globalThis.recorder = (
    await import("./widgets/services/screenRecord.js")
  ).default;
  globalThis.indicator = (
    await import("./widgets/services/onScreenIndicator.js")
  ).default;
  globalThis.audio = Audio;
  globalThis.brightness = (
    await import("./widgets/services/brightness.js")
  ).default;
  globalThis.capsLock = () => {
    capsLockState.value = Utils.exec("brightnessctl -d input3::capslock g");
  };
}

export function range(length, start = 1) {
  return Array.from({ length }, (_, i) => i + start);
}

export function forMonitors(widget) {
  const n = Gdk.Display.get_default().get_n_monitors();
  return range(n, 0).map(widget);
}
