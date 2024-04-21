import windows from "../../windows.js";
import { sendBatch } from "../utils.js";

export default function windowAnimation() {
  sendBatch(
    windows
      .filter((win) => !!win.animation)
      .map((win) => `layerrule animation ${win.animation}, ${win.name}`),
  );
}
