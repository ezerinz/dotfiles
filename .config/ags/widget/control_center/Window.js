import PopupWindow from "../PopupWindow.js";
import BrightnessSlider from "./Brightness.js";
import QSButtonContainer from "./buttons/Container.js";
import NotificationContainer from "./Notifications.js";
import { Media } from "./Media.js";

export const WINDOW_NAME = "control-center__window";

const Container = ({ width = 350 }) =>
  Widget.Box({
    vertical: true,
    vexpand: true,
    hexpand: false,
    children: [
      Widget.Box({
        class_names: ["control-center__container", "window-content"],
        css: `min-width: ${width}px;`,
        hexpand: false,
        vexpand: true,
        vertical: true,
        children: [
          BrightnessSlider(),
          Widget.Separator(),
          QSButtonContainer(),
          Widget.Separator(),
          NotificationContainer({}),
        ],
      }),
      Media(),
    ],
  });

export default () =>
  PopupWindow({
    name: WINDOW_NAME,
    animation: "slide top",
    layout: "top-right",
    child: Container({}),
  });
