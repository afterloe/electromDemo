const [core, angularBoots, utilContr] = [require("../bin/core"), require("angular-ui-bootstrap"), require("../bin/util")];

let webView = window.document.getElementById("context_webView");
angular.module('frameWindowApp', ['ui.bootstrap']).controller('frameWindowCtrl', ($scope, $http, $timeout) => {
    require(`${__dirname}/../controller/contro_common`)($scope);

    let webViewHeight = window.innerHeight - 100;
    $scope.context_height = `height: ${webViewHeight}px`; // 设置webView高度
    $scope.loadPage = url => {
        webView.src = url;
    };

    $scope.title = "配置选型 Demo v0.0.1";
    $scope.tabs = [
        {title: '配置选型 Demo v0.0.1', url: `file://${__dirname}/../views/index.html`},
        {title: 'Engineer Mate v1.7.0', url: `http://www.baidu.com`},
        {title: 'Destop IOT - eclipse v0.0.1', url: `http://192.168.2.128:8080`}
    ];
});
