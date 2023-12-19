import { Notifications, Utils, Widget, Variable } from "../../imports.js";
import Gdk from "gi://Gdk";

const COLORS_CACHE = Utils.CACHE_DIR + "/colorpicker.json";

const wlCopy = (color) => Utils.execAsync(["wl-copy", color]).catch(print);

const colors = Variable([]);
Utils.readFileAsync(COLORS_CACHE)
  .catch(() => print("no colorpicker cache found"))
  .then((out) => colors.setValue(JSON.parse(out || "[]")));

export default () =>
  Widget.Button({
    className: "panel-button colorpicker",
    child: Widget.Box({ children: [Widget.Icon("color-select-symbolic")] }),
    setup: (self) =>
      self
        .on("clicked", (btn) =>
          Utils.execAsync("hyprpicker")
            .then((color) => {
              if (!color) return;

              wlCopy(color);
              const list = colors.value;
              if (!list.includes(color)) {
                list.push(color);
                if (list > 10) list.shift();

                colors.value = list;
                Utils.writeFile(JSON.stringify(list, null, 2), COLORS_CACHE);
              }

              btn._id = Notifications.Notify(
                "Color Picker",
                btn._id || null,
                "color-select-symbolic",
                color,
                "",
                [],
                {},
              );
            })
            .catch(print),
        )
        .hook(
          colors,
          (btn) => (btn.tooltipText = `${colors.value.length} colors`),
        ),
    onSecondaryClick: (btn) =>
      colors.value.length > 0
        ? Widget.Menu({
            className: "colorpicker",
            children: colors.value.map((color) =>
              Widget.MenuItem({
                child: Widget.Label(color),
                css: `background-color: ${color}`,
                onActivate: () => wlCopy(color),
              }),
            ),
          }).popup_at_widget(btn, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null)
        : false,
  });
