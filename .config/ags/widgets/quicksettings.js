import { NetworkSpeedContainer } from "../modules/networkspeed.js";
import { FontIcon, HoverRevealer, Separator } from "../modules/misc.js";
import * as battery from "../modules/battery.js";
import * as audio from "../modules/audio.js";
import * as brightness from "../modules/brightness.js";
import * as network from "../modules/network.js";
import * as bluetooth from "../modules/bluetooth.js";
import * as notifications from "../modules/notifications.js";
import * as powerprofile from "../modules/powerprofile.js";
const { Button, Box, Icon, Label, Revealer } = ags.Widget;
const { Service, App } = ags;
const { Bluetooth, Battery, Audio, Network, Powerprofile } = Service;
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
                    `-gtk-icon-transform: rotate(${icon._deg}deg);`
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
            child: audio.SpeakerTypeIndicator(),
            onClicked: "pactl set-sink-mute @DEFAULT_SINK@ toggle",
          }),
          audio.SpeakerSlider({ hexpand: true }),
          audio.SpeakerPercentLabel(),
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
        })
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
      brightness.PercentLabel(),
    ],
  });

const ArrowToggle = ({ icon, label, connection, toggle, name, toggleOn }) =>
  Box({
    connections: [
      [
        connection.service,
        (w) => w.toggleClassName("active", connection.callback()),
      ],
    ],
    className: `arrow toggle ${name}`,
    children: [
      Button({
        hexpand: true,
        className: "box-toggle",
        onClicked: toggle,
        child: Box({
          children: [icon, label],
        }),
      }),
      Arrow(name, toggleOn),
    ],
  });

const NetworkToggle = () =>
  ArrowToggle({
    icon: network.WifiIndicator(),
    label: network.SSIDLabel(),
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
    label: bluetooth.ConnectedLabel(),
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

const ArrowLabel = ({ menu, label }) =>
  Button({
    className: "arrow label",
    onClicked: () => {
      QSMenu.toggle(menu);
    },
    connections: [
      [
        QSMenu,
        (button) => {
          button.toggleClassName("opened", QSMenu.opened === menu);
        },
      ],
    ],
    child: Box({
      children: [
        label,
        Icon({
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
                        `-gtk-icon-transform: rotate(${icon._deg}deg);`
                      );
                    });
                  }
                }
              },
            ],
          ],
        }),
      ],
    }),
  });

const PowerToggle = () =>
  Box({
    className: "toggle power",
    connections: [
      [
        Powerprofile,
        (w) =>
          w.toggleClassName("on", Powerprofile.powerprofile == "performance"),
      ],
    ],
    children: [
      ArrowLabel({
        menu: "powerprofile",
        label: Box({
          hexpand: true,
          children: [
            Icon("speedometer-symbolic"),
            powerprofile.PowerModeLabel(),
          ],
        }),
      }),
    ],
  });

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
    audio.MicrophoneStatus
  );

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
        contentType({ className: "content", hexpand: true }),
      ],
    })
  );

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

export const PopupContent = () =>
  Box({
    className: "quicksettings__popup",
    vertical: true,
    hexpand: false,
    children: [
      VolumeBox(),
      BrightnessBox(),
      Box({
        className: "toggles-box",
        children: [
          Box({
            className: "arrow-toggles",
            children: [
              Box({
                vertical: true,
                children: [NetworkToggle(), BluetoothToggle()],
              }),
              Box({
                vertical: true,
                children: [MuteToggle(), PowerToggle()],
              }),
            ],
          }),
        ],
      }),
      Box({
        className: "sysbutton-box",
        children: [
          AppmixerToggle(),
          SysButton("system-log-out-symbolic", "Log Out", "logout"),
          Button({
            className: "shutdown",
            onClicked: () => {
              App.toggleWindow("quicksettings");
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
        ],
      }),

      Appmixer(),
      NetworkSelection(),
      BluetoothSelection(),
      PowerModeSelection(),
    ],
  });

export const PanelButton = () =>
  Button({
    className: "quicksettings__panel panel-button",
    onClicked: () => App.toggleWindow("quicksettings"),
    onScrollUp: () => {
      Audio.speaker.volume += 0.02;
      Service.Indicator.speaker();
    },
    onScrollDown: () => {
      Audio.speaker.volume -= 0.02;
      Service.Indicator.speaker();
    },
    connections: [
      [
        App,
        (btn, win, visible) => {
          btn.toggleClassName("active", win === "quicksettings" && visible);
        },
      ],
    ],
    child: Box({
      children: [
        NetworkSpeedContainer(),
        audio.SpeakerIndicator(),
        // audio.SpeakerPercentLabel(),
        network.Indicator(),
        network.SSIDLabel(),
        battery.Indicator(),
        battery.LevelLabel(),
      ],
    }),
  });
