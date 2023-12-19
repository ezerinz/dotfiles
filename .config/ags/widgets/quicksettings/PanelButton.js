// import * as qs from "./quicksettings.js";
import * as battery from "./battery.js";
import * as network from "./network.js";
import Indicator from "../services/onScreenIndicator.js";
import { Widget, App, Service, Audio } from "../../imports.js";

export default () =>
  Widget.Button({
    className: "quicksettings__panel panel-button",
    onClicked: () => {
      App.toggleWindow("quicksettings");
    },
    onScrollUp: () => {
      Audio.speaker.volume += 0.02;
      Indicator.speaker();
    },
    onScrollDown: () => {
      Audio.speaker.volume -= 0.02;
      Indicator.speaker();
    },
    setup: (self) =>
      self.hook(App, (btn, win, visible) => {
        btn.toggleClassName("active", win === "quicksettings" && visible);
      }),
    child: Widget.Box({
      children: [
        network.SpeedIndicator(),
        network.Indicator(),
        network.SSIDLabel(),
        battery.Indicator(),
        battery.LevelLabel(),
      ],
    }),
  });
