/**
 * Created by afterloe on 2016/7/10.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const [core, utilContr, ipc] = [require("../bin/core"), require("../bin/util"), require('electron').ipcRenderer];

let configControlsApp = angular.module("configControlsApp", ["ngAnimate", "ui.bootstrap"]);

configControlsApp.controller("mainCtrl", ["$scope", "$rootScope", ($scope, $rootScope) => {
    require(`${__dirname}/../controller/contro_common`)($scope);
}]);