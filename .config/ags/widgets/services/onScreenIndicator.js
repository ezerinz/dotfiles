import icons from "../icons.js";
import { Service, Utils, Audio } from "../../imports.js";
import Brightness from "./brightness.js";

function getAudioTypeIcon(icon) {
  const substitues = [
    ["audio-headset-bluetooth", icons.audio.type.headset],
    ["audio-card-analog-usb", icons.audio.type.speaker],
    ["audio-card-analog-pci", icons.audio.type.card],
  ];

  for (const [from, to] of substitues) {
    if (from === icon) return to;
  }

  return icon;
}

class Indicator extends Service {
  static {
    Service.register(this, {
      popup: ["double", "string"],
    });
  }

  _delay = 1500;
  _count = 0;

  popup(value, icon) {
    this.emit("popup", value, icon);
    this._count++;
    Utils.timeout(this._delay, () => {
      this._count--;

      if (this._count === 0) this.emit("popup", -1, icon);
    });
  }

  speaker() {
    this.popup(Audio.speaker.volume, getAudioTypeIcon(Audio.speaker.iconName));
  }

  display() {
    // brightness is async, so lets wait a bit
    Utils.timeout(10, () => {
      const value = Service.Brightness.screen;
      const icon = icons.brightness.screen[Math.ceil(value * 10)];
      this.popup(value, icon);
    });
  }

  kbd() {
    // brightness is async, so lets wait a bit
    Utils.timeout(10, () => {
      const value = Brightness.kbd;
      this.popup((value * 33 + 1) / 100, icons.brightness.keyboard);
    });
  }
  connect(event = "popup", callback) {
    return super.connect(event, callback);
  }
}

export default new Indicator();
