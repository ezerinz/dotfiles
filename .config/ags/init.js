import blurWindows from "./functions/blur_windows.js";
import { initTheme, initWallpaper, setWallpaper } from "./functions/theme.js";
import monitor_configuration from "./functions/monitor_configuration.js";
import applyAnimation from "./functions/apply_animation.js";
import recorder from "./services/screen_record.js";

function globals() {
  globalThis.setWall = setWallpaper;
  globalThis.recorder = recorder;
}

export default function() {
  globals();
  blurWindows();
  applyAnimation();
  monitor_configuration();
  initWallpaper();
  initTheme();
}
