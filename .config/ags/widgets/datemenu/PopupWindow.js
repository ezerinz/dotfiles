import { Clock, Calendar, Uptime } from "./datemenu.js";
import PopupWindow from "../misc/PopupWindow.js";
const { Box, Label } = ags.Widget;

const PopUpContent = () =>
  Box({
    className: "datemenu__popup",
    vertical: true,
    children: [
      Clock({ className: "clock", format: "%H:%M:%S" }),
      Clock({ className: "date", format: "%A, %e %B %Y" }),
      Box({
        halign: "center",
        children: [Label({ label: "Uptime: " }), Uptime()],
      }),
      Calendar(),
    ],
  });

export default ({ anchor = "top left", layout = "top" } = {}) =>
  PopupWindow({
    name: "datemenu",
    layout,
    anchor,
    content: PopUpContent(),
  });
