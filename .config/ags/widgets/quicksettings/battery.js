import { Battery, Widget } from "../../imports.js";

const icons = (charging) => {
  const array = Array.from({ length: 9 }, (_, i) => i * 10);
  var result = {
    100: Widget.Icon({
      className: `100 ${charging ? "charging" : "discharging"}`,
      icon: `battery-level-100${charging ? "-charged" : ""}-symbolic`,
    }),
  };

  for (let index = 0; index <= 9; index++) {
    var i = index * 10;
    result[`${i}`] = Widget.Icon({
      className: `${i} ${charging ? "charging" : "discharging"}`,
      icon: `battery-level-${i}${charging ? "-charging" : ""}-symbolic`,
    });
  }
  return result;
};

const Indicators = (charging) =>
  Widget.Stack({
    children: icons(charging),
    setup: (self) =>
      self.hook(Battery, (stack) => {
        stack.shown = `${Math.floor(Battery.percent / 10) * 10}`;
      }),
  });

export const Indicator = ({
  charging = Indicators(true),
  discharging = Indicators(false),
  ...props
} = {}) =>
  Widget.Stack({
    ...props,
    className: "battery",
    children: {
      true: charging,
      false: discharging,
    },
    setup: (self) =>
      self.hook(Battery, (stack) => {
        const { charging, charged } = Battery;
        stack.shown = `${charging || charged}`;
        stack.toggleClassName("charging", Battery.charging);
        stack.toggleClassName("charged", Battery.charged);
        stack.toggleClassName("low", Battery.percent < 20);
      }),
  });

export const LevelLabel = (props) =>
  Widget.Label({
    ...props,
    setup: (self) =>
      self.bind("label", Battery, "percent", (v) => `${Math.round(v)}%`),
  });

export const Progress = (props) =>
  Widget.Box({
    ...props,
    className: "battery-progress",
    setup: (self) =>
      self.hook(Battery, (w) => {
        w.toggleClassName("half", Battery.percent < 46);
        w.toggleClassName("charging", Battery.charging);
        w.toggleClassName("charged", Battery.charged);
        w.toggleClassName("low", Battery.percent < 30);
      }),
    children: [
      Widget.Overlay({
        child: Widget.ProgressBar({
          hexpand: true,
          setup: (self) =>
            self.hook(Battery, (progress) => {
              progress.fraction = Battery.percent / 100;
            }),
        }),
        overlays: [
          Widget.Label({
            setup: (self) =>
              self.hook(Battery, (l) => {
                l.label =
                  Battery.charging || Battery.charged
                    ? "󱐋"
                    : `${Battery.percent}%`;
              }),
          }),
        ],
      }),
    ],
  });
