const hyprland = await Service.import("hyprland");
const dispatch = (ws) => hyprland.messageAsync(`dispatch workspace ${ws}`);

const WorkspaceButton = (ws) =>
  Widget.Button({
    class_name: "workspace-button",
    child: Widget.Box({
      class_name: "fill",
    }),
    onClicked: () => dispatch(ws.id),
    setup: (self) => {
      self.hook(hyprland, () => {
        self.toggleClassName("active", hyprland.active.workspace.id == ws.id);
        self.toggleClassName(
          "occupied",
          hyprland.getWorkspace(ws.id)?.windows > 0,
        );
      });
    },
  });

export default () =>
  Widget.EventBox({
    onScrollUp: () => Utils.exec("hyprnome"),
    onScrollDown: () => Utils.exec("hyprnome --previous -n"),
    child: Widget.Box({
      class_name: "workspace__container",
      spacing: 4,
      children: hyprland.bind("workspaces").as((ws) => {
        ws.push({
          id: ws[ws.length - 1].id + 1,
          name: "extra",
        });
        return ws.map(WorkspaceButton);
      }),
      setup: (self) => {
        self.hook(hyprland, () => {
          const activeId = hyprland.active.workspace.id;
          const occupied = hyprland.getWorkspace(activeId)?.windows > 0;
          if (self.children.length > 0) {
            const lastIndex = self.children.length - 1;
            self.children[lastIndex].visible = occupied;
          }
        });
      },
    }),
  });
