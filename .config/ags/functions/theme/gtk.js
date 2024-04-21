import { HOME } from "../../vars.js";
import Gio from "gi://Gio";

const settings = new Gio.Settings({
  schema: "org.gnome.desktop.interface",
});

function setGtkSetting(themeScheme) {
  settings.reset("color-scheme");
  settings.set_string("color-scheme", `prefer-${themeScheme}`);
  settings.set_string(
    "gtk-theme",
    `adw-gtk3${themeScheme == "dark" ? "-dark" : ""}`,
  );
}

export default async function setGtk(theme, themeScheme) {
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
    setGtkSetting(themeScheme);
  });
}
