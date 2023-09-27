const { Service } = ags;
const { exec, execAsync } = ags.Utils;

class PowerProfileService extends Service {
  static {
    Service.register(this);
  }

  _powerprofile = "";

  constructor() {
    super();
    this._activePowerProfile();
  }

  _activePowerProfile() {
    execAsync(["powerprofilesctl", "get"])
      .then((out) => {
        this._powerprofile = out.trim();
        this.emit("changed");
      })
      .catch(print);
  }

  get list() {
    var defaultList = [
      "performance",
      "balanced",
      "power-saver",
      "kontol-gede-mode", //maaf
    ];
    const cmd = exec("powerprofilesctl list");
    var filteredList = defaultList.filter((e) => cmd.includes(e));

    return filteredList.map((e) => ({
      mode: e,
      active: e === this._powerprofile,
    }));
  }

  set powerprofile(mode) {
    execAsync(`powerprofilesctl set ${mode}`)
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

export default class PowerProfile {
  static {
    Service.PowerProfile = this;
  }

  static instance = new PowerProfileService();

  static get list() {
    return PowerProfile.instance.list;
  }

  static set powerprofile(value) {
    return (PowerProfile.instance.powerprofile = value);
  }

  static get powerprofile() {
    return PowerProfile.instance.powerprofile;
  }
}
