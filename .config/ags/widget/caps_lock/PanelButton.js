import PanelButton from "../PanelButton.js";
import { capsLockState } from "../../vars.js";

export default () =>
  PanelButton({
    class_name: "capslock-indicator",
    child: Widget.Icon({
      icon: capsLockState
        .bind()
        .as(
          (value) =>
            `capslock-${value === "1" ? "enabled" : "disabled"}-symbolic`,
        ),
    }),
  });
