import windows from "../windows.js";
import { sendBatch } from "./utils.js";

export default function applyAnimation() {
  sendBatch(
    windows
      .filter((win) => !!win.animation)
      .map((win) => `layerrule animation ${win.animation}, ${win.name}`),
  );
}
