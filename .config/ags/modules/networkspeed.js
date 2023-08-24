const { Label, Box } = ags.Widget;
const { exec } = ags.Utils;

// bro I don't even know what I'm doing
// I'm just copy paste things
// feel free to fix this if something wrong

let lastTotalDownBytes = 0;
let lastTotalUpBytes = 0;

const NetworkSpeed = ({ interval = 1000, ...props } = {}) =>
  Label({
    ...props,
    className: "speed",
    connections: [
      [
        interval,
        (label) => {
          const content = exec("cat /proc/net/dev");
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
          let speed =
            downloadSpeed >= uploadSpeed ? downloadSpeed : uploadSpeed;
          const unit = downloadSpeed >= uploadSpeed ? "" : "";
          label.label = (speed / 1000).toFixed(2) + unit;
          lastTotalDownBytes = totalDownBytes;
          lastTotalUpBytes = totalUpBytes;
        },
      ],
    ],
  });

export const NetworkSpeedContainer = () =>
  Box({
    className: "network-speed",
    vertical: true,
    children: [NetworkSpeed(), Label({ label: "MB/s", className: "unit" })],
  });
