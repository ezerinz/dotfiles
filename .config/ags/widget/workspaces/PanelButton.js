import { isVertical } from "../../functions/utils.js";
import { configs } from "../../vars.js";

const hyprland = await Service.import("hyprland");
const dispatch = (ws) => hyprland.messageAsync(`dispatch workspace ${ws}`);

const WorkspaceButton = (ws) =>
  Widget.Button({
    class_name: "workspace-button",
    child: Widget.Box({
      class_name: "fill",
      hexpand: false,
      setup: (self) => {
        self.hook(configs.theme.bar.position, () => {
          self.toggleClassName(
            "vert",
            isVertical(configs.theme.bar.position.value),
          );
          self.toggleClassName(
            "hort",
            !isVertical(configs.theme.bar.position.value),
          );
        });
      },
    }),
    vpack: "center",
    hpack: "center",
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

export default () => {
  const wsBox = Widget.Box({
    class_names: ["workspace__container"],
    spacing: 4,
    hexpand: false,
    vexpand: false,
    vertical: configs.theme.bar.position.bind().as(isVertical),
    // children: hyprland.bind("workspaces").as((ws) => {
    //   ws.push({
    //     id: ws[ws.length - 1].id + 1,
    //     name: "extra",
    //   });
    //   return ws.map(WorkspaceButton);
    // }),
    setup: (self) => {
      // self.hook(configs.theme.bar.position, () => {
      //   const isLeft = configs.theme.bar.position.value === "left";

      self.hook(
        hyprland,
        () => {
          let ws = hyprland.workspaces;
          ws.push({
            id: ws[ws.length - 1].id + 1,
            name: "extra",
          });
          // if (isLeft) {
          //   ws = ws.reverse();
          // }
          self.children = ws.map(WorkspaceButton);
        },
        "notify::workspaces",
      );

      self.hook(hyprland, () => {
        const activeId = hyprland.active.workspace.id;
        const occupied = hyprland.getWorkspace(activeId)?.windows > 0;

        if (self.children.length > 0) {
          // const lastIndex = isLeft ? 0 : self.children.length - 1;
          const lastIndex = self.children.length - 1;
          self.children[lastIndex].visible = occupied;
        }
      });
      // });
    },
  });
  return Widget.EventBox({
    onScrollUp: () => Utils.exec("hyprnome"),
    onScrollDown: () => Utils.exec("hyprnome --previous -n"),
    child: wsBox,
  });
};
