import GLib from "gi://GLib?version=2.0";
const hyprland = await Service.import("hyprland");

const substitutes = {
  "transmission-gtk": "transmission",
  "blueberry.py": "blueberry",
  Caprine: "facebook-messenger",
  "com.raggesilver.BlackBox-symbolic": "terminal-symbolic",
  "org.wezfurlong.wezterm-symbolic": "terminal-symbolic",
  "audio-headset-bluetooth": "audio-headphones-symbolic",
  "audio-card-analog-usb": "audio-speakers-symbolic",
  "audio-card-analog-pci": "audio-card-symbolic",
  "preferences-system": "emblem-system-symbolic",
  "com.github.Aylur.ags-symbolic": "controls-symbolic",
  "com.github.Aylur.ags": "controls-symbolic",
};

export function icon(name, fallback = "image-missing-symbolic") {
  if (!name) return fallback || "";

  if (GLib.file_test(name, GLib.FileTest.EXISTS)) return name;

  const icon = substitutes[name] || name;
  if (Utils.lookUpIcon(icon)) return icon;

  return fallback;
}

export const sendBatch = (batch) => {
  const cmd = batch
    .filter((x) => !!x)
    .map((x) => `keyword ${x}`)
    .join("; ");

  hyprland.message(`[[BATCH]]/${cmd}`);
};

export async function sh(cmd) {
  return Utils.execAsync(cmd).catch((err) => {
    console.error(typeof cmd === "string" ? cmd : cmd.join(" "), err);
    return "";
  });
}
export async function bash(strings, ...values) {
  const cmd =
    typeof strings === "string"
      ? strings
      : strings.flatMap((str, i) => str + `${values[i] ?? ""}`).join("");

  return Utils.execAsync(["bash", "-c", cmd]).catch((err) => {
    console.error(cmd, err);
    return "";
  });
}
