import NotificationPanelButton from "../notifications/PanelButton.js";
import DatemenuPanelButton from "../datemenu/PanelButton.js";
import ScreenRecordPanelButton from "../screenrecord/PanelButton.js";
import Workspaces from "../workspaces/PanelButton.js";
import QSPanelButton from "../quicksettings/PanelButton.js";
import Recorder from "../services/screenRecord.js";

const { Box, Window, Label, Button } = ags.Widget;

const Pemisah = () =>
  Box({
    className: "bar__separator",
  });

const PemisahRecorder = () =>
  Box({
    className: "bar__separator",
    connections: [
      [
        Recorder,
        (box) => {
          box.visible = Recorder.instance._recording;
        },
      ],
    ],
  });

const Left = () =>
  Box({
    children: [
      DatemenuPanelButton(),
      Pemisah(),
      NotificationPanelButton(),
      PemisahRecorder(),
      ScreenRecordPanelButton(),
    ],
    className: "left",
  });

const Center = () =>
  Box({
    children: [Box({ hexpand: true }), Workspaces(), Box({ hexpand: true })],
    className: "center",
    hexpand: true,
  });

const Right = () =>
  Box({
    children: [QSPanelButton()],
    className: "right",
  });

export default (monitor) =>
  Window({
    name: `bar${monitor || ""}`,
    className: "bar",
    monitor,
    anchor: ["top", "left", "right"],
    exclusive: true,
    child: Box({
      className: "panel__container",
      children: [Left(), Center(), Right()],
    }),
  });
