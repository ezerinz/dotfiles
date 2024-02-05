import Notification from "../misc/Notification.js";
import { Notifications, Widget, Utils } from "../../imports.js";

const Popups = () => {
  const map = new Map();

  const onDismissed = (box, id, force = false) => {
    if (!id || !map.has(id)) return;

    if (map.get(id).isHovered() && !force) return;

    if (map.size - 1 === 0) box.get_parent().reveal_child = false;

    Utils.timeout(200, () => {
      map.get(id)?.destroy();
      map.delete(id);
    });
  };

  const onNotified = (box, id) => {
    if (!id || Notifications.dnd) return;

    map.delete(id);
    map.set(id, Notification(Notifications.getNotification(id)));
    box.children = Array.from(map.values()).reverse();
    Utils.timeout(10, () => {
      box.get_parent().reveal_child = true;
    });
  };

  return Widget.Box({
    vertical: true,
    setup: (self) => {
      self.hook(Notifications, onNotified, "notified");

      self.hook(Notifications, onDismissed, "dismissed");

      self.hook(
        Notifications,
        (box, id) => onDismissed(box, id, true),
        "closed",
      );
    },
  });
};

const PopupList = ({ transition = "slide_down" } = {}) =>
  Widget.Box({
    className: "notifications-popup-list",
    css: "padding: 1px",
    children: [
      Widget.Revealer({
        transition,
        child: Popups(),
      }),
    ],
  });

export default (monitor) =>
  Widget.Window({
    monitor,
    name: `notifications-popup`,
    anchor: ["top", "left"],
    child: PopupList(),
  });
