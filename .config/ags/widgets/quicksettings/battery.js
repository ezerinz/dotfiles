import { Battery, Widget } from "../../imports.js";

const icons = (charging) => [
  ...Array.from({ length: 9 }, (_, i) => i * 10).map((i) => [
    `${i}`,
    Widget.Icon({
      className: `${i} ${charging ? "charging" : "discharging"}`,
      icon: `battery-level-${i}${charging ? "-charging" : ""}-symbolic`,
    }),
  ]),
  [
    "100",
    Widget.Icon({
      className: `100 ${charging ? "charging" : "discharging"}`,
      icon: `battery-level-100${charging ? "-charged" : ""}-symbolic`,
    }),
  ],
];

const Indicators = (charging) =>
  Widget.Stack({
    items: icons(charging),
    connections: [
      [
        Battery,
        (stack) => {
          stack.shown = `${Math.floor(Battery.percent / 10) * 10}`;
        },
      ],
    ],
  });

export const Indicator = ({
  charging = Indicators(true),
  discharging = Indicators(false),
  ...props
} = {}) =>
  Widget.Stack({
    ...props,
    className: "battery",
    items: [
      ["true", charging],
      ["false", discharging],
    ],
    connections: [
      [
        Battery,
        (stack) => {
          const { charging, charged } = Battery;
          stack.shown = `${charging || charged}`;
          stack.toggleClassName("charging", Battery.charging);
          stack.toggleClassName("charged", Battery.charged);
          stack.toggleClassName("low", Battery.percent < 20);
        },
      ],
    ],
  });

export const LevelLabel = (props) =>
  Widget.Label({
    ...props,
    connections: [
      [Battery, (label) => (label.label = `${Math.round(Battery.percent)}%`)],
    ],
  });

export const Progress = (props) =>
  Widget.Box({
    ...props,
    className: "battery-progress",
    connections: [
      [
        Battery,
        (w) => {
          w.toggleClassName("half", Battery.percent < 46);
          w.toggleClassName("charging", Battery.charging);
          w.toggleClassName("charged", Battery.charged);
          w.toggleClassName("low", Battery.percent < 30);
        },
      ],
    ],
    children: [
      Widget.Overlay({
        child: Widget.ProgressBar({
          hexpand: true,
          connections: [
            [
              Battery,
              (progress) => {
                progress.fraction = Battery.percent / 100;
              },
            ],
          ],
        }),
        overlays: [
          Widget.Label({
            connections: [
              [
                Battery,
                (l) => {
                  l.label =
                    Battery.charging || Battery.charged
                      ? "󱐋"
                      : `${Battery.percent}%`;
                },
              ],
            ],
          }),
        ],
      }),
    ],
  });
