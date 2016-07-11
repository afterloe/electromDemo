/**
 * Created by afterloe on 2016/7/10.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const [core, utilContr] = [require("../bin/core"), require("../bin/util")];

let configControlsApp = angular.module("configControlsApp", ["ngAnimate", "ui.bootstrap"]);

configControlsApp.controller("mainCtrl", ["$scope", "$rootScope", ($scope, $rootScope) => {
    require(`${__dirname}/../controller/contro_common`)($scope);
    //utilContr.hook(`${__dirname}/../test/replace.js`,(event,param) => {
    //    console.log(1234);
    //});
    //utilContr.hook(`${__dirname}/../test/hookFile.js`,(event,param) => {
    //    console.log(12345678);
    //});
}]);