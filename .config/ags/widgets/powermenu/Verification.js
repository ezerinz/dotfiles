import PowerMenu from "../services/powermenu.js";
import PopupWindow from "../misc/PopupWindow.js";
import { Widget, App, Utils } from "../../imports.js";

export default () =>
  PopupWindow({
    name: "verification",
    expand: true,
    content: Widget.Box({
      className: "verification",
      vertical: true,
      children: [
        Widget.Label({
          className: "title",
          setup: (self) =>
            self.hook(PowerMenu, (label) => {
              label.label = PowerMenu.title || "";
            }),
        }),
        Widget.Label({
          className: "desc",
          label: "Are you sure?",
        }),
        Widget.Box({
          className: "buttons",
          vexpand: true,
          vpack: "end",
          homogeneous: true,
          children: [
            Widget.Button({
              className: "no",
              child: Widget.Label("No"),
              onClicked: () => App.toggleWindow("verification"),
            }),
            Widget.Button({
              className: "yes",
              child: Widget.Label("Yes"),
              onClicked: () => Utils.exec(PowerMenu.cmd),
            }),
          ],
        }),
      ],
    }),
  });
