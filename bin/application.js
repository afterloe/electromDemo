/**
 * Created by afterloe on 6/29/2016.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const windowBuilder = require("../domain/windowBuilder");

module.exports = electron => {
    let [app, Tray] = [electron.app, electron.Tray];
    // 构建ipc 通讯模块
    require(`${__dirname}/ipc`)(electron);

    let readyApp = () => {
        let {screen : electronScreen} = electron, {width,height} = electronScreen.getPrimaryDisplay().workAreaSize;
        windowBuilder.initFrameWindow(width,height);
        windowBuilder.buildMainFrameWindow();
        // 保存引用，防止被内存回收
        global.appIcon = new Tray(global.engineerWhite.icon);
        // 构建托盘小图标
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