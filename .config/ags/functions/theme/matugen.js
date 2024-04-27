import { sh } from "../utils.js";

export function generateColor(path) {
  sh(`matugen image ${path} --json hex`).then((out) => {
    Utils.writeFile(
      JSON.stringify(JSON.parse(out), null, 2),
      TMP + "/colors.json",
    ).catch(print);
  });
}
