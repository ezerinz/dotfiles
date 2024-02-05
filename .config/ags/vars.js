import { Variable, Utils } from "./imports.js";

export const capsLockState = Variable(
  Utils.exec(`brightnessctl -d input3::capslock g`),
);
