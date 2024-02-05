import { Hyprland, Widget, Utils } from "../../imports.js";

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
    setup: (self) =>
      self.hook(Hyprland, (btn) => {
        const { active } = Hyprland;
        const occupied = Hyprland.getWorkspace(i.id)?.windows > 0;

        btn.toggleClassName("active", active.workspace.id === i.id);
        btn.toggleClassName("occupied", occupied);
        btn.toggleClassName("empty", !occupied);
      }),
  });

const Workspaces = ({ ...props } = {}) =>
  Widget.Box({
    ...props,
    setup: (self) =>
      self.bind("children", Hyprland, "workspaces", (ws) => {
        const children = ws.map(WsButton);
        return children;
      }),
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
        setup: (self) =>
          self.hook(Hyprland, (box) => {
            const activeId = Hyprland.active.workspace.id;
            const occupied = Hyprland.getWorkspace(activeId)?.windows > 0;
            const ws = Hyprland.workspaces;

            if (occupied) {
              box.children = [WsButton({ id: ws[ws.length - 1].id + 1 })];
            } else {
              box.children = [];
            }
          }),
      }),
    ],
  });
