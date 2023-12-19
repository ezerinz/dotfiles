import { Service, Utils } from "../../imports.js";

class PowerProfile extends Service {
  static {
    Service.register(this);
  }

  _powerprofile = "";

  constructor() {
    super();
    this._activePowerProfile();
  }

  _activePowerProfile() {
    Utils.execAsync(["powerprofilesctl", "get"])
      .then((out) => {
        this._powerprofile = out.trim();
        this.emit("changed");
      })
      .catch(print);
  }

  get list() {
    const defaultList = [
      "performance",
      "balanced",
      "power-saver",
      "kontol-gede-mode", //maaf teman2 indo, cuma ngetest
    ];
    const cmd = Utils.exec("powerprofilesctl list");
    var filteredList = defaultList.filter((e) => cmd.includes(e));

    return filteredList.map((e) => ({
      mode: e,
      active: e === this._powerprofile,
    }));
  }

  set powerprofile(mode) {
    Utils.execAsync(`powerprofilesctl set ${mode}`)
      .then(() => {
        this._powerprofile = mode;
        this.emit("changed");
      })
      .catch(print);
  }

  get powerprofile() {
    return this._powerprofile;
  }
}

export default new PowerProfile();
