import { cpu, ram, configs, clock } from "../../vars.js";
import GLib from "gi://GLib";

const CpuProgress = () =>
  Widget.Box({
    class_name: "cpu-box",
    spacing: 4,
    children: [
      Widget.CircularProgress({
        class_name: "progress",
        value: cpu.bind(),
        child: Widget.Box({
          vertical: true,
          children: [Widget.Icon("applications-electronics-symbolic")],
        }),
      }),
      Widget.Box({
        vertical: true,
        vpack: "center",
        children: [
          Widget.Label({
            class_name: "label",
            label: "CPU:",
            hpack: "start",
          }),
          Widget.Label({
            class_name: "value",
            label: cpu.bind().as((v) => `${(v * 100).toFixed(1)}%`),
          }),
        ],
      }),
    ],
  });

const RamProgress = () =>
  Widget.Box({
    spacing: 4,
    children: [
      Widget.CircularProgress({
        class_name: "progress",
        value: ram.bind(),
        child: Widget.Box({
          vertical: true,
          children: [Widget.Icon("nvidia-ram-symbolic")],
        }),
      }),
      Widget.Box({
        vertical: true,
        vpack: "center",
        children: [
          Widget.Label({
            class_name: "label",
            label: "RAM:",
            hpack: "start",
          }),
          Widget.Label({
            class_name: "value",
            label: ram.bind().as((v) => `${(v * 100).toFixed(1)}%`),
          }),
        ],
      }),
    ],
  });

const CpuAndRam = () =>
  Widget.Box({
    children: [CpuProgress(), RamProgress()],
  });

const Hari = () =>
  Widget.Label({
    class_name: "day",
    hpack: "start",
    label: clock.bind().as((t) => t.format("%A").toUpperCase()),
  });

const Tanggal = () =>
  Widget.Box({
    vpack: "end",
    hpack: "end",
    children: [
      Widget.Label({
        class_name: "day-number",
        label: clock.bind().as((t) => t.format("%d") + " "),
        vpack: "end",
      }),
      Widget.Label({
        class_name: "month",
        vpack: "end",
        label: clock.bind().as((t) => t.format("%B")),
      }),
    ],
  });

const Date = () =>
  Widget.Overlay({
    child: Hari(),
    overlays: [Tanggal()],
  });

const DayDots = () =>
  Widget.Box({
    class_name: "day-dots",
    spacing: 8,
    hpack: "center",
    setup: (self) => {
      const t = GLib.DateTime.new_now_local();
      const format = Number(t.format("%u"));
      const last = 7 - format;
      self.children = [
        ...Array(format)
          .fill()
          .map(() => Widget.Box({ class_name: "fill" })),
        ...Array(last)
          .fill()
          .map(() => Widget.Box({ class_name: "empty" })),
      ];
    },
  });

const Container = () =>
  Widget.Box({
    class_name: "system-monitor__container",
    vertical: true,
    spacing: 8,
    children: [Date(), DayDots(), Widget.Separator(), CpuAndRam()],
  });

export default () =>
  Widget.Window({
    name: "system-monitor__window",
    anchor: ["bottom", "left"],
    layer: "bottom",
    child: Container(),
  });
