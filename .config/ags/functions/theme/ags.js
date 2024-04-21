import { matugenStringify } from "../utils.js";
import { configs } from "../../vars.js";

const format = (str, four_values = true) => {
  let splitted = str.split(",").map((item) => `${item}px`.trim());

  let result = splitted.join(" ");
  if (four_values) {
    switch (splitted.length) {
      case 1:
        result = `${splitted[0]} `.repeat(4);
        break;
      case 2:
        result = `${splitted[0]} ${splitted[1]} ${splitted[0]} ${splitted[1]}`;
        break;
      case 3:
        result = `${splitted[0]} ${splitted[1]} ${splitted[2]} ${splitted[1]}`;
        break;
    }
  }

  return result;
};

export function setScssVariable(key = "", value = "", four_values = true) {
  let data = {
    margin: "0",
    border_radius: "0",
    bar_border_radius: "0",
    bar_margin: "0",
    workspace_active_width: "30",
    dark_mode: "false",
    osd_regular_margin: "0",
    osd_progress_margin: "0",
  };

  data.margin = format(configs.theme.window_margin.value);
  data.border_radius = format(configs.theme.border_radius.value);
  data.bar_border_radius = format(configs.theme.bar.border_radius.value);
  data.bar_margin = format(configs.theme.bar.margin.value);
  data.dark_mode = configs.theme.dark_mode.value.toString();
  data.workspace_active_width = format(
    configs.theme.bar.workspace_active_width.value,
    false,
  );
  data.osd_regular_margin = format(configs.osd.regular.margin.value);
  data.osd_progress_margin = format(configs.osd.progress.margin.value);

  let update = {};
  if (key != "" && value != "") {
    update[key] = format(value, four_values);
  }
  let merged = { ...data, ...update };

  let result = "";

  Object.entries(merged).forEach(([key, value]) => {
    result += `$${key}: ${value};\n`;
  });

  Utils.writeFile(result, App.configDir + "/style/vars.scss");
}

function setScssColors(theme) {
  Utils.writeFile(
    matugenStringify("${{key}}: {{value}};", theme),
    App.configDir + "/style/colors.scss",
  );
}

export default function setAgs(theme) {
  setScssVariable();
  setScssColors(theme);
}
