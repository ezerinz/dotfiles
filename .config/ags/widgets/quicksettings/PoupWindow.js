import { Separator } from "../misc/misc.js";
import FontIcon from "../misc/FontIcon.js";
import * as audio from "./audio.js";
import * as brightness from "./brightness.js";
import * as network from "./network.js";
import * as bluetooth from "./bluetooth.js";
import * as powerprofile from "./powerprofile.js";
import PowerProfile from "../services/powerProfile.js";
import PopupWindow from "../misc/PopupWindow.js";
import {
  Widget,
  Service,
  App,
  Utils,
  Network,
  Bluetooth,
} from "../../imports.js";
import QSMenu from "../services/qsMenu.js";

const Arrow = (menu, toggleOn) =>
  Widget.Button({
    className: "arrow",
    hpack: "end",
    vpack: "center",
    onClicked: () => {
      QSMenu.toggle(menu);
      if (toggleOn) toggleOn();
    },
    setup: (self) =>
      self.hook(QSMenu, (button) => {
        button.toggleClassName("opened", QSMenu.opened === menu);
      }),
    child: Widget.Icon({
      className: "icon",
      icon: "pan-end-symbolic",
      attribute: [
        ["deg", 0],
        ["opened", false],
      ],
      setup: (self) =>
        self.hook(
          QSMenu,

          (icon) => {
            if (
              (QSMenu.opened === menu && !icon._opened) ||
              (QSMenu.opened !== menu && icon._opened)
            ) {
              const step = QSMenu.opened === menu ? 10 : -10;
              icon._opened = !icon._opened;
              for (let i = 0; i < 9; ++i) {
                Utils.timeout(5 * i, () => {
                  icon._deg += step;
                  icon.setCss(`-gtk-icon-transform: rotate(${icon._deg}deg);`);
                });
              }
            }
          },
        ),
    }),
  });

const RevealerMenu = (name, child) =>
  Widget.Box({
    children: [
      Widget.Revealer({
        transition: "slide_down",
        setup: (self) =>
          self.hook(QSMenu, (r) => (r.reveal_child = name === QSMenu.opened)),
        child,
      }),
    ],
  });

const SysButton = (icon, action, className = "") =>
  Widget.Button({
    className,
    hexpand: true,
    onClicked: () => Service.System.action(action),
    tooltipText: action,
    child: Widget.Icon(icon),
  });

const VolumeBox = () =>
  Widget.Box({
    vertical: true,
    className: "volume-box",
    children: [
      Widget.Box({
        className: "volume",
        children: [
          Widget.Button({
            className: "speakertype",
            child: audio.SpeakerTypeIndicator(),
            onClicked: () => {
              Utils.execAsync("pactl set-sink-mute @DEFAULT_SINK@ toggle");
            },
          }),
          audio.SpeakerSlider({ hexpand: true }),
          // audio.SpeakerPercentLabel(),
          Arrow("stream-selector"),
        ],
      }),
      RevealerMenu(
        "stream-selector",
        Widget.Box({
          vertical: true,
          className: "menu",
          children: [
            audio.StreamSelector(),
            Separator(),
            Widget.Button({
              onClicked: () => {
                Utils.execAsync("pavucontrol").catch(print);
                App.closeWindow("quicksettings");
              },
              child: Widget.Label({
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
  Widget.Box({
    className: "brightness",
    children: [
      Widget.Button({
        onClicked: () => {
          Utils.execAsync("wl-gammactl").catch(print);
          App.closeWindow("quicksettings");
        },
        child: brightness.Indicator(),
      }),
      brightness.BrightnessSlider(),
    ],
  });

const ArrowToggle = ({ icon, label, connection, toggle, name, toggleOn }) =>
  Widget.Overlay({
    setup: (self) =>
      self.hook(connection.service, (w) =>
        w.toggleClassName("active", connection.callback()),
      ),
    child: Widget.Button({
      className: `toggle-arrow ${name}`,
      onClicked: toggle,
      child: Widget.Box({
        children: [icon, label],
      }),
    }),
    overlays: [Arrow(name, toggleOn)],
  });

const NetworkToggle = () =>
  ArrowToggle({
    icon: network.WifiIndicator(),
    label: Widget.Box({
      vertical: true,
      vpack: "center",
      children: [
        Widget.Label({ label: "Wi-Fi", className: "label", hpack: "start" }),
        network.SSIDLabel({ className: "secondlabel", hpack: "start" }),
      ],
    }),
    connection: {
      service: Network,
      callback: () => Network.wifi?.enabled,
    },
    toggle: () => {
      if (Network.wifi?.enabled == true) {
        Network.wifi.enabled = false;
      } else {
        Network.wifi.enabled = true;
      }
    },
    toggleOn: () => {
      Network.wifi.enabled = true;
      Network.wifi.scan();
    },
    name: "network",
  });

const BluetoothToggle = () =>
  ArrowToggle({
    icon: bluetooth.Indicator(),
    label: Widget.Box({
      vertical: true,
      vpack: "center",
      children: [
        Widget.Label({
          label: "Bluetooth",
          className: "label",
          hpack: "start",
        }),
        bluetooth.ConnectedLabel({ className: "secondlabel", hpack: "start" }),
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
    hpack: "fill",
    hexpand: true,
    vexpand: true,
    child: Widget.Box({
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
  Widget.Box({
    className: "power-profile",
    setup: (self) =>
      self.hook(
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
      ),
    children: [
      Widget.Button({
        className: "toggle",
        hexpand: true,
        onClicked: () => QSMenu.toggle("power-profile"),
        child: powerprofile.PowerprofileIndicator(),
        tooltipText: "Power Profile",
        setup: (self) =>
          self.hook(QSMenu, (w) =>
            w.toggleClassName("on", QSMenu.opened === "power-profile"),
          ),
      }),
    ],
  });

const AppmixerToggle = () =>
  Widget.Button({
    className: "toggle app-mixer",
    hexpand: true,
    onClicked: () => QSMenu.toggle("app-mixer"),
    child: FontIcon({ icon: "", halign: "center" }),
    tooltipText: "App Mixer",
    setup: (self) =>
      self.hook(QSMenu, (w) =>
        w.toggleClassName("on", QSMenu.opened === "app-mixer"),
      ),
  });

const Submenu = ({ menuName, icon, title, contentType }) =>
  RevealerMenu(
    menuName,
    Widget.Box({
      vertical: true,
      className: `submenu ${menuName}`,
      children: [
        Widget.Box({
          className: "title",
          children: [icon, Widget.Label(title)],
        }),
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
    icon: Widget.Icon("network-wireless-symbolic"),
    title: "Wireless Networks",
    contentType: network.WifiSelection,
  });

const BluetoothSelection = () =>
  Submenu({
    menuName: "bluetooth",
    icon: Widget.Icon("bluetooth-symbolic"),
    title: "Bluetooth",
    contentType: bluetooth.Devices,
  });

const PowerModeSelection = () =>
  Submenu({
    menuName: "powerprofile",
    icon: Widget.Icon("speedometer-symbolic"),
    title: "Power Mode",
    contentType: powerprofile.PowerProfileSelection,
  });

const PopUpContent = () =>
  Widget.Box({
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
      Widget.Box({
        className: "sysbutton-box",
        children: [
          AppmixerToggle(),
          Widget.Button({
            className: "shutdown",
            onClicked: () => {
              App.closeWindow("quicksettings");
              App.toggleWindow("powermenu");
            },

            setup: (self) =>
              self.hook(App, (btn, win, visible) => {
                if (win === "powermenu" || win === "verification")
                  btn.toggleClassName("active", visible);
              }),
            hexpand: true,
            tooltipText: "Power Menu",
            child: Widget.Icon("system-shutdown-symbolic"),
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

export default ({ anchor = ["top", "right"], layout = "top right" } = {}) =>
  PopupWindow({
    name: "quicksettings",
    // layout,
    anchor,
    child: PopUpContent(),
  });
