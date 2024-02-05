import Notification from "../misc/Notification.js";
import PopupWindow from "../misc/PopupWindow.js";
import { Notifications, Widget } from "../../imports.js";

const List = () =>
  Widget.Box({
    vertical: true,
    vexpand: true,
    setup: (self) =>
      self.hook(Notifications, (self) => {
        self.children = Notifications.notifications.reverse().map(Notification);

        self.visible = Notifications.notifications.length > 0;
      }),
  });

const Placeholder = () =>
  Widget.Box({
    className: "placeholder",
    vertical: true,
    vexpand: true,
    vpack: "center",
    children: [
      Widget.Icon("notifications-disabled-symbolic"),
      Widget.Label("Your inbox is empty"),
    ],
    setup: (self) =>
      self.bind(
        "visible",
        Notifications,
        "notifications",
        (n) => n.length === 0,
      ),
  });

const NotificationList = () =>
  Widget.Scrollable({
    hscroll: "never",
    vscroll: "automatic",
    child: Widget.Box({
      className: "list",
      vertical: true,
      children: [List(), Placeholder()],
    }),
  });

const ClearButton = () =>
  Widget.Button({
    onClicked: () => Notifications.clear(),
    setup: (self) =>
      self.bind(
        "sensitive",
        Notifications,
        "notifications",
        (n) => n.length > 0,
      ),
    child: Widget.Box({
      children: [
        Widget.Label("Clear"),
        Widget.Icon({
          setup: (self) =>
            self.bind(
              "icon",
              Notifications,
              "notifications",
              (n) => `user-trash-${n.length > 0 ? "full-" : ""}symbolic`,
            ),
        }),
      ],
    }),
  });

const DNDSwitch = () =>
  Widget.Switch({
    // type: Gtk.Switch,
    vpack: "center",
    setup: (self) =>
      self.on("notify::active", ({ active }) => {
        Notifications.dnd = active;
      }),
  });

const Header = () =>
  Widget.Box({
    className: "header",
    children: [
      Widget.Label("Do Not Disturb"),
      DNDSwitch(),
      Widget.Box({ hexpand: true }),
      ClearButton(),
    ],
  });

export default ({ anchor = ["top", "left"], layout = "top" } = {}) =>
  PopupWindow({
    name: "notification-center",
    // layout,
    anchor,
    child: Widget.Box({
      className: "notification__center",
      vertical: true,
      children: [Header(), NotificationList()],
    }),
  });
