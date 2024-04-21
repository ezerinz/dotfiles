import { configPath } from "../services/configuration.js";
import { HOME, configs } from "../vars.js";
import { replacePlaceholders as rep } from "./utils.js";
import Gio from "gi://Gio";

//sorry (?)

export default function() {
  const wallpaper = configs.wallpaper;
  const theme = configs.theme;
  const bar = theme.bar;
  const osd = configs.osd;
  Utils.monitorFile(configPath, (file, type) => {
    // Monitor non Utils.writeFile event
    if (type === Gio.FileMonitorEvent.ATTRIBUTE_CHANGED) {
      const configJson = JSON.parse(Utils.readFile(file.get_path()) || "{}");
      const wallpaperJson = configJson.wallpaper;
      const themeJson = configJson.theme;
      const barJson = themeJson.bar;
      const osdJson = configJson.osd;

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

      if (osd.progress.position.value != osdJson.progress.position)
        osd.progress.position.setValue(osdJson.progress.position);

      if (osd.regular.position.value != osdJson.regular.position)
        osd.regular.position.setValue(osdJson.regular.position);

      if (osd.progress.vertical.value != osdJson.progress.vertical)
        osd.progress.vertical.setValue(osdJson.progress.vertical);

      if (osd.regular.vertical.value != osdJson.regular.vertical)
        osd.regular.vertical.setValue(osdJson.regular.vertical);

      if (osd.regular.margin.value != osdJson.regular.margin)
        osd.regular.margin.setValue(osdJson.regular.margin);

      if (osd.progress.margin.value != osdJson.progress.margin)
        osd.progress.margin.setValue(osdJson.progress.margin);

      if (osd.regular.capslock.value != osdJson.regular.capslock)
        osd.regular.capslock.setValue(osdJson.regular.capslock);

      if (osd.regular.mic.value != osdJson.regular.mic)
        osd.regular.mic.setValue(osdJson.regular.mic);

      if (osd.progress.brightness.value != osdJson.progress.brightness)
        osd.progress.brightness.setValue(osdJson.progress.brightness);

      if (osd.progress.volume.value != osdJson.progress.volume)
        osd.progress.volume.setValue(osdJson.progress.volume);
    }
  });
}
