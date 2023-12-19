import { Variable, Hyprland, Widget, Utils } from "../../imports.js";

const WsButton = (i) =>
  Widget.Button({
    onClicked: () => {
      Utils.execAsync(`hyprctl dispatch workspace ${i.id}`).catch(print);
    },
    child: Widget.Box({
      className: "indicator",
      vpack: "center",
      children: [Widget.Box({ className: "fill" })],
    }),
    connections: [
      [
        Hyprland,
        (btn) => {
          const { active } = Hyprland;
          const occupied = Hyprland.getWorkspace(i.id)?.windows > 0;

          btn.toggleClassName("active", active.workspace.id === i.id);
          btn.toggleClassName("occupied", occupied);
          btn.toggleClassName("empty", !occupied);
        },
      ],
    ],
  });

const Workspaces = ({ ...props } = {}) =>
  Widget.Box({
    ...props,
    binds: [
      [
        "children",
        Hyprland,
        "workspaces",
        (ws) => {
          const children = ws.map(WsButton);
          const occupied =
            Hyprland.getWorkspace(Hyprland.active.workspace.id)?.windows > 0;

          // if (occupied) {
          //   children.push(
          //     WsButton({
          //       id: Hyprland.workspaces[Hyprland.workspaces.length - 1].id + 1,
          //     }),
          //   );
          // }
          return children;
        },
      ],
    ],
    // connections: [
    //   [
    //     Hyprland,
    //     (box) => {
    //       const ws = Hyprland.workspaces;
    //       const children = ws.map(WsButton);
    //       const activeId = Hyprland.active.workspace.id;
    //       const occupied = Hyprland.getWorkspace(activeId)?.windows > 0;
    //
    //       if (occupied) {
    //         children.push(WsButton({ id: ws.length + 1 }));
    //       }
    //
    //       box.children = children;
    //     },
    //   ],
    // ],
  });

export default (props) =>
  Widget.Box({
    ...props,
    className: "workspaces__panel panel-button",
    children: [
      Widget.Box({
        children: [
          Widget.EventBox({
            className: "eventbox",
            child: Workspaces({}),
          }),
        ],
      }),
      Widget.Box({
        className: "eventbox",
        connections: [
          [
            Hyprland,
            (box) => {
              const activeId = Hyprland.active.workspace.id;
              const occupied = Hyprland.getWorkspace(activeId)?.windows > 0;
              const ws = Hyprland.workspaces;

              if (occupied) {
                box.children = [WsButton({ id: 1000 })];
              } else {
                box.children = [];
              }
            },
          ],
        ],
      }),
    ],
  });
