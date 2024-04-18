import { sendBatch } from "./utils.js";

export default function blurWindows() {
  const noIgnorealpha = [
    "verification__window",
    "powermenu__window",
    // "hyprsplash__window",
  ];

  sendBatch(
    App.windows.flatMap(({ name }) => [
      `layerrule blur, ${name}`,
      noIgnorealpha.some((skip) => name?.includes(skip))
        ? ""
        : `layerrule ignorealpha 0.7, ${name}`,
    ]),
  );
}
