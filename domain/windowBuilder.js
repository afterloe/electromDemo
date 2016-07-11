const {
    BrowserWindow,
    nativeImage,
    core = require("../bin/core")
} = require("electron");

class MsgNoticeWindow {
    constructor(_param) {
        let cfg = core.readJson(`${__dirname}/../conf/frameWindow.json`),
            msgNoticeWindow, frameWindow;
        if (!cfg || !cfg.msgNoticeWindow) throw new Error("read config failed!");
        msgNoticeWindow = cfg.msgNoticeWindow;
        let {width,height} = engineerWhite.screen;
        if (undefined === msgNoticeWindow.width || "auto" === msgNoticeWindow.width) msgNoticeWindow.width = Math.ceil(width * 0.15) > 300 ? Math.ceil(width * 0.15) : 300;
        if (undefined === msgNoticeWindow.height || "auto" === msgNoticeWindow.height) msgNoticeWindow.height = Math.ceil(height * 0.20) > 200 ? Math.ceil(height * 0.20) : 200;
        if (undefined === msgNoticeWindow.x || "auto" === msgNoticeWindow.x) msgNoticeWindow.x = Math.ceil(width - msgNoticeWindow.width);
        if (undefined === msgNoticeWindow.y || "auto" === msgNoticeWindow.y) msgNoticeWindow.y = Math.ceil(height - msgNoticeWindow.height);
        msgNoticeWindow.icon = engineerWhite.icon;
        msgNoticeWindow.title = `${msgNoticeWindow.title} ${_param.title}`;
        frameWindow = new BrowserWindow(msgNoticeWindow);
        if (msgNoticeWindow.debug) frameWindow.webContents.openDevTools();
        frameWindow.loadURL(_param.url);
        frameWindow.on("closed", () => {
            frameWindow = null;
            global.engineerWhite.msgNoticeWindow = null;
        });
        return frameWindow;
    }
}

class ContextFrameWindow {
    constructor(_param) {
        let cfg = core.readJson(`${__dirname}/../conf/frameWindow.json`),
            contextFrameWindow, frameWindow;
        if (!cfg || !cfg.contextFrameWindow) throw new Error("read config failed!");
        contextFrameWindow = cfg.contextFrameWindow;
        let {
            width,
            height
        } = engineerWhite.screen;
        if (undefined === contextFrameWindow.width || "auto" === contextFrameWindow.width) contextFrameWindow.width = Math.ceil(width * 0.70) > 900 ? Math.ceil(width * 0.70) : 900;;
        if (undefined === contextFrameWindow.height || "auto" === contextFrameWindow.height) contextFrameWindow.height = Math.ceil(height * 0.85) > 600 ? Math.ceil(height * 0.85) : 600;
        contextFrameWindow.icon = engineerWhite.icon;
        contextFrameWindow.title = `${contextFrameWindow.title} ${_param.title}`;
        frameWindow = new BrowserWindow(contextFrameWindow);
        if (contextFrameWindow.debug) frameWindow.webContents.openDevTools();
        frameWindow.loadURL(_param.url);
        frameWindow.on("closed", () => {
            frameWindow = null;
            global.engineerWhite.mainFrameWindow = null;
        });
        return frameWindow;
    }
}

class MainFrameWindow {
    constructor() {
        let cfg = core.readJson(`${__dirname}/../conf/frameWindow.json`),
            mainFrameWindow, frameWindow;
        if (!cfg || !cfg.mainFrameWindow) throw new Error("read config failed!");
        mainFrameWindow = cfg.mainFrameWindow;
        let {
            width,
            height
        } = engineerWhite.screen;
        if (undefined === mainFrameWindow.width || "auto" === mainFrameWindow.width) mainFrameWindow.width = Math.ceil(width * 0.20) > 390 ? Math.ceil(width * 0.20) : 390;
        if (undefined === mainFrameWindow.height || "auto" === mainFrameWindow.height) mainFrameWindow.height = Math.ceil(height * 0.55) > 600 ? Math.ceil(height * 0.55) : 600;
        if (undefined === mainFrameWindow.x || "auto" === mainFrameWindow.x) mainFrameWindow.x = Math.ceil(width - mainFrameWindow.width);
        if (undefined === mainFrameWindow.y || "auto" === mainFrameWindow.y) mainFrameWindow.y = Math.ceil(height - mainFrameWindow.height);
        mainFrameWindow.icon = nativeImage.createFromPath(`${__dirname}/../sources/${mainFrameWindow.icon}`);
        engineerWhite.icon = mainFrameWindow.icon;
        frameWindow = new BrowserWindow(mainFrameWindow);
        if (mainFrameWindow.debug) frameWindow.webContents.openDevTools();
        frameWindow.loadURL(`file://${__dirname}/../views/index.html`);
        frameWindow.on("closed", () => {
            frameWindow = null;
            global.engineerWhite.contextFrameWindow = null;
        });
        return frameWindow;
    }
}

/**
 *  window 浏览器窗口
 */
class windowBuilder {

    /**
     *  初始化构建函数
     */
    static initFrameWindow(width, height) {
        if (!width || !height) throw new Error("Lack params");
        if (!global.engineerWhite) global.engineerWhite = new Object();
        engineerWhite.screen = {
            width,
            height
        };
    }

    /**
     *  构建主窗口
     */
    static buildMainFrameWindow() {
        let frameWindow = global.engineerWhite.mainFrameWindow;
        return frameWindow ? frameWindow : global.engineerWhite.mainFrameWindow = new MainFrameWindow();
    }

    /**
     *  构建消息弹窗
     */
    static buildMsgNoticeWindow(_param) {
        let msgNoticeWindow = global.engineerWhite.msgNoticeWindow;
        if(msgNoticeWindow) {
            msgNoticeWindow.loadURL(_param.url);
            msgNoticeWindow.setTitle(_param.title);
            if (!msgNoticeWindow.isVisible()) msgNoticeWindow.show();
            else msgNoticeWindow.focus();
            return msgNoticeWindow;
        } else
            return global.engineerWhite.msgNoticeWindow = new MsgNoticeWindow(_param);
    }

    /**
     *  构建主内容窗口
     */
    static buildContextFrameWindow(_param) {
        let frameWindow = global.engineerWhite.contextFrameWindow;
        if (frameWindow) {
            frameWindow.loadURL(_param.url);
            frameWindow.setTitle(_param.title);
            if (!frameWindow.isVisible()) frameWindow.show();
            else frameWindow.focus();
            return frameWindow;
        } else {
            return global.engineerWhite.contextFrameWindow = new ContextFrameWindow(_param);
        }
    }
}

module.exports = windowBuilder;
