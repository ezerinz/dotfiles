const { Icon, Label, Box, Button, Stack } = ags.Widget;
import PowerProfile from "../services/powerProfile.js";

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
          }),
        )),
      ],
    ],
  });

export const PowerprofileIndicator = ({
  balanced = Icon({
    icon: "power-profile-balanced-rtl-symbolic",
  }),
  power_saver = Icon({
    icon: "power-profile-performance-symbolic-rtl",
  }),
  performance = Icon({
    icon: "power-profile-power-saver-rtl-symbolic",
  }),
} = {}) =>
  Stack({
    items: [
      ["balanced", balanced],
      ["power-saver", power_saver],
      ["performance", performance],
    ],
    connections: [
      [
        PowerProfile,
        (stack) => {
          stack.shown = `${PowerProfile.powerprofile}`;
        },
      ],
    ],
  });
