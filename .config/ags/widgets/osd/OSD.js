import { Progress } from "../misc/misc.js";
import FontIcon from "../misc/FontIcon.js";
import Indicator from "../services/onScreenIndicator.js";
import { Utils, Widget } from "../../imports.js";

export const OnScreenIndicator = ({ height = 300, width = 48 } = {}) =>
  Widget.Box({
    className: "indicator",
    css: "padding: 1px;",
    children: [
      Widget.Revealer({
        transition: "slide_left",
        setup: (self) =>
          self.hook(Indicator, (revealer, value) => {
            revealer.revealChild = value > -1;
          }),
        child: Progress({
          width,
          height,
          vertical: true,
          child: Widget.Stack({
            vpack: "start",
            hpack: "center",
            hexpand: false,
            children: {
              true: Widget.Icon({
                hpack: "center",
                size: width,
                setup: (self) =>
                  self.hook(
                    Indicator,
                    (icon, _v, name) => (icon.icon = name || ""),
                  ),
              }),

              false: FontIcon({
                hpack: "center",
                hexpand: true,
                css: `font-size: ${width}px;`,
                setup: (self) =>
                  self.hook(
                    Indicator,
                    (icon, _v, name) => (icon.icon = name || ""),
                  ),
              }),
            },
            setup: (self) => {
              self.hook(Indicator, (stack, _v, name) => {
                stack.shown = `${!!Utils.lookUpIcon(name)}`;
              });
            },
          }),
        }).hook(Indicator, (progress, value) => progress.setValue(value)),
      }),
    ],
  });

export default (monitor) =>
  Widget.Window({
    name: `indicator${monitor}`,
    monitor,
    className: "indicator",
    layer: "overlay",
    anchor: ["right"],
    child: OnScreenIndicator(),
  });
