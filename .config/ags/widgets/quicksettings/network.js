import { Widget, Network, Variable, Utils } from "../../imports.js";

export const SSIDLabel = (props) =>
  Widget.Label({
    ...props,
    connections: [
      [
        Network,
        (label) => {
          label.label = Network.wifi?.ssid || "";
          label.visible = Network.wifi.enabled;
        },
      ],
    ],
  });

export const WifiStrengthLabel = (props) =>
  Widget.Label({
    ...props,
    connections: [
      [Network, (label) => (label.label = `${Network.wifi?.strength || -1}`)],
    ],
  });

export const WiredIndicator = ({
  connecting = Widget.Icon("network-wired-acquiring-symbolic"),
  disconnected = Widget.Icon("network-wired-no-route-symbolic"),
  disabled = Widget.Icon("network-wired-disconnected-symbolic"),
  connected = Widget.Icon("network-wired-symbolic"),
  unknown = Widget.Icon("content-loading-symbolic"),
} = {}) =>
  Widget.Stack({
    items: [
      ["unknown", unknown],
      ["disconnected", disconnected],
      ["disabled", disabled],
      ["connected", connected],
      ["connecting", connecting],
    ],
    connections: [
      [
        Network,
        (stack) => {
          if (!Network.wired) return;

          const { internet } = Network.wired;
          if (internet === "connected" || internet === "connecting")
            return (stack.shown = internet);

          if (Network.connectivity !== "full")
            return (stack.shown = "disconnected");

          return (stack.shown = "disabled");
        },
      ],
    ],
  });

export const WifiIndicator = ({
  disabled = Widget.Icon("network-wireless-disabled-symbolic"),
  disconnected = Widget.Icon("network-wireless-offline-symbolic"),
  connecting = Widget.Icon("network-wireless-acquiring-symbolic"),
  connected = [
    ["80", Widget.Icon("network-wireless-signal-excellent-symbolic")],
    ["60", Widget.Icon("network-wireless-signal-good-symbolic")],
    ["40", Widget.Icon("network-wireless-signal-ok-symbolic")],
    ["20", Widget.Icon("network-wireless-signal-weak-symbolic")],
    ["0", Widget.Icon("network-wireless-signal-none-symbolic")],
  ],
} = {}) =>
  Widget.Stack({
    items: [
      ["disabled", disabled],
      ["disconnected", disconnected],
      ["connecting", connecting],
      ...connected,
    ],
    connections: [
      [
        Network,
        (stack) => {
          if (!Network.wifi) return;

          const { internet, enabled, strength } = Network.wifi;
          if (internet === "connected") {
            for (const threshold of [80, 60, 40, 20, 0]) {
              if (strength >= threshold) return (stack.shown = `${threshold}`);
            }
          }

          if (internet === "connecting") return (stack.shown = "connecting");

          if (enabled) return (stack.shown = "disconnected");

          return (stack.shown = "disabled");
        },
      ],
    ],
  });

export const Indicator = ({
  wifi = WifiIndicator(),
  wired = WiredIndicator(),
} = {}) =>
  Widget.Stack({
    className: "network",
    items: [
      ["wired", wired],
      ["wifi", wifi],
    ],
    binds: [["shown", Network, "primary"]],
  });

const icons = [
  { value: 80, icon: "network-wireless-signal-excellent-symbolic" },
  { value: 60, icon: "network-wireless-signal-good-symbolic" },
  { value: 40, icon: "network-wireless-signal-ok-symbolic" },
  { value: 20, icon: "network-wireless-signal-weak-symbolic" },
  { value: 0, icon: "network-wireless-signal-none-symbolic" },
];

export const WifiSelection = (props) =>
  Widget.Box({
    ...props,
    vertical: true,
    connections: [
      [
        Network,
        (box) =>
        (box.children = Network.wifi?.accessPoints.map((ap) =>
          Widget.Button({
            onClicked: () => {
              Utils.execAsync(`nmcli device wifi connect ${ap.bssid}`);
            },
            child: Widget.Box({
              children: [
                Widget.Icon(
                  icons.find(({ value }) => value <= ap.strength).icon,
                ),
                Widget.Label(ap.ssid),
                ap.active &&
                Widget.Icon({
                  icon: "object-select-symbolic",
                  hexpand: true,
                  hpack: "end",
                }),
              ],
            }),
          }),
        )),
      ],
    ],
  });

// bro I don't even know what I'm doing
// I'm just copy paste things
// feel free to fix this if something wrong
const interval = 1000;
const lastTotalDownBytes = Variable(0);
const lastTotalUpBytes = Variable(0);
const NetworkSpeedVariables = Variable("0", {
  poll: [
    interval,
    ["cat", "/proc/net/dev"],
    (content) => {
      const lines = content.split("\n");

      // Caculate the sum of all interfaces' traffic line by line.
      let totalDownBytes = 0;
      let totalUpBytes = 0;

      for (let i = 0; i < lines.length; ++i) {
        const fields = lines[i].trim().split(/\W+/);
        if (fields.length <= 2) {
          continue;
        }

        // Skip virtual interfaces.
        const interfce = fields[0];
        const currentInterfaceDownBytes = Number.parseInt(fields[1]);
        const currentInterfaceUpBytes = Number.parseInt(fields[9]);
        if (
          interfce === "lo" ||
          // Created by python-based bandwidth manager "traffictoll".
          interfce.match(/^ifb[0-9]+/) ||
          // Created by lxd container manager.
          interfce.match(/^lxdbr[0-9]+/) ||
          interfce.match(/^virbr[0-9]+/) ||
          interfce.match(/^br[0-9]+/) ||
          interfce.match(/^vnet[0-9]+/) ||
          interfce.match(/^tun[0-9]+/) ||
          interfce.match(/^tap[0-9]+/) ||
          isNaN(currentInterfaceDownBytes) ||
          isNaN(currentInterfaceUpBytes)
        ) {
          continue;
        }

        totalDownBytes += currentInterfaceDownBytes;
        totalUpBytes += currentInterfaceUpBytes;
      }

      if (lastTotalDownBytes.value === 0) {
        lastTotalDownBytes.setValue(totalDownBytes);
        // lastTotalDownBytes = totalDownBytes;
      }
      if (lastTotalUpBytes.value === 0) {
        lastTotalUpBytes.setValue(totalUpBytes);
      }
      let downloadSpeed =
        (totalDownBytes - lastTotalDownBytes.value) / interval;
      let uploadSpeed = (totalUpBytes - lastTotalUpBytes.value) / interval;
      let speed = downloadSpeed >= uploadSpeed ? downloadSpeed : uploadSpeed;
      const unit = downloadSpeed >= uploadSpeed ? "" : "";
      lastTotalDownBytes.setValue(totalDownBytes);
      lastTotalUpBytes.setValue(totalUpBytes);
      return (speed / 1000).toFixed(2) + unit;
    },
  ],
});

const NetworkSpeed = ({ interval = 1000, ...props } = {}) => {
  return Widget.Label({
    ...props,
    className: "speed",
    connections: [
      [
        NetworkSpeedVariables,
        (label) => {
          label.label = NetworkSpeedVariables.value.toString();
        },
      ],
    ],
  });
};

export const SpeedIndicator = () =>
  Widget.Box({
    className: "network-speed",
    vertical: true,
    children: [
      NetworkSpeed(),
      Widget.Label({ label: "MB/s", className: "unit" }),
    ],
  });
