import { Audio, Widget } from "../../imports.js";

const iconSubstitute = (item) => {
  const substitues = [
    { from: "audio-headset-bluetooth", to: "audio-headphones-symbolic" },
    { from: "audio-card-analog-usb", to: "audio-speakers-symbolic" },
    { from: "audio-card-analog-pci", to: "audio-card-symbolic" },
    { from: "audio-card-analog", to: "audio-speakers-symbolic" },
  ];

  for (const { from, to } of substitues) {
    if (from === item) return to;
  }
  return item;
};

export const SpeakerIndicator = ({
  items = [
    ["101", Widget.Icon("audio-volume-overamplified-symbolic")],
    ["67", Widget.Icon("audio-volume-high-symbolic")],
    ["34", Widget.Icon("audio-volume-medium-symbolic")],
    ["1", Widget.Icon("audio-volume-low-symbolic")],
    ["0", Widget.Icon("audio-volume-muted-symbolic")],
  ],
  ...props
} = {}) =>
  Widget.Stack({
    ...props,
    className: "speaker",
    items,
    setup: (self) =>
      self.hook(
        Audio,
        (stack) => {
          if (!Audio.speaker) return;

          if (Audio.speaker.isMuted) return (stack.shown = "0");

          const vol = Audio.speaker.volume * 100;
          for (const threshold of [100, 66, 33, 0, -1]) {
            if (vol > threshold + 1) return (stack.shown = `${threshold + 1}`);
          }
        },
        "speaker-changed",
      ),
  });

export const SpeakerTypeIndicator = (props) =>
  Widget.Icon({
    ...props,
    setup: (self) =>
      self.hook(Audio, (icon) => {
        if (Audio.speaker) icon.icon = iconSubstitute(Audio.speaker.iconName);
      }),
  });

export const SpeakerPercentLabel = (props) =>
  Widget.Label({
    ...props,
    setup: (self) =>
      self.hook(
        Audio,
        (label) => {
          if (!Audio.speaker) return;

          label.label = `${Math.floor(Audio.speaker.volume * 100)}%`;
        },
        "speaker-changed",
      ),
  });

export const SpeakerSlider = (props) =>
  Widget.Slider({
    ...props,
    drawValue: false,
    onChange: ({ value }) => (Audio.speaker.volume = value),
    setup: (self) =>
      self.hook(
        Audio,
        (slider) => {
          if (!Audio.speaker) return;

          slider.sensitive = !Audio.speaker.isMuted;
          slider.value = Audio.speaker.volume;
        },
        "speaker-changed",
      ),
  });

export const MicrophoneMuteIndicator = ({
  muted = Widget.Icon("microphone-disabled-symbolic"),
  unmuted = Widget.Icon("microphone-sensitivity-high-symbolic"),
  ...props
} = {}) =>
  Widget.Stack({
    ...props,
    items: [
      ["true", muted],
      ["false", unmuted],
    ],
    setup: (self) =>
      self.hook(
        Audio,
        (stack) => {
          stack.shown = `${Audio.microphone?.isMuted}`;
        },
        "microphone-changed",
      ),
  });

export const MicrophoneMuteToggle = (props) =>
  Widget.Button({
    ...props,
    onClicked: () => {
      Utils.execAsync("pactl set-source-mute @DEFAULT_SOURCE@ toggle");
    },
    setup: (self) =>
      self.hook(
        Audio,
        (button) => {
          if (!Audio.microphone) return;

          button.toggleClassName("on", !Audio.microphone.isMuted);
        },
        "microphone-changed",
      ),
  });

export const MicrophoneStatus = (props) =>
  Widget.Label({
    ...props,
    connections: [
      [
        Audio,
        (label) => {
          if (!Audio.microphone) return;

          label.label = Audio.microphone.isMuted ? "Off" : "On";
        },
        "microphone-changed",
      ],
    ],
  });

export const AppMixer = (props) => {
  const AppItem = (stream) => {
    const icon = Widget.Icon();
    const label = Widget.Label({
      xalign: 0,
      justify: "left",
      wrap: true,
      ellipsize: 3,
    });
    const percent = Widget.Label({ xalign: 1 });
    const slider = Widget.Slider({
      hexpand: true,
      drawValue: false,
      onChange: ({ value }) => {
        stream.volume = value;
      },
    });
    const sync = () => {
      icon.icon = stream.iconName;
      icon.tooltipText = stream.name;
      slider.value = stream.volume;
      percent.label = `${Math.floor(stream.volume * 100)}%`;
      label.label = stream.description || "";
    };
    const id = stream.connect("changed", sync);
    return Widget.Box({
      hexpand: true,
      children: [
        icon,
        Widget.Box({
          children: [
            Widget.Box({
              vertical: true,
              children: [label, slider],
            }),
            percent,
          ],
        }),
      ],
      connections: [["destroy", () => stream.disconnect(id)]],
      setup: sync,
    });
  };

  return Widget.Box({
    ...props,
    vertical: true,
    connections: [
      [
        Audio,
        (box) => {
          box.children = Array.from(Audio.apps.values()).map((stream) =>
            AppItem(stream),
          );
        },
      ],
    ],
  });
};

export const StreamSelector = ({ streams = "speakers", ...props } = {}) =>
  Widget.Box({
    ...props,
    vertical: true,
    connections: [
      [
        Audio,
        (box) => {
          box.children = Array.from(Audio[streams].values()).map((stream) =>
            Widget.Button({
              child: Widget.Box({
                children: [
                  Widget.Icon({
                    icon: iconSubstitute(stream.iconName),
                    tooltipText: stream.iconName,
                  }),
                  Widget.Label(
                    stream.description.split(" ").slice(0, 4).join(" "),
                  ),
                  Widget.Icon({
                    icon: "object-select-symbolic",
                    hexpand: true,
                    hpack: "end",
                    connections: [
                      [
                        "draw",
                        (icon) => {
                          icon.visible = Audio.speaker === stream;
                        },
                      ],
                    ],
                  }),
                ],
              }),
              onClicked: () => {
                if (streams === "speakers") Audio.speaker = stream;

                if (streams === "microphones") Audio.microphone = stream;
              },
            }),
          );
        },
      ],
    ],
  });
