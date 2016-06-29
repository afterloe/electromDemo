module.exports = $scope => {
  let ipc = require('electron').ipcRenderer;
  $scope.mate_user_pic = `${__dirname}/../sources/userLogo.png`;
  $scope.mate_index_title = `欢迎您 - afterloe`;
  /**
   * 关闭 webView
   */
  $scope.closeWindow = () => {
    ipc.send("system", {
      tacticBlock : "closeWindow"
    });
  }

  /**
   * 最小化 webView
   */
  $scope.minWindow = () => {
    ipc.send("system", {
      tacticBlock : "miniWindow"
    });
  }
}
