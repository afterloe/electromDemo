const [core,msgSender] = [require("../bin/core"), require('electron').ipcRenderer];
const URL_MASTER = "http://mate.jwis.cn/busisystem/entry/busiEntry.do";

let accessObject = time => {
  time || (time = core.formatDate());
  return {
    time: time,
    Md5Str: core.hex_md5("busiSystemMate" + time)
  };
};

let _callback = null;

msgSender.on("hookInfo", (event,params) => {
  console.log("hookInfo --" + JSON.stringify(params));
  if(_callback) _callback(null,params);
});

msgSender.on("hookFail", (event,params) => {
  if(_callback) _callback(new Error(params));
});

module.exports.hook = (fileName,callback) => {
  msgSender.send("hook-file",{
    file : fileName
  });
  _callback = callback;
};

module.exports.noticeMaster = (instruction,_param) => {
  msgSender.send("system", {
    tacticBlock : instruction,
    _param
  });
};

module.exports.resMaster = (_param, callback) => {
  let {name} = _param;
  msgSender.on(name,(event,params) => {
    callback(null,params);
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
