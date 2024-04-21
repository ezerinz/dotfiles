import recorder from "../services/screen_record.js";
import brightness from "../services/brightness.js";
import { capsLockState } from "../vars.js";

export default function globals() {
  globalThis.recorder = recorder;
  globalThis.brightness = brightness;
  globalThis.update_capslock = () => {
    Utils.exec(`brightnessctl -d input3::capslock g`, (stdout) => {
      capsLockState.setValue(stdout);
    });
  };
}
