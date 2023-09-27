const { Hyprland } = ags.Service;
const { Box, Button, EventBox, Label } = ags.Widget;
const { execAsync } = ags.Utils;

export const Workspaces = ({ fixed = 7, indicator, ...props } = {}) =>
  Box({
    ...props,
    children: Array.from({ length: fixed }, (_, i) => i + 1).map((i) =>
      Button({
        onClicked: () =>
          execAsync(`hyprctl dispatch workspace ${i}`).catch(print),
        child: indicator ? indicator() : Label(`${i}`),
        connections: [
          [
            Hyprland,
            (btn) => {
              const { active } = Hyprland;
              const occupied = Hyprland.getWorkspace(i)?.windows > 0;

              btn.toggleClassName("active", active.workspace.id === i);
              btn.toggleClassName("occupied", occupied);
              btn.toggleClassName("empty", !occupied);
            },
          ],
        ],
      })
    ),
  });

export default (props) =>
  Box({
    ...props,
    className: "workspaces__panel panel-button",
    children: [
      Box({
        children: [
          EventBox({
            className: "eventbox",
            child: Workspaces({
              indicator: () =>
                Box({
                  className: "indicator",
                  valign: "center",
                  children: [Box({ className: "fill" })],
                }),
            }),
          }),
        ],
      }),
    ],
  });
