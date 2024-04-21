import setAgs from "./ags.js";
import setHyprland from "./hyprland.js";
import setAlacritty from "./alacritty.js";
import setGtk from "./gtk.js";
import Gio from "gi://Gio";
import { applyCss } from "../utils.js";
import { configs } from "../../vars.js";

export function setTheme() {
  const themeJson = JSON.parse(
    Utils.readFile(App.configDir + "/colors.json") || "{}",
  );
  const themeMode = configs.theme.dark_mode.value ? "dark" : "light";
  const theme = themeJson.colors[themeMode];
  const harmonizedColors = themeJson.harmonized_colors;

  setAgs(theme);
  setHyprland(theme);
  setGtk(theme, themeMode);
  setAlacritty(themeJson, harmonizedColors, themeMode);
}

function monitorTheme() {
  Utils.monitorFile(App.configDir + "/colors.json", (_, eventType) => {
    if (eventType === Gio.FileMonitorEvent.CHANGES_DONE_HINT) {
      setTheme();
    }
  });
  Utils.monitorFile(App.configDir + "/style/", applyCss);
}

export default function initTheme() {
  monitorTheme();
  setTheme();
}
