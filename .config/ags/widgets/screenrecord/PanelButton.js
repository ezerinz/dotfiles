import Recorder from "../services/screenRecord.js";
import { Widget } from "../../imports.js";

export const PemisahRecorder = () =>
  Widget.Box({
    className: "bar__separator",
    setup: (self) =>
      self.hook(Recorder, (box) => {
        box.visible = Recorder.recording;
      }),
  });
export const RecordPanelButton = (props) =>
  Widget.Button({
    ...props,
    className: "recorder panel-button",
    visible: Recorder.bind("recording"),
    onClicked: () => Recorder.stop(),
    child: Widget.Box({
      children: [
        Widget.Icon("media-record-symbolic"),
        Widget.Label({
          setup: (self) =>
            self.bind("label", Recorder, "timer", (time) => {
              const sec = time % 60;
              const min = Math.floor(time / 60);
              return `${min}:${sec < 10 ? "0" + sec : sec}`;
            }),
        }),
      ],
    }),
  });
