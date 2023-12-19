import { Widget, Variable } from "../../imports.js";
import GLib from "gi://GLib";

export const Clock = ({
  format = "%H:%M:%S %B %e. %A",
  interval = 1000,
  ...props
} = {}) =>
  Widget.Label({
    className: "clock",
    ...props,
    setup: (self) =>
      self.poll(
        interval,
        (label) => (label.label = GLib.DateTime.new_now_local().format(format)),
      ),
  });

const prettyUptime = (str) => {
  if (str.length >= 4) return str;

  if (str.length === 1) return "0:0" + str;

  if (str.length === 2) return "0:" + str;
};

const uptime = Variable(0, {
  poll: [
    60_000,
    "uptime",
    (line) => prettyUptime(line.split(/\s+/)[2].replace(",", "")),
  ],
});

export const Uptime = ({ ...props } = {}) =>
  Widget.Label({
    ...props,
    setup: (self) =>
      self.hook(uptime, (label) => {
        label.label = uptime.value.toString();
      }),
  });

export const Calendar = () =>
  Widget.Box({
    className: "calendar",
    children: [Widget.Calendar()],
  });
