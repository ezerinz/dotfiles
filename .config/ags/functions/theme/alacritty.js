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

export default function setAlacritty(themeJson, harmonizedColors, themeScheme) {
  const themeDark = themeJson.colors["dark"];
  const theme = themeJson.colors[themeScheme];
  const isDark = themeScheme == "dark";

  let background = stringify("[colors.primary]\n", [
    ["background", theme.background],
    ["foreground", isDark ? theme.on_background : theme.on_primary_fixed],
  ]);

  let colorTemplate = [
    ["red", harmonizedColors.red],
    ["green", harmonizedColors.green],
    ["yellow", harmonizedColors.yellow],
    ["blue", harmonizedColors.blue],
    ["magenta", harmonizedColors.magenta],
    ["cyan", harmonizedColors.cyan],
  ];

  let colorString = stringify("", colorTemplate);

  let colorNormal = stringify("[colors.normal]\n", [
    ["black", isDark ? themeDark.surface : themeDark.on_background],
    ["white", isDark ? harmonizedColors.white : theme.on_primary_fixed],
  ]);

  let colorBright = stringify("[colors.bright]\n", [
    ["black", isDark ? themeDark.surface_bright : themeDark.primary_fixed],
    [
      "white",
      isDark ? harmonizedColors.white2 : theme.on_primary_fixed_variant,
    ],
  ]);

  Utils.writeFile(
    `${background}
${colorNormal}${colorString}
${colorBright}${colorString}
`,
    // ${colorNorm}
    HOME + "/.config/alacritty/generated-colors.toml",
  ).then(() => {});
  setAlacrittyOpacity();
}
