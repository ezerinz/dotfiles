import { clock } from "../../vars.js";
import PanelButton from "../PanelButton.js";
import { WINDOW_NAME } from "./Window.js";

export default () =>
  PanelButton({
    window: WINDOW_NAME,
    child: Widget.Label({ label: clock.bind().as((t) => t.format("%H:%M")) }),
    on_clicked: () => {
      App.toggleWindow(WINDOW_NAME);
    },
  });
