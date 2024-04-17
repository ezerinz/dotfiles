import GLib from "gi://GLib";
const now = () => GLib.DateTime.new_now_local().format("%Y-%m-%d_%H-%M-%S");

export default async (full = false) => {
  try {
    const area = full ? null : await Utils.execAsync("slurp");
    const path = GLib.get_home_dir() + "/Pictures/Screenshots";
    const file = `${path}/${now()}.png`;
    Utils.ensureDirectory(path);

    area
      ? await Utils.execAsync(["wayshot", "-s", area, "-f", file])
      : await Utils.execAsync(["wayshot", "-f", file]);

    Utils.execAsync(["bash", "-c", `wl-copy < ${file}`]);

    await Utils.notify({
      summary: "Screenshot Taken",
      body: `${file}`,
      iconName: file,
      actions: {
        "Show In Files": () => Utils.execAsync(["xdg-open", path]),
        View: () => Utils.execAsync(["xdg-open", file]),
        Edit: () => Utils.execAsync(["swappy", "-f", file]),
      },
    });
  } catch (error) {
    console.error(error);
  }
};
