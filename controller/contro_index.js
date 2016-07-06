const [core, angularBoots, utilContr] = [require("../bin/core"), require("angular-ui-bootstrap"),require("../bin/util")];

let app = angular.module('indexApp', ['ui.bootstrap']).controller('indexCtrl', $scope => {

  require(`${__dirname}/../controller/contro_common`)($scope);
  $scope.index_flowAdd = "欢迎使用TRU mate";
  /**
   * 日历控件
   */
  $scope.flag_calendar = true;
  $scope.options = {
    showWeeks: true
  };
  $scope.openCalendar = () => {
    $scope.flag_calendar = !$scope.flag_calendar;
  };

  /**
   * 广告轮播
   */
  $scope.timeInterval = 7000; // 切换时间
  $scope.noWrapSlides = false; // 关闭循环
  $scope.slides = [{
    image: `${__dirname}/../sources/68747470733a2f2f636c6f75642e67697468756275736572636f6e74656e742e636f6d2f6173736574732f313433363237312f31323636383232372f61666565366135322d633639372d313165352d396231392d6338383061306535343133322e676966.gif`,
    text: "Destop IOT - eclipse v0.0.1",
    id: 0
  }, {
    image: `${__dirname}/../sources/quick.png`,
    text: "Engineer Mate v1.7.0",
    id: 1
  }, {
    image: `${__dirname}/../sources/68747470733a2f2f6769746875622e636f6d2f61626533332f61746f6d2d7069676d656e74732f626c6f622f6d61737465722f7265736f75726365732f6765742d73636f70652e6769663f7261773d74727565.gif`,
    text: "配置选型 Demo v0.0.1",
    plugin : `${__dirname}/../views/greeIndex.html`,
    id: 2
  }];

  $scope.openApp = (id,text,plugin_url) => {
    utilContr.noticeMaster("openFrameWindow",{
      title : text,
      url : plugin_url
    });
  }
});
