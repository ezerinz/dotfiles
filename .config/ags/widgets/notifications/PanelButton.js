const { Button, Stack, Icon } = ags.Widget;
const { App } = ags;
const { Notifications } = ags.Service;

const DNDIndicator = ({
  silent = Icon({ icon: "notifications-disabled-symbolic" }),
  noisy = Icon("notification-symbolic"),
} = {}) =>
  Stack({
    items: [
      ["true", silent],
      ["false", noisy],
    ],
    connections: [
      [
        Notifications,
        (stack) => {
          stack.shown = `${Notifications.dnd}`;
        },
      ],
    ],
  });

export default () =>
  Button({
    className: "notifications__panel panel-button",
    connections: [
      [
        App,
        (btn, win, visible) => {
          btn.toggleClassName(
            "active",
            win === "notification-center" && visible
          );
        },
      ],
    ],

    onClicked: () => App.toggleWindow("notification-center"),
    child: DNDIndicator(),
  });
