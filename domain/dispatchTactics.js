const [core,windowBuilder] = [require("../bin/core"), require("../domain/windowBuilder")];

class DispatchTactics {
    constructor(electron) {
        this.app = electron.app;
        this.dialog = electron.dialog;
        this.BrowserWindow = electron.BrowserWindow;
    }

    closeWindow() {
      this.BrowserWindow.getFocusedWindow().hide();
    }

    miniWindow() {
      this.BrowserWindow.getFocusedWindow().minimize();
    }

    loginMate(param) {
        core.userDir(param.id, err => {
            core.configuer.encryption(param, `${core.getDataPath()}/pid`);
            global.engineerWhite.mainFrameWindow.loadURL(`file://${__dirname}/../views/index.html`);
        });
    }

    openFrameWindow(param) {
      param.url = `file://${__dirname}/../views/frameWindow.html?loadUrl=${param.url}`;
      windowBuilder.buildContextFrameWindow(param);
    }
}

module.exports = DispatchTactics;
