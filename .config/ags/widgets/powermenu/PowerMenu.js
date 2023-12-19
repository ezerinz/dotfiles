import PowerMenu from "../services/powermenu.js";
import PopupWindow from "../misc/PopupWindow.js";
import { Widget } from "../../imports.js";

const icons = {
  sleep: "weather-clear-night-symbolic",
  reboot: "system-reboot-symbolic",
  logout: "system-log-out-symbolic",
  shutdown: "system-shutdown-symbolic",
};

const SysButton = (action, label, className = "") =>
  Widget.Button({
    className: className,
    onClicked: () => PowerMenu.action(action),
    child: Widget.Box({
      vertical: true,
      children: [Widget.Icon(icons[action]), Widget.Label(label)],
    }),
  });

export default () =>
  PopupWindow({
    name: "powermenu",
    expand: true,
    content: Widget.Box({
      className: "powermenu",
      homogeneous: true,
      children: [
        SysButton("sleep", "Sleep", "sleep"),
        SysButton("reboot", "Reboot", "reboot"),
        SysButton("logout", "Log Out", "logout"),
        SysButton("shutdown", "Shutdown", "shutdown"),
      ],
    }),
  });
