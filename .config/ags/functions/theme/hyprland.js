import { configs } from "../../vars.js";
import { sendBatch } from "../utils.js";

export default function setHyprland(theme) {
  const bgColor = theme.background.replace("#", "");
  const primaryColor = theme.primary.replace("#", "");
  sendBatch([
    `decoration:col.shadow rgb(${bgColor})`,
    `decoration:rounding ${configs.theme.border_radius.value.split(",")[0].trim()}`,
    `general:col.active_border rgb(${primaryColor})`,
    `general:gaps_out ${configs.theme.hyprland_window_margin.value}`,
  ]);
}
