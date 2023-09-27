import { FontIcon, Separator } from "../misc/misc.js";
import * as audio from "./audio.js";
import * as brightness from "./brightness.js";
import * as network from "./network.js";
import * as bluetooth from "./bluetooth.js";
import * as powerprofile from "./powerprofile.js";
import PowerProfile from "../services/powerProfile.js";
import PopupWindow from "../misc/PopupWindow.js";
const { Button, Box, Icon, Label, Revealer, Overlay } = ags.Widget;
const { Service, App } = ags;
const { Bluetooth, Network } = Service;
const { execAsync, timeout } = ags.Utils;

class QSMenu extends Service {
  static {
    Service.register(this);
  }
  static instance = new QSMenu();
  static opened = "";
  static toggle(menu) {
    QSMenu.opened = QSMenu.opened === menu ? "" : menu;
    QSMenu.instance.emit("changed");
  }

  constructor() {
    super();
    App.instance.connect("window-toggled", (_a, name, visible) => {
      if (name === "quicksettings" && !visible) {
        QSMenu.opened = "";
        QSMenu.instance.emit("changed");
      }
    });
  }
}

const Arrow = (menu, toggleOn) =>
  Button({
    className: "arrow",
    halign: "end",
    valign: "center",
    onClicked: () => {
      QSMenu.toggle(menu);
      if (toggleOn) toggleOn();
    },
    connections: [
      [
        QSMenu,
        (button) => {
          button.toggleClassName("opened", QSMenu.opened === menu);
        },
      ],
    ],
    child: Icon({
      className: "icon",
      icon: "pan-end-symbolic",
      properties: [
        ["deg", 0],
        ["opened", false],
      ],
      connections: [
        [
          QSMenu,
          (icon) => {
            if (
              (QSMenu.opened === menu && !icon._opened) ||
              (QSMenu.opened !== menu && icon._opened)
            ) {
              const step = QSMenu.opened === menu ? 10 : -10;
              icon._opened = !icon._opened;
              for (let i = 0; i < 9; ++i) {
                timeout(5 * i, () => {
                  icon._deg += step;
                  icon.setStyle(
                    `-gtk-icon-transform: rotate(${icon._deg}deg);`,
                  );
                });
              }
            }
          },
        ],
      ],
    }),
  });

const RevealerMenu = (name, child) =>
  Box({
    children: [
      Revealer({
        transition: "slide_down",
        connections: [
          [QSMenu, (r) => (r.reveal_child = name === QSMenu.opened)],
        ],
        child,
      }),
    ],
  });

const SysButton = (icon, action, className = "") =>
  Button({
    className,
    hexpand: true,
    onClicked: () => Service.System.action(action),
    tooltipText: action,
    child: Icon(icon),
  });

const VolumeBox = () =>
  Box({
    vertical: true,
    className: "volume-box",
    children: [
      Box({
        className: "volume",
        children: [
          Button({
            className: "speakertype",
            child: audio.SpeakerTypeIndicator(),
            onClicked: "pactl set-sink-mute @DEFAULT_SINK@ toggle",
          }),
          audio.SpeakerSlider({ hexpand: true }),
          // audio.SpeakerPercentLabel(),
          Arrow("stream-selector"),
        ],
      }),
      RevealerMenu(
        "stream-selector",
        Box({
          vertical: true,
          className: "menu",
          children: [
            audio.StreamSelector(),
            Separator(),
            Button({
              onClicked: () => {
                execAsync("pavucontrol").catch(print);
                App.closeWindow("quicksettings");
              },
              child: Label({
                label: "Settings",
                xalign: 0,
              }),
            }),
          ],
        }),
      ),
    ],
  });

const BrightnessBox = () =>
  Box({
    className: "brightness",
    children: [
      Button({
        onClicked: () => {
          execAsync("wl-gammactl").catch(print);
          App.closeWindow("quicksettings");
        },
        child: brightness.Indicator(),
      }),
      brightness.BrightnessSlider(),
      // brightness.PercentLabel(),
    ],
  });

const ArrowToggle = ({ icon, label, connection, toggle, name, toggleOn }) =>
  Overlay({
    connections: [
      [
        connection.service,
        (w) => w.toggleClassName("active", connection.callback()),
      ],
    ],
    child: Button({
      className: `toggle-arrow ${name}`,
      // hexpand: true,
      onClicked: toggle,
      child: Box({
        children: [icon, label],
      }),
    }),
    overlays: [Arrow(name, toggleOn)],
  });

const NetworkToggle = () =>
  ArrowToggle({
    icon: network.WifiIndicator(),
    label: Box({
      vertical: true,
      valign: "center",
      children: [
        Label({ label: "Wi-Fi", className: "label", halign: "start" }),
        network.SSIDLabel({ className: "secondlabel", halign: "start" }),
      ],
    }),
    connection: {
      service: Network,
      callback: () => Network.wifi?.enabled,
    },
    toggle: Network.toggleWifi,
    toggleOn: () => {
      Network.wifi.enabled = true;
      Network.wifi.scan();
    },
    name: "network",
  });

const BluetoothToggle = () =>
  ArrowToggle({
    icon: bluetooth.Indicator(),
    label: Box({
      vertical: true,
      valign: "center",
      children: [
        Label({ label: "Bluetooth", className: "label", halign: "start" }),
        bluetooth.ConnectedLabel({ className: "secondlabel", halign: "start" }),
      ],
    }),
    connection: {
      service: Bluetooth,
      callback: () => Bluetooth.enabled,
    },
    toggle: () => (Bluetooth.enabled = !Bluetooth.enabled),
    toggleOn: () => {
      Bluetooth.enabled =
        QSMenu.opened === "bluetooth" ? true : Bluetooth.enabled;
    },
    name: "bluetooth",
  });

// Box({
//   className: "toggle-arrow",
//   connections: [
//     [
//       Powerprofile,
//       (w) =>
//         w.toggleClassName(
//           "active",
//           Powerprofile.powerprofile == "performance"
//         ),
//     ],
//   ],
//   children: [
//     ArrowLabel({
//       menu: "powerprofile",
//       label: Box({
//         hexpand: true,
//         children: [
//           Icon("speedometer-symbolic"),
//           powerprofile.PowerModeLabel(),
//         ],
//       }),
//     }),
//   ],
// });

const SmallToggle = (toggle, indicator) =>
  toggle({
    className: "toggle",
    halign: "fill",
    hexpand: true,
    vexpand: true,
    child: indicator({ halign: "center" }),
  });

const SmallToggleLabel = (toggle, indicator, label) =>
  toggle({
    className: "toggle",
    halign: "fill",
    hexpand: true,
    vexpand: true,
    child: Box({
      children: [indicator(), label()],
    }),
  });

const MuteToggle = () =>
  SmallToggleLabel(
    audio.MicrophoneMuteToggle,
    audio.MicrophoneMuteIndicator,
    audio.MicrophoneStatus,
  );

const PowerprofileToggle = () =>
  Box({
    className: "power-profile",
    connections: [
      [
        PowerProfile,
        (box) => {
          box.toggleClassName(
            "performance",
            PowerProfile.powerprofile == "performance",
          );
          box.toggleClassName(
            "power-saver",
            PowerProfile.powerprofile == "power-saver",
          );
          box.toggleClassName(
            "balanced",
            PowerProfile.powerprofile == "balanced",
          );
        },
      ],
    ],
    children: [
      Button({
        className: "toggle",
        hexpand: true,
        onClicked: () => QSMenu.toggle("power-profile"),
        child: powerprofile.PowerprofileIndicator(),
        tooltipText: "Power Profile",
        connections: [
          [
            QSMenu,
            (w) => w.toggleClassName("on", QSMenu.opened === "power-profile"),
          ],
        ],
      }),
    ],
  });

const AppmixerToggle = () =>
  Button({
    className: "toggle app-mixer",
    hexpand: true,
    onClicked: () => QSMenu.toggle("app-mixer"),
    child: FontIcon({ icon: "", halign: "center" }),
    tooltipText: "App Mixer",
    connections: [
      [QSMenu, (w) => w.toggleClassName("on", QSMenu.opened === "app-mixer")],
    ],
  });

const Submenu = ({ menuName, icon, title, contentType }) =>
  RevealerMenu(
    menuName,
    Box({
      vertical: true,
      className: `submenu ${menuName}`,
      children: [
        Box({ className: "title", children: [icon, Label(title)] }),
        Separator(),
        contentType({ className: "content", hexpand: true }),
      ],
    }),
  );

const Powerprofilemenu = () =>
  Submenu({
    menuName: "power-profile",
    icon: powerprofile.PowerprofileIndicator(),
    title: "Power Profile",
    contentType: powerprofile.PowerProfileSelection,
  });

const Appmixer = () =>
  Submenu({
    menuName: "app-mixer",
    icon: FontIcon({ icon: "" }),
    title: "App Mixer",
    contentType: audio.AppMixer,
  });

const NetworkSelection = () =>
  Submenu({
    menuName: "network",
    icon: Icon("network-wireless-symbolic"),
    title: "Wireless Networks",
    contentType: network.WifiSelection,
  });

const BluetoothSelection = () =>
  Submenu({
    menuName: "bluetooth",
    icon: Icon("bluetooth-symbolic"),
    title: "Bluetooth",
    contentType: bluetooth.Devices,
  });

const PowerModeSelection = () =>
  Submenu({
    menuName: "powerprofile",
    icon: Icon("speedometer-symbolic"),
    title: "Power Mode",
    contentType: powerprofile.PowerProfileSelection,
  });

const PopUpContent = () =>
  Box({
    className: "quicksettings__popup",
    vertical: true,
    hexpand: false,
    children: [
      NetworkToggle(),
      BluetoothToggle(),
      // PowerProfileToggle(),
      Separator(),
      VolumeBox(),
      BrightnessBox(),
      Separator(),
      Box({
        className: "sysbutton-box",
        children: [
          AppmixerToggle(),
          Button({
            className: "shutdown",
            onClicked: () => {
              App.closeWindow("quicksettings");
              App.toggleWindow("powermenu");
            },
            connections: [
              [
                App,
                (btn, win, visible) => {
                  if (win === "powermenu" || win === "verification")
                    btn.toggleClassName("active", visible);
                },
              ],
            ],
            hexpand: true,
            tooltipText: "Power Menu",
            child: Icon("system-shutdown-symbolic"),
          }),
          PowerprofileToggle(),
        ],
      }),
      Powerprofilemenu(),
      Appmixer(),
      NetworkSelection(),
      BluetoothSelection(),
      PowerModeSelection(),
    ],
  });

export default ({ anchor = "top right", layout = "top right" } = {}) =>
  PopupWindow({
    name: "quicksettings",
    layout,
    anchor,
    content: PopUpContent(),
  });
