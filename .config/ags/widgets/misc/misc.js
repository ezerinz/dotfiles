import { Widget, Utils } from "../../imports.js";
import FontIcon from "./FontIcon.js";

export const Separator = ({ className = "", ...props } = {}) =>
  Widget.Box({
    hexpand: false,
    vexpand: false,
    ...props,
    className: [...className.split(" "), "separator"].join(" "),
  });

export const DistroIcon = (props) =>
  FontIcon({
    ...props,
    className: "distro-icon",
    icon: (() => {
      // eslint-disable-next-line quotes
      const distro = Utils.exec(
        `bash -c "cat /etc/os-release | grep '^ID' | head -n 1 | cut -d '=' -f2"`,
      ).toLowerCase();

      switch (distro) {
        case "fedora":
          return "";
        case "arch":
          return "";
        case "nixos":
          return "";
        case "debian":
          return "";
        case "opensuse-tumbleweed":
          return "";
        case "ubuntu":
          return "";
        case "endeavouros":
          return "";
        default:
          return "";
      }
    })(),
  });

export const Spinner = ({ icon = "process-working-symbolic" }) =>
  Widget.Icon({
    icon,
    attributes: {
      deg: 0,
    },
    setup: (self) =>
      self.poll(10, (w) => {
        w.setStyle(`-gtk-icon-transform: rotate(${w._deg++ % 360}deg);`);
      }),
  });

export const Progress = ({
  height = 18,
  width = 180,
  vertical = false,
  child,
  ...props
}) => {
  const fill = Widget.Box({
    className: "fill",
    hexpand: vertical,
    vexpand: !vertical,
    hpack: vertical ? "fill" : "start",
    vpack: vertical ? "end" : "fill",
    children: [child],
  });

  return Widget.Box({
    ...props,
    className: "progress",
    css: `
            min-width: ${width}px;
            min-height: ${height}px;
        `,
    children: [fill],
    setup: (progress) =>
      (progress.setValue = (value) => {
        if (value < 0) return;

        const axis = vertical ? "height" : "width";
        const axisv = vertical ? height : width;
        const min = vertical ? width : height;
        const preferred = (axisv - min) * value + min;

        if (!fill._size) {
          fill._size = preferred;
          fill.setCss(`min-${axis}: ${preferred}px;`);
          return;
        }

        const frames = 10;
        const goal = preferred - fill._size;
        const step = goal / frames;

        for (let i = 0; i < frames; ++i) {
          Utils.timeout(5 * i, () => {
            fill._size += step;
            fill.setCss(`min-${axis}: ${fill._size}px`);
          });
        }
      }),
  });
};
export const HoverRevealer = ({
  indicator,
  child,
  direction = "left",
  duration = 300,
  setup,
  ...rest
}) =>
  Widget.Box({
    children: [
      Widget.EventBox({
        ...rest,
        onHover: (w) => {
          if (w._open) return;

          w.get_child().get_children()[
            direction === "down" || direction === "right" ? 1 : 0
          ].reveal_child = true;
          Utils.timeout(duration, () => (w._open = true));
        },
        onHoverLost: (w) => {
          if (!w._open) return;

          w.get_child().get_children()[
            direction === "down" || direction === "right" ? 1 : 0
          ].reveal_child = false;
          w._open = false;
        },
        child: Widget.Box({
          vertical: direction === "down" || direction === "up",
          children: [
            direction === "down" || direction === "right" ? indicator : null,
            Widget.Revealer({
              transition: `slide_${direction}`,
              setup,
              transitionDuration: duration,
              child,
            }),
            direction === "up" || direction === "left" ? indicator : null,
          ],
        }),
      }),
    ],
  });
