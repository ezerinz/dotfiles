import Gio from "gi://Gio";
import { configs, HOME } from "../vars.js";
import { sendBatch, sh } from "./utils.js";
import { matugenStringify } from "./matugen.js";

//===== WALLPAPER
export function cpWallpaper(filename) {
  const folder = configs.wallpaper.folder.value;
  const path = folder + "/" + filename;
  Utils.execAsync(["cp", path, `${HOME}/.config/background`]).catch(print);
}

export async function initWallpaper() {
  //monitor
  Utils.monitorFile(`${HOME}/.config/background/`, (file, eventType) => {
    if (eventType === Gio.FileMonitorEvent.CHANGES_DONE_HINT) {
      setWallpaper(file.get_path());
    }
  });

  //init
  sh("swww-daemon --format xrgb");
}

export function setWallpaper(path) {
  sh(`matugen image ${path} --json hex`).then((out) => {
    Utils.writeFile(
      JSON.stringify(JSON.parse(out), null, 2),
      App.configDir + "/colors.json",
    ).catch(print);
  });

  sh([
    "swww",
    "img",
    "--transition-type",
    "any",
    "--transition-fps",
    "60",
    path,
  ]);
}
//===== WALLPAPER

//===== GENERATED COLOR, DARK MODE STUFF
function setScss() {
  // print("STYLE EDITED");
  const scss = App.configDir + "/style/main.scss";
  const css = App.configDir + "/style.css";

  Utils.execAsync(["sass", scss, css])
    .then(() => {
      App.resetCss();
      App.applyCss(css);
    })
    .catch(print);
}
function setKitty(themeJson, harmonizedColors, themeScheme) {
  const themeDark = themeJson.colors["dark"];
  const theme = themeJson.colors[themeScheme];
  let backgroundTemplate = [
    ["background", theme.background],
    [
      "foreground",
      themeScheme == "dark" ? theme.on_background : theme.on_primary_fixed,
    ],
  ];
  let backgroundString = "[colors.primary]\n";
  backgroundTemplate.forEach((element) => {
    element[1] = `"${element[1]}"`;
    backgroundString += element.join(" = ") + "\n";
  });

  let colorTemplate = [
    ["red", harmonizedColors.red],
    ["green", harmonizedColors.green],
    ["yellow", harmonizedColors.yellow],
    ["blue", harmonizedColors.blue],
    ["magenta", harmonizedColors.magenta],
    ["cyan", harmonizedColors.cyan],
  ];
  let colorStringify = "";
  colorTemplate.forEach((element) => {
    element[1] = `"${element[1]}"`;
    colorStringify += element.join(" = ") + "\n";
  });

  let stringify = `${backgroundString}

[colors.normal]
black = "${themeScheme == "dark" ? themeDark.surface : themeDark.on_background}"
${colorStringify}white = "${themeScheme == "dark" ? harmonizedColors.white : theme.on_primary_fixed}"

[colors.bright]
black = "${themeScheme == "dark" ? themeDark.surface_bright : themeDark.primary_fixed}"
${colorStringify}white = "${themeScheme == "dark" ? harmonizedColors.white2 : theme.on_primary_fixed_variant}"
`;

  Utils.writeFile(
    stringify,
    HOME + "/.config/alacritty/generated-colors.toml",
  ).then(() => {
    // sh(`pkill -SIGUSR1 kitty`);
  });
}

function setAgsCss(theme) {
  Utils.writeFile(
    matugenStringify("${{key}}: {{value}};", theme),
    App.configDir + "/style/colors.scss",
  );

  setScss();
}

function setHyprland(theme) {
  const bgColor = theme.background.replace("#", "");
  const primaryColor = theme.primary.replace("#", "");
  sendBatch([
    `decoration:col.shadow rgb(${bgColor})`,
    `decoration:rounding ${configs.theme.border_radius.value}`,
    `general:col.active_border rgb(${primaryColor})`,
    `general:gaps_out ${configs.theme.hyprland_window_margin.value}`,
  ]);
}

//GTK
async function setGtkCss(theme, colorScheme) {
  const primaryColor = theme.primary;
  const bgColor = theme.background;
  const gtkCss = [
    `accent_bg_color ${primaryColor};`,
    `view_bg_color alpha(${bgColor}, 0.7);`,
    `sidebar_bg_color alpha(${bgColor}, 0.7);`,
    `headerbar_bg_color ${bgColor};`,
    `popover_bg_color alpha(${bgColor}, 0.7);`,
  ];
  Utils.writeFile(
    gtkCss
      .map((vars) => {
        return "@define-color " + vars;
      })
      .join(`\n`),
    HOME + "/.themes/colors.css",
  ).then(() => {
    gtk(colorScheme);
  });
}

const settings = new Gio.Settings({
  schema: "org.gnome.desktop.interface",
});

function gtk(themeMode) {
  settings.reset("color-scheme");
  settings.set_string("color-scheme", `prefer-${themeMode}`);
  settings.set_string(
    "gtk-theme",
    `adw-gtk3${themeMode == "dark" ? "-dark" : ""}`,
  );
}

const format = (str) =>
  str
    .split(",")
    .map((item) => `${item}px`)
    .join(" ");

export function setScssVariable(key = "", value = "") {
  let data = {
    margin: "0",
    border_radius: "0",
    bar_border_radius: "0",
    bar_margin: "0",
    workspace_active_width: "30",
  };
  data.margin = format(configs.theme.window_margin.value);
  data.border_radius = format(configs.theme.border_radius.value);
  data.bar_border_radius = format(configs.theme.bar.border_radius.value);
  data.bar_margin = format(configs.theme.bar.margin.value);
  data.workspace_active_width = format(
    configs.theme.bar.workspace_active_width.value,
  );

  let update = {};
  if (key != "" && value != "") {
    update[key] = format(value);
  }
  let merged = { ...data, ...update };

  let result = "";

  Object.entries(merged).forEach(([key, value]) => {
    result += `$${key}: ${value};\n`;
  });

  Utils.writeFile(result, App.configDir + "/style/vars.scss");
}

export function setTheme() {
  const themeJson = JSON.parse(
    Utils.readFile(App.configDir + "/colors.json") || "{}",
  );
  const themeMode = configs.theme.dark_mode.value ? "dark" : "light";
  const theme = themeJson.colors[themeMode];
  const harmonizedColors = themeJson.harmonized_colors;

  setScssVariable();
  setAgsCss(theme);
  setHyprland(theme);
  setGtkCss(theme, themeMode);
  setKitty(themeJson, harmonizedColors, themeMode);
}

function monitorsTheme() {
  Utils.monitorFile(App.configDir + "/colors.json", () => {
    setTheme();
  });

  Utils.monitorFile(App.configDir + "/style/", setScss);
}

export function initTheme() {
  setTheme();
  monitorsTheme();
}
