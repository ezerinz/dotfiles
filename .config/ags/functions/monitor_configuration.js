import { configPath } from "../services/configuration.js";
import { HOME, configs } from "../vars.js";
import {
  replacePlaceholders as rep,
  // reverseReplace as rev,
} from "./replaces.js";
import Gio from "gi://Gio";

export default function() {
  const wallpaper = configs.wallpaper;
  const theme = configs.theme;
  const bar = theme.bar;
  Utils.monitorFile(configPath, (file, type) => {
    // Monitor non Utils.writeFile event
    if (type === Gio.FileMonitorEvent.ATTRIBUTE_CHANGED) {
      const configJson = JSON.parse(Utils.readFile(file.get_path()) || "{}");
      const wallpaperJson = configJson.wallpaper;
      const themeJson = configJson.theme;
      const barJson = themeJson.bar;

      if (wallpaper.folder.value != rep(wallpaperJson.folder, { home: HOME }))
        wallpaper.folder.setValue(rep(wallpaperJson.folder, { home: HOME }));

      if (wallpaper.current.value != wallpaperJson.current)
        wallpaper.current.setValue(wallpaperJson.current);

      if (theme.dark_mode.value != themeJson.dark_mode)
        theme.dark_mode.setValue(themeJson.dark_mode);

      if (theme.window_margin.value != themeJson.window_margin)
        theme.window_margin.setValue(themeJson.window_margin);

      if (
        theme.hyprland_window_margin.value != themeJson.hyprland_window_margin
      )
        theme.hyprland_window_margin.setValue(themeJson.hyprland_window_margin);

      if (theme.border_radius.value != themeJson.border_radius)
        theme.border_radius.setValue(themeJson.border_radius);

      if (bar.margin.value != barJson.margin)
        bar.margin.setValue(barJson.margin);

      if (bar.border_radius.value != barJson.border_radius)
        bar.border_radius.setValue(barJson.border_radius);

      if (bar.launcher_icon.value != barJson.launcher_icon)
        bar.launcher_icon.setValue(barJson.launcher_icon);

      if (bar.workspace_active_width.value != barJson.workspace_active_width)
        bar.workspace_active_width.setValue(barJson.workspace_active_width);
    }
  });
}
