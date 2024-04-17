import PanelButton from "../PanelButton.js";
import recorder from "../../services/screen_record.js";

export default () =>
  PanelButton({
    on_clicked: () => recorder.stop(),
    visible: recorder.bind("recording"),
    child: Widget.Box({
      children: [
        Widget.Icon("media-record-symbolic"),
        Widget.Label({
          label: recorder.bind("timer").as((time) => {
            const sec = time % 60;
            const min = Math.floor(time / 60);
            return `${min}:${sec < 10 ? "0" + sec : sec}`;
          }),
        }),
      ],
    }),
  });
