/**
 * Created by afterloe on 6/29/2016.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const tacitcsTemplate = require("../domain/dispatchTactics");

module.exports = electron => {
    let ipc = electron.ipcMain, dispatchTactics = new tacitcsTemplate(electron);

    ipc.on("system",(event,param) => {
        let {tacticBlock, _param, tacticName} = param;
        tacticBlock = dispatchTactics[tacticBlock];
        if(tacticBlock)
            tacticBlock.apply(dispatchTactics,[_param]);
        else {
            event.sender.send("no such this tactic!");
        }
    });

    // ipc.on('open-file-dialog', (event, obj) => {
    //   console.log(obj); // ==>  { age: 5, name: 'afterloe' }
    //   event.sender.send("receive-message", obj); // ==> 反向通讯
    //   dialog.showOpenDialog({
    //     properties: ['openFile', 'openDirectory']
    //   }, files => {
    //     if (files) event.sender.send('selected-directory', files);
    //   });
    // });
};
