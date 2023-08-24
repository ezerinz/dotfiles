const { Icon, Label, Box, Button } = ags.Widget;
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
      "kontol-gede-mode",
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

class PowerProfile {
  static {
    Service.export(this, "Powerprofile");
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

function toTitleCase(str) {
  const arr = str.replace("-", " ").split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join(" ");
}

export const PowerModeLabel = (props) =>
  Label({
    ...props,
    connections: [
      [
        PowerProfile,
        (label) => (label.label = toTitleCase(PowerProfile.powerprofile)),
      ],
    ],
  });

export const PowerProfileSelection = (props) =>
  Box({
    ...props,
    vertical: true,
    connections: [
      [
        PowerProfile,
        (box) =>
          (box.children = PowerProfile.list.map((ap) =>
            Button({
              onClicked: () => (PowerProfile.powerprofile = ap.mode),
              child: Box({
                children: [
                  Label(toTitleCase(ap.mode)),
                  ap.active &&
                    Icon({
                      icon: "object-select-symbolic",
                      hexpand: true,
                      halign: "end",
                    }),
                ],
              }),
            })
          )),
      ],
    ],
  });
