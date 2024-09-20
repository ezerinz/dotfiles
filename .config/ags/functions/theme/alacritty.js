import { HOME, configs } from "../../vars.js";
function stringify(title, template) {
  let result = title;

  template.forEach((element) => {
    element[1] = `"${element[1]}"`;
    result += element.join(" = ") + "\n";
  });

  return result;
}
export function setAlacrittyOpacity(opacity) {
  if (opacity === undefined) {
    opacity = configs.theme.window.opacity.value;
  }

  Utils.writeFile(
    `[window]
opacity = ${opacity}
`,
    // ${colorNorm}
    HOME + "/.config/alacritty/opacity.toml",
  ).then(() => {});
}

export default function setAlacritty(themeJson, themeScheme) {
  const themeDark = themeJson.colors["dark"];
  const themeLight = themeJson.colors["light"];
  const theme = themeJson.colors[themeScheme];
  const isDark = themeScheme == "dark";

  let background = stringify("[colors.primary]\n", [
    ["background", theme.background],
    ["foreground", isDark ? theme.on_background : theme.on_primary_fixed],
  ]);

  let colorTemplate = [
    ["black", themeDark.surface_container],
    ["red", theme.red],
    ["green", theme.green],
    ["yellow", theme.yellow],
    ["blue", theme.blue],
    ["magenta", theme.magenta],
    ["cyan", theme.cyan],
    ["white", themeLight.surface_container],
  ];

  let colorBrightTemplate = [
    ["black", themeDark.surface_bright],
    ["red", theme.bright_red],
    ["green", theme.bright_green],
    ["yellow", theme.bright_yellow],
    ["blue", theme.bright_blue],
    ["magenta", theme.bright_magenta],
    ["cyan", theme.bright_cyan],
    ["white", themeLight.surface_bright],
  ];

  let colorString = stringify("[colors.normal]\n", colorTemplate);
  let colorBrightString = stringify("[colors.bright]\n", colorBrightTemplate);

  Utils.writeFile(
    `${background}
${colorString}
${colorBrightString}
`,
    // ${colorNorm}
    HOME + "/.config/alacritty/generated-colors.toml",
  ).then(() => {});
  setAlacrittyOpacity();
}
