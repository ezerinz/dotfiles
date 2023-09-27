const { Label, Box } = ags.Widget;
const { DateTime } = imports.gi.GLib;
const { execAsync } = ags.Utils;

export const Clock = ({
  format = "%H:%M:%S %B %e. %A",
  interval = 1000,
  ...props
} = {}) =>
  Label({
    className: "clock",
    ...props,
    connections: [
      [
        interval,
        (label) => (label.label = DateTime.new_now_local().format(format)),
      ],
    ],
  });

const prettyUptime = (str) => {
  if (str.length >= 4) return str;

  if (str.length === 1) return "0:0" + str;

  if (str.length === 2) return "0:" + str;
};

const uptime = ags.Variable(0, {
  poll: [
    60_000,
    "uptime",
    (line) => prettyUptime(line.split(/\s+/)[2].replace(",", "")),
  ],
});

export const Uptime = ({ ...props } = {}) =>
  Label({
    ...props,
    connections: [
      [
        uptime,
        (label) => {
          label.label = uptime.value.toString();
        },
      ],
    ],
  });

export const Calendar = () =>
  Box({
    className: "calendar",
    children: [
      ags.Widget({
        type: imports.gi.Gtk.Calendar,
      }),
    ],
  });
