import { App, Notifications, Widget } from "../../imports.js";

const DNDIndicator = ({
  silent = Widget.Icon({ icon: "notifications-disabled-symbolic" }),
  noisy = Widget.Icon("notification-symbolic"),
} = {}) =>
  Widget.Stack({
    children: {
      true: silent,
      false: noisy,
    },
    setup: (self) => self.bind("shown", Notifications, "dnd", (v) => `${v}`),
  });

export default () =>
  Widget.Button({
    className: "notifications__panel panel-button",
    setup: (self) =>
      self.hook(App, (btn, win, visible) => {
        btn.toggleClassName("active", win === "notification-center" && visible);
      }),
    onClicked: () => App.toggleWindow("notification-center"),
    child: DNDIndicator(),
  });
