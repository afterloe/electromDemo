const [core,windowBuilder,fs,xlsx,exec] = [require("../bin/core"), require("../domain/windowBuilder"), require("fs"), require("node-xlsx"),require('child_process').exec];

const PRO_Engineer_BAT = "F:/my.bat";

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
            let classObject = new Object(), datas = table.data, dataItem, tableMap;
            datas.forEach((item, index) => {
                if (!dataItem) {
                    tableMap = new Object(); // 构建表
                    //databases.set(table.name, tableMap); // 将表添加到数据库中
                    databases[table.name] = tableMap;
                }
                if (0 === index) {
                    item.forEach(value => {
                        classObject[value] = null; // 构建表的schema
                    });
                } else {
                    dataItem = new Object();
                    Object.keys(classObject).forEach((key, value) => {
                        dataItem[key] = item[value]; // 将零散的数据组成表数据
                    });
                    //tableMap.set(index, dataItem);  // 将数据写入到刚刚构建的表中
                    tableMap[index] = dataItem;
                }
            });
        }
        core.writeData(databases,`${__dirname}/../databases/gree.db`);
    }
}

module.exports = DispatchTactics;
