import { Clock } from "./datemenu.js";
const { Button } = ags.Widget;

export default () =>
  Button({
    className: "datemenu__panel panel-button",
    connections: [
      [
        ags.App,
        (btn, win, visible) => {
          btn.toggleClassName("active", win === "datemenu" && visible);
        },
      ],
    ],

    onClicked: () => ags.App.toggleWindow("datemenu"),
    child: Clock({ format: "%H:%M  %a, %e %b" }),
  });
