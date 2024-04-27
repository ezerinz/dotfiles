import PanelButton from "../PanelButton.js";
import { WINDOW_NAME } from "./Window.js";
import { configs } from "../../vars.js";

export default () =>
  PanelButton({
    window: WINDOW_NAME,
    on_clicked: () => {
      App.toggleWindow(WINDOW_NAME);
    },
    child: Widget.Label({
      label: configs.theme.bar.launcher_icon.bind(),
      hpack: "center",
      xalign: 0,
    }),
  });
