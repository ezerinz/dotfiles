import { configs } from "../../vars.js";
import { isVertical, posIndex, sendBatch } from "../utils.js";
import { format } from "./ags.js";

export default function setHyprland(theme) {
  const bgColor = theme.background.replace("#", "");
  const primaryColor = theme.primary.replace("#", "");
  let margin = format(configs.theme.window.margin.value, true, false);
  margin = margin.split(" ");
  margin[posIndex(configs.theme.bar.position.value)] = "0";
  margin = margin.join(", ");

  sendBatch([
    `decoration:col.shadow rgb(${bgColor})`,
    `decoration:rounding ${configs.theme.border_radius.value.split(",")[0].trim()}`,
    `general:col.active_border rgb(${primaryColor})`,
    `general:gaps_out ${margin}`,
    `animation workspaces,1,7,menu_decel,${isVertical(configs.theme.bar.position.value) ? `slidevert` : "slide"}`,
  ]);
}

export function setGapsOut(bar_pos) {
  let margin = format(configs.theme.window.margin.value, true, false);
  margin = margin.split(" ");
  margin[posIndex(bar_pos)] = "0";
  margin = margin.join(", ");

  sendBatch([`general:gaps_out ${margin}`]);
}
