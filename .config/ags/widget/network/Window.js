import PopupWindow from "../PopupWindow.js";
import { WifiSelection, NetworkToggle } from "./Wifi.js";
import { BluetoothDevices, BluetoothToggle } from "./Bluetooth.js";
import { Row } from "../ToggleButton.js";
export const WINDOW_NAME = "network__window";

const Container = () =>
  Widget.Box({
    class_names: ["network-info__container", "window-content"],
    hexpand: false,
    vertical: true,
    children: [
      Row([NetworkToggle, BluetoothToggle], [WifiSelection, BluetoothDevices]),
    ],
  });

export default () =>
  PopupWindow({
    name: WINDOW_NAME,
    layout: "top-right",
    animation: "slide top",
    child: Container(),
  });
