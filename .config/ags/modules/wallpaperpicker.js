const { Box, Label, Scrollable, EventBox, Button, Overlay } = ags.Widget;
const { USER, exec, execAsync, readFile, writeFile } = ags.Utils;
const { Service } = ags;

class WallpaperService extends Service {
  static {
    Service.register(this);
  }

  _wallpaper = "";
  _wallpaperSetting = ags.App.configDir + "/wallpaper.json";

  constructor() {
    super();
    this._wallpaper = JSON.parse(readFile(this._wallpaperSetting)).path;
  }

  restore() {
    exec("swww init");
    execAsync(["sleep", "1"]);
    execAsync([
      "swww",
      "img",
      "--transition-type",
      "grow",
      "--transition-pos",
      exec("hyprctl cursorpos").replace(" ", ""),
      this._wallpaper,
    ]).catch(print);
  }

  get list() {
    const wallpaperDir = `/home/${USER}/wallpapers`;

    return exec(`ls ${wallpaperDir}`)
      .split("\n")
      .map((e) => ({
        path: wallpaperDir + "/" + e,
        active: wallpaperDir + "/" + e === this._wallpaper,
      }));
  }

  setWallpaper(path) {
    execAsync([
      "swww",
      "img",
      "--transition-type",
      "grow",
      "--transition-pos",
      exec("hyprctl cursorpos").replace(" ", ""),
      path,
    ])
      .then(() => {
        this._wallpaper = path;
        this.emit("changed");
        writeFile(JSON.stringify({ path: path }), this._wallpaperSetting).catch(
          print
        );
      })
      .catch(print);
  }

  get wallpaper() {
    return this._wallpaper;
  }
}
class Wallpaper {
  static {
    Service.export(this, "Wallpaper");
  }
  static instance = new WallpaperService();

  static get list() {
    return Wallpaper.instance.list;
  }

  static setWallpaper(value) {
    return Wallpaper.instance.setWallpaper(value);
  }

  static get wallpaper() {
    return Wallpaper.instance.wallpaper;
  }

  static restore() {
    Wallpaper.instance.restore();
  }
}

const BoxWallpaer = ({ filePath, isActive }) => {
  const style = `
                background-image: url("${filePath}");
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                min-width: 136.6px;
                min-height: 76.8px;
                margin-right: 6px;
                border-radius: 4px;
                ${isActive ? "box-shadow: inset 0px 0px 0px 4px #7aa2f7;" : ""}
            `;
  const box = Box({
    style: style,
  });

  return EventBox({
    onPrimaryClick: isActive ? null : () => Wallpaper.setWallpaper(filePath),
    child: box,
  });
};

export const PopupContent = () =>
  Box({
    className: "wall__popupcontent",
    vertical: true,
    valign: "center",
    halign: "center",
    children: [],
    connections: [
      [
        Wallpaper,
        (box) => {
          const wallpapersList = Wallpaper.list.map((e) =>
            BoxWallpaer({ filePath: e.path, isActive: e.active })
          );

          const chunkSize = 3;
          const result = [];
          for (let i = 0; i < wallpapersList.length; i += chunkSize) {
            const chunk = wallpapersList.slice(i, i + chunkSize);
            result.push(
              Box({
                className: "list",
                children: chunk,
              })
            );
          }

          box.children = [
            Box({
              className: "wall__headers",
              hexpand: true,
              children: [Label({ label: "Wallpapers", hexpand: true })],
            }),
            Scrollable({
              className: "scroll__container",
              hscroll: "never",
              child: Box({ vertical: true, children: result }),
            }),
            //
            // Overlay({
            //   child: Scrollable({
            //     className: "scroll__container",
            //     hscroll: "never",
            //     child: Box({ vertical: true, children: result }),
            //   }),
            //   overlays: [
            //     Button({
            //       className: "refresh-button",
            //       onClicked: () => Wallpaper.instance.emit("changed"),
            //       halign: "end",
            //       valign: "end",
            //       child: Label("Refresh"),
            //     }),
            //   ],
            // }),
          ];
        },
      ],
    ],
  });
