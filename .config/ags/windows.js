import { PopupLayout } from "./widgets/popuplayout.js";
import { Applauncher } from "./modules/applauncher.js";
import * as date from "./widgets/date.js";
import * as notification from "./widgets/notifications.js";
import * as hyprland from "./widgets/hyprland.js";
import * as quicksettings from "./widgets/quicksettings.js";
import * as powermenu from "./widgets/powermenu.js";
import * as screenrecord from "./modules/screenrecord.js";

const { Box, Window } = ags.Widget;

// layout of the bar
const Left = () =>
  Box({
    children: [
      date.PanelButton(),
      notification.PanelButton(),
      screenrecord.PanelButton(),
    ],
    className: "left",
  });

const Center = () =>
  Box({
    children: [
      Box({ hexpand: true }),
      hyprland.Workspaces(),
      Box({ hexpand: true }),
    ],
    hexpand: true,
    className: "center",
  });

const Right = () =>
  Box({
    children: [quicksettings.PanelButton()],
    className: "right",
  });

const Bar = ({ monitor } = {}) =>
  Window({
    name: `bar${monitor || ""}`, // name has to be unique
    className: "bar",
    monitor,
    anchor: ["top", "left", "right"],
    exclusive: true,
    child: Box({
      children: [Left(), Center(), Right()],
    }),
  });

const DateMenu = () =>
  Window({
    name: `datemenu`, // name has to be unique
    popup: true,
    focusable: true,
    anchor: ["top", "left"],
    child: PopupLayout({
      layout: "top",
      window: "datemenu",
      child: date.PopUpContent(),
    }),
  });

const NotificationCenter = () =>
  Window({
    name: "notification-center",
    anchor: ["top", "left"],
    popup: true,
    focusable: true,
    child: PopupLayout({
      layout: "top",
      window: "notification-center",
      child: Box({
        className: "notificationcenter__popup",
        vertical: true,
        children: [notification.Header(), notification.NotificationList()],
      }),
    }),
  });

const NotificationsPopupWindow = () =>
  Window({
    name: "notification-popup",
    anchor: "top left",
    child: notification.PopupList(),
  });

const QuickSettings = () =>
  Window({
    name: "quicksettings",
    popup: true,
    focusable: true,
    anchor: ["top", "right"],
    child: PopupLayout({
      layout: "top",
      window: "quicksettings",
      child: quicksettings.PopupContent(),
    }),
  });

const Popup = (name, child) =>
  Window({
    name,
    popup: true,
    focusable: true,
    layer: "overlay",
    child: PopupLayout({
      layout: "center",
      window: name,
      child: child(),
    }),
  });

const PowermenuPopup = () => Popup("powermenu", powermenu.PopupContent);
const VerificationPopup = () => Popup("verification", powermenu.Verification);
const ApplauncherPopup = () => Popup("applauncher", Applauncher);

export default [
  Bar(),
  DateMenu(),
  NotificationCenter(),
  NotificationsPopupWindow(),
  QuickSettings(),
  PowermenuPopup(),
  VerificationPopup(),
  ApplauncherPopup(),
];
