const [core,windowBuilder,fs,xlsx,exec,cheerio] = [require("../bin/core"), require("../domain/windowBuilder"), require("fs"), require("node-xlsx"), require('child_process').exec, require("cheerio")];

const PRO_Engineer_BAT = `E:/pro3.0.bat.lnk`,
    PATH_MDLLOAD_XML = `${__dirname}/../databases/mdlload.xml`;

class DispatchTactics {
    constructor(electron) {
        this.app = electron.app;
        this.dialog = electron.dialog;
        this.BrowserWindow = electron.BrowserWindow;
        // cache
        this.cache = new Map();
    }

    getMemoryCache(param, callback) {
        let {url} = param;
        return (this.cache.has(url) && callback) ? callback(null, "getMemoryCache", this.cache.get(url)) : callback(new Error("no such this cache in memory."), "getMemoryCache");
    }

    setMemoryCache(param) {
        let {url,data} = param;
        return this.cache.set(url, data);
    }

    showWindow(param) {
        let {windowName} = param;
        if ("frameWindow" == windowName)
            global.engineerWhite.contextFrameWindow.show();
        else
            global.engineerWhite.mainFrameWindow.show();
    }

    closeWindow() {
        this.BrowserWindow.getFocusedWindow().hide();
    }

    miniWindow() {
        this.BrowserWindow.getFocusedWindow().minimize();
    }

    openMsgWindow(param, callback) {
        let {url,title} = param;
        if (!url) {
            if (callback) callback(new Error("No such this msg information"));
            return;
        }
        windowBuilder.buildMsgNoticeWindow({url, title});
        if (callback) callback(null, "openMsgWindow");
    }

    openFrameWindow(param, callback) {
        if (!param.url)
            param.url = `file://${__dirname}/../views/frameWindow.html`;
        windowBuilder.buildContextFrameWindow(param);
        if (callback) callback(null, "openFrameWindow");
    }

    openFileDialog(param, callback) {
        let filePath = this.dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                {name: 'Execl 2007', extensions: ['xlsx']}
            ]
        });
        if (filePath) {
            param.filePath = filePath[0];
            this.uploadDatabases(param, callback);
        }
    }

    openProEngineer() {
        exec(PRO_Engineer_BAT, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(stdout);
            console.log(stderr);
        });

    }

    writeSelectedData(param) {
        let {name,data,context,$,flag = false} = param;
        $ = cheerio.load(fs.readFileSync(PATH_MDLLOAD_XML).toString("utf-8"), {
            withDomLvl1: true,
            normalizeWhitespace: false,
            xmlMode: true,
            decodeEntities: true
        });

        if (data && data instanceof Array) {
            data.forEach(command => {
                $("moldbase").append(`<comp name="water-mp-customize" target=${command.id} value=${command.key}/>`);
            });
            flag = true;
        }

        if (flag) fs.writeFileSync(PATH_MDLLOAD_XML, $.xml());
    }

    uploadDatabases(param, callback) {
        let data = xlsx.parse(param.filePath);
        core.writeData(core.constructionTable(data), `${__dirname}/../databases/gree.db`);
        if (callback) callback(null, "uploadDatabases");
    }
}

module.exports = DispatchTactics;
