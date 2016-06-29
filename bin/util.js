const [core,msgSender] = [require("../bin/core"), require('electron').ipcRenderer];
// const URL_MASTER = "http://192.168.1.153:8080/busisystem/entry/busiEntry.do";
const URL_MASTER = "http://mate.jwis.cn/busisystem/entry/busiEntry.do";

let accessObject = time => {
  time || (time = core.formatDate())
  return {
    time: time,
    Md5Str: core.hex_md5("busiSystemMate" + time)
  };
};

module.exports.noticeMaster = (instruction,_param) => {
  msgSender.send("system", {
    tacticBlock : instruction,
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
