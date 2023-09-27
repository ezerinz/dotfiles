// import * as qs from "./quicksettings.js";
import * as battery from "./battery.js";
import * as network from "./network.js";
const { Button, Box } = ags.Widget;
const { App } = ags;
const { Service } = ags.Service;
const { Audio } = ags.Service;

export default () =>
  Button({
    className: "quicksettings__panel panel-button",
    onClicked: () => App.toggleWindow("quicksettings"),
    onScrollUp: () => {
      Audio.speaker.volume += 0.02;
      Service.Indicator.speaker();
    },
    onScrollDown: () => {
      Audio.speaker.volume -= 0.02;
      Service.Indicator.speaker();
    },
    connections: [
      [
        App,
        (btn, win, visible) => {
          btn.toggleClassName("active", win === "quicksettings" && visible);
        },
      ],
    ],
    child: Box({
      children: [
        network.SpeedIndicator(),
        network.Indicator(),
        network.SSIDLabel(),
        battery.Indicator(),
        battery.LevelLabel(),
      ],
    }),
  });
