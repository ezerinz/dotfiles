import { Clock } from "./datemenu.js";
import { Widget, App } from "../../imports.js";

export default () =>
  Widget.Button({
    className: "datemenu__panel panel-button",
    setup: (self) =>
      self.hook(App, (btn, win, visible) => {
        btn.toggleClassName("active", win === "datemenu" && visible);
      }),
    onClicked: () => App.toggleWindow("datemenu"),
    child: Clock({ format: "%H:%M  %a, %e %b" }),
  });
