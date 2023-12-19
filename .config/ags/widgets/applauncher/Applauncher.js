import PopupWindow from "../misc/PopupWindow.js";
import { Separator } from "../misc/misc.js";
import { Widget, App, Applications } from "../../imports.js";

const AppItem = (app, window) =>
  Widget.Button({
    className: "app",
    setup: (self) =>
      self.on("clicked", () => {
        App.closeWindow(window);
        app.launch();
      }),
    child: Widget.Box({
      children: [
        Widget.Icon({
          icon: app.iconName,
          size: 42,
        }),
        Widget.Box({
          vertical: true,
          children: [
            Widget.Label({
              className: "title",
              label: app.name,
              xalign: 0,
              vpack: "center",
              ellipsize: 3,
            }),
            Widget.Label({
              className: "description",
              label: app.description || "",
              wrap: true,
              xalign: 0,
              justification: "left",
              vpack: "center",
            }),
          ],
        }),
      ],
    }),
  });

const Applauncher = ({ windowName = "applauncher" } = {}) => {
  const list = Widget.Box({ className: "listbox", vertical: true });
  const entry = Widget.Entry({
    hexpand: true,
    placeholderText: "Search",
    onAccept: ({ text }) => {
      const list = Applications.query(text);
      if (list[0]) {
        App.toggleWindow(windowName);
        list[0].launch();
      }
    },
    onChange: ({ text }) => {
      list.children = Applications.query(text)
        .map((app) => [Separator(), AppItem(app, windowName)])
        .flat();
      list.add(Separator());
      list.show_all();
    },
  });

  return Widget.Box({
    className: "applauncher",
    attribute: {
      list: list,
    },
    vertical: true,
    children: [
      Widget.Box({
        className: "search-box",
        children: [Widget.Icon("search-symbolic"), entry],
      }),
      Widget.Scrollable({
        hscroll: "never",
        child: list,
      }),
    ],
    setup: (self) =>
      self.hook(App, (_b, name, visible) => {
        if (name !== windowName) return;

        entry.set_text("-"); // force onChange
        entry.set_text("");
        if (visible) entry.grab_focus();
      }),
  });
};

export default () =>
  PopupWindow({
    name: "applauncher",
    content: Applauncher(),
  });
