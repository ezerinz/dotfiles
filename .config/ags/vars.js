import GLib from "gi://GLib";
import Conf from "./services/configuration.js";
import { cpWallpaper, setScssVariable, setTheme } from "./functions/theme.js";
import { sendBatch } from "./functions/utils.js";

export const HOME = Utils.HOME;

export const clock = Variable(GLib.DateTime.new_now_local(), {
  poll: [1000, () => GLib.DateTime.new_now_local()],
});

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
    folder: Conf("wallpaper.folder", () => null, { home: Utils.HOME }),
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
      sendBatch([`decoration:rounding ${self.value}`]);
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
          setScssVariable("workspace_active_width", self.value);
        },
      ),
    },
  },
};
