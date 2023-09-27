import Notification from "./notifications.js";
import PopupWindow from "../misc/PopupWindow.js";
const { Gtk } = imports.gi;
const { Notifications } = ags.Service;
const { Scrollable, Box, Icon, Label, Widget, Button, Stack } = ags.Widget;

const List = () =>
  Box({
    vertical: true,
    vexpand: true,
    connections: [
      [
        Notifications,
        (box) => {
          box.children = Notifications.notifications
            .reverse()
            .map((n) => Notification(n));

          box.visible = Notifications.notifications.length > 0;
        },
      ],
    ],
  });

const Placeholder = () =>
  Box({
    className: "placeholder",
    vertical: true,
    vexpand: true,
    valign: "center",
    children: [
      Icon("notifications-disabled-symbolic"),
      Label("Your inbox is empty"),
    ],
    connections: [
      [
        Notifications,
        (box) => {
          box.visible = Notifications.notifications.length === 0;
        },
      ],
    ],
  });

const NotificationList = () =>
  Scrollable({
    hscroll: "never",
    vscroll: "automatic",
    child: Box({
      className: "list",
      vertical: true,
      children: [List(), Placeholder()],
    }),
  });

const ClearButton = () =>
  Button({
    onClicked: Notifications.clear,
    connections: [
      [
        Notifications,
        (button) => {
          button.sensitive = Notifications.notifications.length > 0;
        },
      ],
    ],
    child: Box({
      children: [
        Label("Clear"),
        Stack({
          items: [
            ["true", Icon("user-trash-full-symbolic")],
            ["false", Icon("user-trash-symbolic")],
          ],
          connections: [
            [
              Notifications,
              (stack) => {
                stack.shown = `${Notifications.notifications.length > 0}`;
              },
            ],
          ],
        }),
      ],
    }),
  });

const DNDSwitch = () =>
  Widget({
    type: Gtk.Switch,
    valign: "center",
    connections: [
      [
        "notify::active",
        ({ active }) => {
          Notifications.dnd = active;
        },
      ],
    ],
  });

const Header = () =>
  Box({
    className: "header",
    children: [
      Label("Do Not Disturb"),
      DNDSwitch(),
      Box({ hexpand: true }),
      ClearButton(),
    ],
  });

export default ({ anchor = "top left", layout = "top" } = {}) =>
  PopupWindow({
    name: "notification-center",
    layout,
    anchor,
    content: Box({
      className: "notification__center",
      vertical: true,
      children: [Header(), NotificationList()],
    }),
  });
