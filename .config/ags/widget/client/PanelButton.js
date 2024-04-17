const hyprland = await Service.import("hyprland");

export default () =>
  Widget.Label({
    class_names: ["panel-button", "panel-client"],
    label: hyprland.active.client
      .bind("title")
      .as((t) =>
        t === "" ? "Desktop" : t.includes("Mozilla") ? "Mozilla Firefox" : t,
      ),
    visible: hyprland.active.client.bind("address").as((addr) => !!addr),
  });
