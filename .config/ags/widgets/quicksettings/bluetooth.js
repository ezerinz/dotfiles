import { Spinner } from "../misc/misc.js";
import { Bluetooth, Widget } from "../../imports.js";
import Gtk from "gi://Gtk";

export const Indicator = ({
  enabled = Widget.Icon({
    icon: "bluetooth-active-symbolic",
    className: "enabled",
  }),
  disabled = Widget.Icon({
    icon: "bluetooth-disabled-symbolic",
    className: "disabled",
  }),
  ...props
} = {}) =>
  Widget.Stack({
    ...props,
    children: {
      true: enabled,
      false: disabled,
    },
    setup: (self) => self.bind("shown", Bluetooth, "enabled", (v) => `${v}`),
  });

export const Toggle = (props) =>
  Widget.Button({
    ...props,
    onClicked: () => (Bluetooth.enabled = !Bluetooth.enabled),
    setup: (self) =>
      self.hook(Bluetooth, (button) =>
        button.toggleClassName("on", Bluetooth.enabled),
      ),
  });

export const ConnectedLabel = (props) =>
  Widget.Label({
    ...props,
    setup: (self) =>
      self.hook(Bluetooth, (label) => {
        if (!Bluetooth.enabled) return (label.label = "Disabled");

        if (Bluetooth.connectedDevices.size === 0)
          return (label.label = "Not Connected");

        if (Bluetooth.connectedDevices.size === 1)
          return (label.label = Bluetooth.connectedDevices
            .entries()
            .next().value[1].alias);

        label.label = `${Bluetooth.connectedDevices.size} Connected`;
      }),
  });

export const Devices = (props) =>
  Widget.Box({
    ...props,
    vertical: true,
    setup: (self) =>
      self.hook(Bluetooth, (box) => {
        box.children = Array.from(Bluetooth.devices.values()).map((device) =>
          Widget.Box({
            hexpand: false,
            children: [
              Widget.Icon(device.iconName + "-symbolic"),
              Widget.Label(device.name),
              Widget.Box({ hexpand: true }),
              device._connecting
                ? Spinner()
                : Widget({
                  type: Gtk.Switch,
                  active: device.connected,
                  setup: (self) =>
                    self.on("activate", ({ active }) => {
                      device.setConnection(active);
                    }),
                }),
            ],
          }),
        );
      }),
  });
