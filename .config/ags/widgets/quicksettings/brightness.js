const { Icon, Label, Slider } = ags.Widget;
import Brightness from "../services/brightness.js";

export const BrightnessSlider = (props) =>
  Slider({
    ...props,
    drawValue: false,
    hexpand: true,
    min: 0.1,
    connections: [
      [
        Brightness,
        (slider) => {
          slider.value = Brightness.screen;
        },
      ],
    ],
    onChange: ({ value }) => (Brightness.screen = value),
  });

export const Indicator = (props) =>
  Icon({
    ...props,
    icon: "display-brightness-symbolic",
  });

export const PercentLabel = (props) =>
  Label({
    ...props,
    connections: [
      [
        Brightness,
        (label) => (label.label = `${Math.floor(Brightness.screen * 100)}%`),
      ],
    ],
  });
