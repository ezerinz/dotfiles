import { Widget } from "../../imports.js";
import Brightness from "../services/brightness.js";

export const BrightnessSlider = (props) =>
  Widget.Slider({
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
  Widget.Icon({
    ...props,
    icon: "display-brightness-symbolic",
  });

export const PercentLabel = (props) =>
  Widget.Label({
    ...props,
    connections: [
      [
        Brightness,
        (label) => (label.label = `${Math.floor(Brightness.screen * 100)}%`),
      ],
    ],
  });
