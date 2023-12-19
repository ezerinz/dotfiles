import { Clock, Calendar, Uptime } from "./datemenu.js";
import { Widget } from "../../imports.js";
import PopupWindow from "../misc/PopupWindow.js";

const PopUpContent = () =>
  Widget.Box({
    className: "datemenu__popup",
    vertical: true,
    children: [
      Clock({ className: "clock", format: "%H:%M:%S" }),
      Clock({ className: "date", format: "%A, %e %B %Y" }),
      Widget.Box({
        hpack: "center",
        children: [Widget.Label({ label: "Uptime: " }), Uptime()],
      }),
      Calendar(),
    ],
  });

export default ({ anchor = ["top", "left"], layout = "top" } = {}) =>
  PopupWindow({
    name: "datemenu",
    layout,
    anchor,
    content: PopUpContent(),
  });
