import { Widget } from "../../imports.js";
import { capsLockState } from "../../vars.js";

export default () => {
  return Widget.Stack({
    className: "panel-button lockkeys",
    children: {
      on: Widget.Icon({ icon: "capslock-enabled-symbolic", size: 16 }),
      off: Widget.Icon({ icon: "capslock-disabled-symbolic", size: 16 }),
    },
    setup: (self) =>
      self.bind("shown", capsLockState, "value", (v) =>
        v == "1" ? "on" : "off",
      ),
  });
};
