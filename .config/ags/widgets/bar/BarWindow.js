import NotificationPanelButton from "../notifications/PanelButton.js";
import DatemenuPanelButton from "../datemenu/PanelButton.js";
import CapsLockStatePanelButton from "../caps-lock/PanelButton.js";
import {
  PemisahRecorder,
  RecordPanelButton,
} from "../screenrecord/PanelButton.js";
import Workspaces from "../workspaces/PanelButton.js";
import QSPanelButton from "../quicksettings/PanelButton.js";
import ColorPickerPanelButton from "../colorpicker/PanelButton.js";
import { Widget } from "../../imports.js";

const Pemisah = () =>
  Widget.Box({
    className: "bar__separator",
  });

const Left = () =>
  Widget.Box({
    children: [
      DatemenuPanelButton(),
      Pemisah(),
      NotificationPanelButton(),
      Pemisah(),
      CapsLockStatePanelButton(),
      PemisahRecorder(),
      RecordPanelButton(),
    ],
    className: "left",
  });

const Center = () =>
  Widget.Box({
    children: [
      Widget.Box({ hexpand: true }),
      Workspaces(),
      Widget.Box({ hexpand: true }),
    ],
    className: "center",
    hexpand: true,
  });

const Right = () =>
  Widget.Box({
    children: [ColorPickerPanelButton(), Pemisah(), QSPanelButton()],
    className: "right",
  });

export default (monitor) =>
  Widget.Window({
    name: `bar${monitor || ""}`,
    className: "bar",
    monitor,
    anchor: ["top", "left", "right"],
    exclusivity: "exclusive",
    child: Widget.Box({
      className: "panel__container",
      children: [Left(), Center(), Right()],
    }),
  });
