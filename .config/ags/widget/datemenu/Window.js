import { clock } from "../../vars.js";
import PopupWindow from "../PopupWindow.js";

export const WINDOW_NAME = "datemenu__window";

const Container = () =>
  Widget.Box({
    vertical: true,
    class_name: "datemenu__container",
    children: [
      Widget.Label({
        label: clock.bind().as((t) => t.format("%T")),
        class_name: "clock",
      }),
      Widget.Label({
        label: clock.bind().as((dt) => dt.format("%d/%m/%Y")),
        class_name: "date",
      }),
      Widget.Calendar(),
    ],
  });

export default () =>
  PopupWindow({
    name: WINDOW_NAME,
    layout: "top-left",
    animation: "slide top",
    child: Container(),
  });
