const [core,windowBuilder,fs,xlsx,exec,cheerio] = [require("../bin/core"), require("../domain/windowBuilder"), require("fs"), require("node-xlsx"), require('child_process').exec, require("cheerio")];

const PRO_Engineer_BAT = `${__dirname}/../databases/pro3.0.bat.lnk`,
    PATH_MDLLOAD_XML = `${__dirname}/../databases/mdlload.xml`;

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

    openFrameWindow(param, callback) {
        if (!param.url)
            param.url = `file://${__dirname}/../views/frameWindow.html`;
        windowBuilder.buildContextFrameWindow(param);
        if (callback) callback();
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
        //PATH_MDLLOAD_XML
        $ = cheerio.load(fs.readFileSync(PATH_MDLLOAD_XML).toString("utf-8"), {
            withDomLvl1: true,
            normalizeWhitespace: false,
            xmlMode: true,
            decodeEntities: true
        });

        if(data && data instanceof Array){
            data.forEach(command => {
                $("moldbase").append(`<comp name="water-mp-customize" target=${command.id} value=${command.key}/>`);
            });
            flag = true;
        }

        if(flag) fs.writeFileSync(PATH_MDLLOAD_XML,$.xml());
    }

    uploadDatabases(param, callback) {
        let data = xlsx.parse(param.filePath), databases = new Object();
        for (let table of data) {
            if ("condition" === table.name) {
                databases[table.name] = core.constructionCondition(table);
            } else {
                databases[table.name] = core.constructionTable(table);
            }
        }
        core.writeData(databases, `${__dirname}/../databases/gree.db`);
        if (callback) callback(null, "uploadDatabases");
    }
}

module.exports = DispatchTactics;
