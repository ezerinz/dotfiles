export default {
  settings: "org.gnome.Settings-symbolic",
  tick: "object-select-symbolic",
  audio: {
    mic: {
      muted: "microphone-disabled-symbolic",
      unmuted: "microphone-sensitivity-high-symbolic",
    },
    volume: {
      muted: "audio-volume-muted-symbolic",
      low: "audio-volume-low-symbolic",
      medium: "audio-volume-medium-symbolic",
      high: "audio-volume-high-symbolic",
      overamplified: "audio-volume-overamplified-symbolic",
    },
    type: {
      headset: "audio-headphones-symbolic",
      speaker: "audio-speakers-symbolic",
      card: "audio-card-symbolic",
    },
    mixer: "",
  },
  powerprofile: {
    Balanced: "power-profile-balanced-symbolic",
    Quiet: "power-profile-power-saver-symbolic",
    Performance: "power-profile-performance-symbolic",
  },
  apps: {
    apps: "view-app-grid-symbolic",
    search: "folder-saved-search-symbolic",
  },
  battery: {
    charging: "󱐋",
    warning: "battery-empty-symbolic",
  },
  bluetooth: {
    enabled: "bluetooth-active-symbolic",
    disabled: "bluetooth-disabled-symbolic",
  },
  brightness: {
    indicator: "display-brightness-symbolic",
    keyboard: "keyboard-brightness-symbolic",
    screen: ["󰛩", "󱩎", "󱩏", "󱩐", "󱩑", "󱩒", "󱩓", "󱩔", "󱩕", "󱩖", "󰛨"],
  },
  powermenu: {
    sleep: "weather-clear-night-symbolic",
    reboot: "system-reboot-symbolic",
    logout: "system-log-out-symbolic",
    shutdown: "system-shutdown-symbolic",
  },
  recorder: {
    recording: "media-record-symbolic",
  },
  notifications: {
    noisy: "preferences-system-notifications-symbolic",
    silent: "notifications-disabled-symbolic",
  },
  trash: {
    full: "user-trash-full-symbolic",
    empty: "user-trash-symbolic",
  },
  mpris: {
    fallback: "audio-x-generic-symbolic",
    shuffle: {
      enabled: "󰒟",
      disabled: "󰒟",
    },
    loop: {
      none: "󰓦",
      track: "󰓦",
      playlist: "󰑐",
    },
    playing: "󰏦",
    paused: "󰐍",
    stopped: "󰐍",
    prev: "󰒮",
    next: "󰒭",
  },
  ui: {
    arrow: {
      right: "pan-end-symbolic",
      left: "pan-start-symbolic",
      down: "pan-down-symbolic",
      up: "pan-up-symbolic",
    },
  },
  system: {
    cpu: "org.gnome.SystemMonitor-symbolic",
    ram: "drive-harddisk-solidstate-symbolic",
    temp: "temperature-symbolic",
  },
};
