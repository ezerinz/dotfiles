import setAgs from "./ags.js";
import setHyprland from "./hyprland.js";
import setAlacritty from "./alacritty.js";
import setGtk from "./gtk.js";
import Gio from "gi://Gio";
import { applyCss, sh } from "../utils.js";
import { configs } from "../../vars.js";

async function checkColors() {
  try {
    await Utils.readFileAsync(TMP + "/colors.json");
  } catch (error) {
    if (error.toString().includes("No such file")) {
      sh(`matugen color hex "#282828" --json hex`).then((out) => {
        Utils.writeFile(
          JSON.stringify(JSON.parse(out), null, 2),
          TMP + "/colors.json",
        ).catch(print);
      });
    }
  }
}

export function setTheme() {
  checkColors().then(() => {
    const themeJson = JSON.parse(Utils.readFile(TMP + "/colors.json") || "{}");
    const themeMode = configs.theme.dark_mode.value ? "dark" : "light";
    const theme = themeJson["colors"][themeMode];
    const harmonizedColors = themeJson.harmonized_colors;

    setAgs(theme);
    setHyprland(theme);
    setGtk(theme, themeMode);
    setAlacritty(themeJson, harmonizedColors, themeMode);
  });
}

function monitorTheme() {
  Utils.monitorFile(TMP + "/colors.json", (_, eventType) => {
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
