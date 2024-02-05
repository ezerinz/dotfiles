import { Widget } from "../../imports.js";
import icons from "../icons.js";
import PowerProfile from "../services/powerProfile.js";

function toTitleCase(str) {
  const arr = str.replace("-", " ").split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join(" ");
}

export const PowerModeLabel = (props) =>
  Widget.Label({
    ...props,
    setup: (self) =>
      self.bind("label", PowerProfile, "powerprofile", (v) => toTitleCase(v)),
  });

export const PowerProfileSelection = (props) =>
  Widget.Box({
    ...props,
    vertical: true,
    setup: (self) =>
      self.hook(
        PowerProfile,
        (box) =>
          (box.children = PowerProfile.list.map((ap) =>
            Widget.Button({
              onClicked: () => (PowerProfile.powerprofile = ap.mode),
              child: Widget.Box({
                children: [
                  Widget.Label(toTitleCase(ap.mode)),
                  ap.active &&
                    Widget.Icon({
                      icon: "object-select-symbolic",
                      hexpand: true,
                      hpack: "end",
                    }),
                ],
              }),
            }),
          )),
      ),
  });

export const PowerprofileIndicator = ({
  balanced = Widget.Icon({
    icon: icons.powerprofile.Balanced,
  }),
  power_saver = Widget.Icon({
    icon: icons.powerprofile.Quiet,
  }),
  performance = Widget.Icon({
    icon: icons.powerprofile.Performance,
  }),
} = {}) =>
  Widget.Stack({
    children: {
      balanced: balanced,
      "power-saver": power_saver,
      performance: performance,
    },
    setup: (self) =>
      self.hook(PowerProfile, (stack) => {
        stack.shown = PowerProfile.powerprofile;
      }),
  });
