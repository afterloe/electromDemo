/**
 * Created by afterloe on 6/29/2016.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const [tacitcsTemplate,EasyHook,fs] = [require("../domain/dispatchTactics"), require("../domain/easyHook"), require("fs")];
let hookList = new Array();

module.exports = electron => {
    let ipc = electron.ipcMain, dispatchTactics = new tacitcsTemplate(electron);

    ipc.on("system", (event, param) => {
        let {tacticBlock, _param} = param;
        tacticBlock = dispatchTactics[tacticBlock];
        if (tacticBlock)
            tacticBlock.apply(dispatchTactics, [_param, (...args) => {
                event.sender.send("executeInfo",args);
            }]);
        else {
            event.sender.send("executeFail","no such this tactic!");
        }
    });

    ipc.on("hook-file", (event, param) => {
        let {file} = param;
        try{
            if(-1 != hookList.findIndex(item => item == file)) throw new Error("arrayListen");
            hookList.push(file);
            let hook = new EasyHook(fs.watchFile);
            hook.setHookFile(file);
            hook.startTask((...args) => {
                event.sender.send("hookInfo", args);
            });
            console.log("execute hook file -- " + file);
        }catch(err){
            console.log(err);
            event.sender.send("hookFail", err.message);
        }
    });
};
