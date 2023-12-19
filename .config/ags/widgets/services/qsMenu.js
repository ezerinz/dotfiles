import { Service, App } from "../../imports.js";

class QSMenu extends Service {
  static {
    Service.register(this);
  }

  opened = "";

  toggle(menu) {
    this.opened = this.opened === menu ? "" : menu;
    this.emit("changed");
  }

  constructor() {
    super();
    App.connect("window-toggled", (_a, name, visible) => {
      if (name === "quicksettings" && !visible) {
        this.opened = "";
        this.emit("changed");
      }
    });
  }
}

export default new QSMenu();
