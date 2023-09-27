import Recorder from "../services/screenRecord.js";
const { Button, Box, Icon, Label } = ags.Widget;

export default (props) =>
  Button({
    ...props,
    className: "recorder panel-button",
    onClicked: Recorder.stop,
    child: Box({
      children: [
        Icon("media-record-symbolic"),
        Label({
          connections: [
            [
              Recorder,
              (label, time) => {
                const sec = time % 60;
                const min = Math.floor(time / 60);
                label.label = `${min}:${sec < 10 ? "0" + sec : sec}`;
              },
              "timer",
            ],
          ],
        }),
      ],
    }),
    connections: [
      [
        Recorder,
        (button) => {
          button.visible = Recorder.instance._recording;
        },
      ],
    ],
  });
