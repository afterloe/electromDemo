/**
 * Created by afterloe on 6/29/2016.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const windowBuilder = require("../domain/windowBuilder");

module.exports = electron => {
    let [app, Tray] = [electron.app, electron.Tray];
    // ����ipc ͨѶģ��
    require(`${__dirname}/ipc`)(electron);

    let readyApp = () => {
        let {screen : electronScreen} = electron, {width,height} = electronScreen.getPrimaryDisplay().workAreaSize;
        windowBuilder.initFrameWindow(width,height);
        windowBuilder.buildMainFrameWindow();
        // �������ã���ֹ���ڴ����
        global.appIcon = new Tray(global.engineerWhite.icon);
        // ��������Сͼ��
        require(`${__dirname}/../domain/trayBuilder`)(electron);
    };

    app.on("ready", readyApp);

    app.on("window-all-closed", () => {
        if (process.platform != "darwin") app.quit();
    });

    app.on("activate", () => {
        if (null === global.engineerWhite) readyApp();
    });
};