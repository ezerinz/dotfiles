import { configs } from "../../vars.js";
import PanelButton from "../PanelButton.js";

const hyprland = await Service.import("hyprland");
const apps = await Service.import("applications");

const ClientIcon = () =>
  Widget.Icon({
    size: 18,
    icon: hyprland.active.bind("client").as((client) => {
      const app = apps.list.find((app) => app.match(client.class));
      return client.class === ""
        ? "desktop-symbolic"
        : app?.icon_name + "-symbolic";
    }),
  });

export default () =>
  PanelButton({
    tooltip_text: hyprland.active.client
      .bind("class")
      .as((v) => (v === "" ? "Desktop" : v)),
    child: Widget.Box({
      spacing: 3,
      children: [
        ClientIcon(),
        Widget.Label({
          label: hyprland.active.client
            .bind("title")
            .as((t) =>
              t === ""
                ? "Desktop"
                : t.includes("Mozilla")
                  ? "Mozilla Firefox"
                  : t,
            ),
          visible: configs.theme.bar.position
            .bind()
            .as((p) => (p !== "left") & (p !== "right")),
        }),
      ],
    }),
  });
