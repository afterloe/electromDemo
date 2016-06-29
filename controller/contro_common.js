module.exports = $scope => {
  let ipc = require('electron').ipcRenderer;
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
