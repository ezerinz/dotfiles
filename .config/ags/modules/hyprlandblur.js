const { execAsync } = ags.Utils;

export default function() {
  try {
    ags.App.instance.connect("window-toggled", () => {
      for (const [name] of ags.App.windows) {
        if (
          !name.includes("desktop") &&
          name !== "verification" &&
          name !== "powermenu"
        ) {
          execAsync(["hyprctl", "keyword", "layerrule", `unset, ${name}`]).then(
            () => {
              execAsync(["hyprctl", "keyword", "layerrule", `blur, ${name}`]);
              execAsync([
                "hyprctl",
                "keyword",
                "layerrule",
                `ignorealpha 0.6, ${name}`,
              ]);
            }
          );
        }
      }

      for (const name of ["verification", "powermenu"])
        execAsync(["hyprctl", "keyword", "layerrule", `blur, ${name}`]);
    });
  } catch (error) {
    logError(error);
  }
}
