import GLib from "gi://GLib";
import Conf from "./services/configuration.js";
import { cpWallpaper } from "./functions/wallpaper.js";
import { setTheme } from "./functions/theme/init.js";
import { setScssVariable } from "./functions/theme/ags.js";
import { sendBatch } from "./functions/utils.js";

export const HOME = Utils.HOME;

export const clock = Variable(GLib.DateTime.new_now_local(), {
  poll: [1000, () => GLib.DateTime.new_now_local()],
});

export const capsLockState = Variable(
  Utils.exec(`brightnessctl -d input3::capslock g`),
);

const divide = ([total, free]) => free / total;

export const cpu = Variable(0, {
  poll: [
    2000,
    "top -b -n 1",
    (out) =>
      divide([
        100,
        out
          .split("\n")
          .find((line) => line.includes("Cpu(s)"))
          .split(/\s+/)[1]
          .replace(",", "."),
      ]),
  ],
});

export const ram = Variable(0, {
  poll: [
    2000,
    "free",
    (out) =>
      divide(
        out
          .split("\n")
          .find((line) => line.includes("Mem:"))
          .split(/\s+/)
          .splice(1, 2),
      ),
  ],
});

export const configs = {
  wallpaper: {
    folder: Conf("wallpaper.folder", () => null, { home: HOME }),
    current: Conf("wallpaper.current", (self) => {
      cpWallpaper(self.value);
    }),
  },
  theme: {
    dark_mode: Conf("theme.dark_mode", setTheme),
    window_margin: Conf("theme.window_margin", (self) => {
      setScssVariable("margin", self.value);
    }),
    hyprland_window_margin: Conf("theme.hyprland_window_margin", (self) => {
      sendBatch([`general:gaps_out ${self.value}`]);
    }),
    border_radius: Conf("theme.border_radius", (self) => {
      setScssVariable("border_radius", self.value);
      sendBatch([`decoration:rounding ${self.value.split(",")[0].trim()}`]);
    }),
    bar: {
      margin: Conf("theme.bar.margin", (self) => {
        setScssVariable("bar_margin", self.value);
      }),
      border_radius: Conf("theme.bar.border_radius", (self) => {
        setScssVariable("bar_border_radius", self.value);
      }),
      launcher_icon: Conf("theme.bar.launcher_icon"),
      workspace_active_width: Conf(
        "theme.bar.workspace_active_width",
        (self) => {
          setScssVariable("workspace_active_width", self.value, false);
        },
      ),
    },
  },
  osd: {
    regular: {
      position: Conf("osd.regular.position"),
      vertical: Conf("osd.regular.vertical"),
      margin: Conf("osd.regular.margin", (self) => {
        setScssVariable("osd_regular_margin", self.value);
      }),
      capslock: Conf("osd.regular.capslock"),
      mic: Conf("osd.regular.mic"),
    },
    progress: {
      position: Conf("osd.progress.position"),
      vertical: Conf("osd.progress.vertical"),
      margin: Conf("osd.progress.margin", (self) => {
        setScssVariable("osd_progress_margin", self.value);
      }),
      brightness: Conf("osd.progress.brightness"),
      volume: Conf("osd.progress.volume"),
    },
  },
};
