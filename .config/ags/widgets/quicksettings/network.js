const { Network } = ags.Service;
const { exec } = ags.Utils;
const { Label, Icon, Box, Stack, Button } = ags.Widget;

export const SSIDLabel = (props) =>
  Label({
    ...props,
    connections: [
      [
        Network,
        (label) => (label.label = Network.wifi?.ssid || "Not Connected"),
      ],
    ],
  });

export const WifiStrengthLabel = (props) =>
  Label({
    ...props,
    connections: [
      [Network, (label) => (label.label = `${Network.wifi?.strength || -1}`)],
    ],
  });

export const WiredIndicator = ({
  connecting = Icon("network-wired-acquiring-symbolic"),
  disconnected = Icon("network-wired-no-route-symbolic"),
  disabled = Icon("network-wired-disconnected-symbolic"),
  connected = Icon("network-wired-symbolic"),
  unknown = Icon("content-loading-symbolic"),
} = {}) =>
  Stack({
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
  disabled = Icon("network-wireless-disabled-symbolic"),
  disconnected = Icon("network-wireless-offline-symbolic"),
  connecting = Icon("network-wireless-acquiring-symbolic"),
  connected = [
    ["80", Icon("network-wireless-signal-excellent-symbolic")],
    ["60", Icon("network-wireless-signal-good-symbolic")],
    ["40", Icon("network-wireless-signal-ok-symbolic")],
    ["20", Icon("network-wireless-signal-weak-symbolic")],
    ["0", Icon("network-wireless-signal-none-symbolic")],
  ],
} = {}) =>
  Stack({
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
  wired = WifiIndicator(),
} = {}) =>
  Stack({
    className: "network",
    items: [
      ["wired", wired],
      ["wifi", wifi],
    ],
    connections: [
      [
        Network,
        (stack) => {
          stack.shown = Network.primary || "wifi";
        },
      ],
    ],
  });

export const WifiToggle = (props) =>
  Button({
    ...props,
    onClicked: Network.toggleWifi,
    connections: [
      [
        Network,
        (button) => {
          button.toggleClassName("on", Network.wifi?.enabled);
        },
      ],
    ],
  });

const icons = [
  { value: 80, icon: "network-wireless-signal-excellent-symbolic" },
  { value: 60, icon: "network-wireless-signal-good-symbolic" },
  { value: 40, icon: "network-wireless-signal-ok-symbolic" },
  { value: 20, icon: "network-wireless-signal-weak-symbolic" },
  { value: 0, icon: "network-wireless-signal-none-symbolic" },
];

export const WifiSelection = (props) =>
  Box({
    ...props,
    vertical: true,
    connections: [
      [
        Network,
        (box) =>
          (box.children = Network.wifi?.accessPoints.map((ap) =>
            Button({
              onClicked: `nmcli device wifi connect ${ap.bssid}`,
              child: Box({
                children: [
                  Icon(icons.find(({ value }) => value <= ap.strength).icon),
                  Label(ap.ssid),
                  ap.active &&
                    Icon({
                      icon: "object-select-symbolic",
                      hexpand: true,
                      halign: "end",
                    }),
                ],
              }),
            })
          )),
      ],
    ],
  });

// bro I don't even know what I'm doing
// I'm just copy paste things
// feel free to fix this if something wrong
var interval = 1000;
var lastTotalDownBytes = 0;
var lastTotalUpBytes = 0;
const NetworkSpeedVariables = ags.Variable("0", {
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

      if (lastTotalDownBytes === 0) {
        lastTotalDownBytes = totalDownBytes;
      }
      if (lastTotalUpBytes === 0) {
        lastTotalUpBytes = totalUpBytes;
      }
      let downloadSpeed = (totalDownBytes - lastTotalDownBytes) / interval;
      let uploadSpeed = (totalUpBytes - lastTotalUpBytes) / interval;
      let speed = downloadSpeed >= uploadSpeed ? downloadSpeed : uploadSpeed;
      const unit = downloadSpeed >= uploadSpeed ? "" : "";
      lastTotalDownBytes = totalDownBytes;
      lastTotalUpBytes = totalUpBytes;
      return (speed / 1000).toFixed(2) + unit;
    },
  ],
});

const NetworkSpeed = ({ interval = 1000, ...props } = {}) => {
  return Label({
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
    // connections: [
    //   [
    //     interval,
    //     (label) => {
    //       const content = exec("cat /proc/net/dev");
    //       const lines = content.split("\n");
    //
    //       // Caculate the sum of all interfaces' traffic line by line.
    //       let totalDownBytes = 0;
    //       let totalUpBytes = 0;
    //
    //       for (let i = 0; i < lines.length; ++i) {
    //         const fields = lines[i].trim().split(/\W+/);
    //         if (fields.length <= 2) {
    //           continue;
    //         }
    //
    //         // Skip virtual interfaces.
    //         const interfce = fields[0];
    //         const currentInterfaceDownBytes = Number.parseInt(fields[1]);
    //         const currentInterfaceUpBytes = Number.parseInt(fields[9]);
    //         if (
    //           interfce === "lo" ||
    //           // Created by python-based bandwidth manager "traffictoll".
    //           interfce.match(/^ifb[0-9]+/) ||
    //           // Created by lxd container manager.
    //           interfce.match(/^lxdbr[0-9]+/) ||
    //           interfce.match(/^virbr[0-9]+/) ||
    //           interfce.match(/^br[0-9]+/) ||
    //           interfce.match(/^vnet[0-9]+/) ||
    //           interfce.match(/^tun[0-9]+/) ||
    //           interfce.match(/^tap[0-9]+/) ||
    //           isNaN(currentInterfaceDownBytes) ||
    //           isNaN(currentInterfaceUpBytes)
    //         ) {
    //           continue;
    //         }
    //
    //         totalDownBytes += currentInterfaceDownBytes;
    //         totalUpBytes += currentInterfaceUpBytes;
    //       }
    //
    //       if (lastTotalDownBytes === 0) {
    //         lastTotalDownBytes = totalDownBytes;
    //       }
    //       if (lastTotalUpBytes === 0) {
    //         lastTotalUpBytes = totalUpBytes;
    //       }
    //       let downloadSpeed = (totalDownBytes - lastTotalDownBytes) / interval;
    //       let uploadSpeed = (totalUpBytes - lastTotalUpBytes) / interval;
    //       let speed =
    //         downloadSpeed >= uploadSpeed ? downloadSpeed : uploadSpeed;
    //       const unit = downloadSpeed >= uploadSpeed ? "" : "";
    //       label.label = (speed / 1000).toFixed(2) + unit;
    //       lastTotalDownBytes = totalDownBytes;
    //       lastTotalUpBytes = totalUpBytes;
    //     },
    //   ],
    // ],
  });
};

export const SpeedIndicator = () =>
  Box({
    className: "network-speed",
    vertical: true,
    children: [NetworkSpeed(), Label({ label: "MB/s", className: "unit" })],
  });
