const [core,windowBuilder,fs,xlsx,exec] = [require("../bin/core"), require("../domain/windowBuilder"), require("fs"), require("node-xlsx"),require('child_process').exec];

const PRO_Engineer_BAT = `${__dirname}/../databases/pro3.0.bat.lnk`;

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

    openFrameWindow(param) {
        if(!param.url)
            param.url = `file://${__dirname}/../views/frameWindow.html`;
        windowBuilder.buildContextFrameWindow(param);
    }

    openFileDialog(param) {
        let filePath = this.dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                {name: 'Execl 2007', extensions: ['xlsx']}
            ]
        });
        if (filePath) {
            param.filePath = filePath[0];
            this.uploadDatabases(param);
        }
    }

    openProEngineer(){
        exec(PRO_Engineer_BAT, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(stdout);
            console.log(stderr);
        });

    }

    uploadDatabases(param) {
        let data = xlsx.parse(param.filePath), databases = new Object();
        for (let table of data) {
            if("condition" === table.name) {
                databases[table.name] = core.constructionCondition(table);
            } else {
                databases[table.name] = core.constructionTable(table);
            }
        }
        core.writeData(databases,`${__dirname}/../databases/gree.db`);
    }
}

module.exports = DispatchTactics;
