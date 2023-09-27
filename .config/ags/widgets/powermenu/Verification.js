import PowerMenu from "../services/powermenu.js";
import PopupWindow from "../misc/PopupWindow.js";

const { Label, Box, Button } = ags.Widget;

export default () =>
  PopupWindow({
    name: "verification",
    expand: true,
    content: Box({
      className: "verification",
      vertical: true,
      children: [
        Label({
          className: "title",
          connections: [
            [
              PowerMenu,
              (label) => {
                label.label = PowerMenu.instance.title || "";
              },
            ],
          ],
        }),
        Label({
          className: "desc",
          label: "Are you sure?",
        }),
        Box({
          className: "buttons",
          vexpand: true,
          valign: "end",
          homogeneous: true,
          children: [
            Button({
              className: "no",
              child: Label("No"),
              onClicked: () => ags.App.toggleWindow("verification"),
            }),
            Button({
              className: "yes",
              child: Label("Yes"),
              onClicked: () => ags.Utils.exec(PowerMenu.instance.cmd),
            }),
          ],
        }),
      ],
    }),
  });
