import BatteryPanelButton from "../battery/PanelButton.js";
import DatePanelButton from "../datemenu/PanelButton.js";
import NetworkSpeedIndicator from "../network_speed/PanelButton.js";
import AppLauncherPanelButton from "../applauncher/PanelButton.js";
import WorkspacesPanelButton from "../workspaces/PanelButton.js";
import ClientPanelButton from "../client/PanelButton.js";
import ControlCenterPanelButton from "../control_center/PanelButton.js";
import ScreenRecordPanelButton from "../screen_record/PanelButton.js";
import NetworkPanelButton from "../network/PanelButton.js";
import AudioPanelButton from "../audio/PanelButton.js";

const start = () =>
  Widget.Box({
    class_name: "start",
    spacing: 3,
    children: [
      AppLauncherPanelButton(),
      DatePanelButton(),
      WorkspacesPanelButton(),
    ],
  });

const center = () => Widget.Box({ children: [ClientPanelButton()] });

const end = () =>
  Widget.Box({
    class_name: "end",
    hpack: "end",
    spacing: 3,
    children: [
      ScreenRecordPanelButton(),
      NetworkSpeedIndicator(),
      NetworkPanelButton(),
      AudioPanelButton(),
      BatteryPanelButton(),
      ControlCenterPanelButton(),
    ],
  });

export default () =>
  Widget.Window({
    class_names: ["bar__window"],
    name: "bar__window",
    exclusivity: "exclusive",
    anchor: ["top", "left", "right"],
    child: Widget.CenterBox({
      class_names: ["bar__container"],
      start_widget: start(),
      center_widget: center(),
      end_widget: end(),
    }),
  });
