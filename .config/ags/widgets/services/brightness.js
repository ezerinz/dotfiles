import { Service, Utils } from "../../imports.js";

// Change this to whatever keyboard you have
// you can check with brightnessctl --list
const KBD = "asus::kbd_backlight";
const CAPSLOCK = "input3::capslock";

class Brightness extends Service {
  static {
    Service.register(this);
  }

  _kbd = 0;
  _screen = 0;
  _capsLock = 0;

  get kbd() {
    return this._kbd;
  }

  get capsLock() {
    this._capsLock = Number(Utils.exec(`brightnessctl -d ${CAPSLOCK} g`));
    this.emit("caps-lock-updated");
    return this.capsLock;
  }

  get screen() {
    return this._screen;
  }

  set kbd(value) {
    if (value < 0 || value > this._kbdMax) return;

    Utils.execAsync(`brightnessctl -d ${KBD} s ${value} -q`)
      .then(() => {
        this._kbd = value;
        this.emit("changed");
      })
      .catch(print);
  }

  set screen(percent) {
    if (percent < 0) percent = 0;

    if (percent > 1) percent = 1;

    Utils.execAsync(`brightnessctl s ${percent * 100}% -q`)
      .then(() => {
        this._screen = percent;
        this.emit("changed");
      })
      .catch(print);
  }

  constructor() {
    super();
    this._kbd = Number(Utils.exec(`brightnessctl -d ${KBD} g`));
    // this._capsLock = Number(Utils.exec(`brightnessctl -d ${CAPSLOCK} g`));
    this._kbdMax = Number(Utils.exec(`brightnessctl -d ${KBD} m`));
    this._screen =
      Number(Utils.exec("brightnessctl g")) /
      Number(Utils.exec("brightnessctl m"));
  }
}

export default new Brightness();
