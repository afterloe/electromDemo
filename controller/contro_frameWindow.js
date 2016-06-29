const [core, angularBoots, utilContr] = [require("../bin/core"), require("angular-ui-bootstrap"), require("../bin/util")];

console.log(window.location.href);
let webView = window.document.getElementById("context_webView");
angular.module('frameWindowApp', ['ui.bootstrap']).controller('frameWindowCtrl', ($scope, $http, $timeout) => {
    require(`${__dirname}/../controller/contro_common`)($scope);
    let webViewHeight = window.innerHeight - 100;
    $scope.context_height = `height: ${webViewHeight}px`;
    webView.src = "http://www.baidu.com";
    $scope.loadPage = url => {
        webView.src = url;
    };

    $scope.title = "Hello World ! v1.4.130";
    $scope.tabs = [
        {title: 'MacBook Pro', url: "http://www.jd.com"},
        {title: '华为mate', url: "http://www.baidu.com"},
        {title: 'Eclipse che v4.0.1', url: "http://192.168.2.128:8080"},
        {title: 'ipad pro 12.7c', url: "http://www.baidu.com"},
        {title: '银魂', url: "http://www.baidu.com"}
    ];
});
