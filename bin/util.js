const [core,msgSender] = [require("../bin/core"), require('electron').ipcRenderer];
const URL_MASTER = "http://mate.jwis.cn/busisystem/entry/busiEntry.do";

let accessObject = time => {
    time || (time = core.formatDate());
    return {
        time: time,
        Md5Str: core.hex_md5("busiSystemMate" + time)
    };
};

let _callback = new Array(), systemInfoCallback = new Array();

msgSender.on("hookInfo", (event, params) => {
    let fileType = params[2],index = _callback.findIndex(registered => fileType == registered.fileName),object;
    if(index != -1){
        object = _callback[index];
        object.callback(params);
    }
});

msgSender.on("hookFail", (event, params) => {
    let fileType = params[2],index = _callback.findIndex(registered => fileType === registered.fileName),object;
    if(index != -1){
        object = _callback[index];
        object.callback.apply(this,params);
    }
});

msgSender.on("executeInfo", (event, params) => {
    let _object = systemInfoCallback.find(__object => __object.tacticBlock === params[1]);
    if(_object){
        _object.callback.apply(null,params);
    }
});

msgSender.on("executeFail", (event, params) => {
    let _object = systemInfoCallback.find(__object => __object.tacticBlock === params[1]);
    if(_object){
        _object.callback.apply(null,params);
    }
});

module.exports.resSystemInfo = (tacticBlock,callback) => {
    if(-1 === systemInfoCallback.findIndex(_object => tacticBlock === _object.tacticBlock)){
        systemInfoCallback.push({
            tacticBlock,callback
        });
    }
};

module.exports.hook = (fileName, callback) => {
    msgSender.send("hook-file", {
        file: fileName
    });
    _callback.push({
        fileName, callback
    });
};

module.exports.noticeMaster = (instruction, _param) => {
    msgSender.send("system", {
        tacticBlock: instruction,
        _param
    });
};

module.exports.accessMaster = ($http, _data, callback) => {
    Object.assign(_data, accessObject());
    $http({
        method: 'POST',
        url: URL_MASTER,
        headers: {
            source: "pc",
            language: "ZH",
            token: "110102030112"
        },
        params: {
            paramObject: JSON.stringify(_data)
        }
    }).then(response => {
        if (callback && callback instanceof Function) {
            let {
                error,
                status,
                data
                } = response;
            if (200 != status) error = new Error("请求失败");
            callback(error, data);
        }
    });
};
