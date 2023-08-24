import { Clock, Uptime } from "../modules/clock.js";
const { Button, Box, Label } = ags.Widget;
const { App } = ags;

export const PanelButton = ({ format = "%H:%M  %a, %e %b" } = {}) =>
  Button({
    className: "datemenu__panel panel-button",
    onClicked: () => App.toggleWindow("datemenu"),
    connections: [
      [
        App,
        (btn, win, visible) => {
          btn.toggleClassName("active", win === "datemenu" && visible);
        },
      ],
    ],
    child: Clock({
      format,
      justification: "center",
    }),
  });

export const PopUpContent = () =>
  Box({
    className: "datemenu__popup",
    vertical: true,
    children: [
      Clock({ className: "clock", format: "%H:%M:%S" }),
      Clock({ className: "date", format: "%A, %e %B %Y" }),
      Box({
        halign: "center",
        children: [Label({ label: "Uptime: " }), Uptime()],
      }),
      Box({
        className: "calendar",
        children: [
          ags.Widget({
            type: imports.gi.Gtk.Calendar,
          }),
        ],
      }),
      // Gtk.Calendar(),
    ],
  });
