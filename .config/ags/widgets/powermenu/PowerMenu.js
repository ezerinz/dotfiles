import PowerMenu from "../services/powermenu.js";
import PopupWindow from "../misc/PopupWindow.js";

const { Box, Icon, Label, Button } = ags.Widget;

const icons = {
  sleep: "weather-clear-night-symbolic",
  reboot: "system-reboot-symbolic",
  logout: "system-log-out-symbolic",
  shutdown: "system-shutdown-symbolic",
};

const SysButton = (action, label, className = "") =>
  Button({
    className: className,
    onClicked: () => PowerMenu.action(action),
    child: Box({
      vertical: true,
      children: [Icon(icons[action]), Label(label)],
    }),
  });

export default () =>
  PopupWindow({
    name: "powermenu",
    expand: true,
    content: Box({
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
