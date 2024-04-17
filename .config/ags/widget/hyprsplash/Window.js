import { configs } from "../../vars.js";

const Text = () =>
  Widget.Label({
    class_name: "splash-text",
    label: Utils.exec("hyprctl splash"),
  });

export default () =>
  Widget.Window({
    name: "hyprsplash__window",
    layer: "bottom",
    anchor: ["bottom"],
    margins: configs.theme.window_margin
      .bind()
      .as((v) => v.split(",").map(Number)),
    child: Text(),
  });
