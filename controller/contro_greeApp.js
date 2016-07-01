/**
 * Created by afterloe on 7/1/2016.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const [core, utilContr] = [require("../bin/core"), require("../bin/util")];

angular.module('GreeApp', ['ui.bootstrap']).controller('GreeCtrl', ($scope, $http, $timeout) => {
    require(`${__dirname}/../controller/contro_common`)($scope);
    $scope.dynamic = 25;
    $scope.dynamicPopover = {
        content: 'Hello, World!',
        templateUrl: 'myPopoverTemplate.html',
        title: 'Title'
    };

    $scope.placement = {
        options: [
            'top',
            'top-left',
            'top-right',
            'bottom',
            'bottom-left',
            'bottom-right',
            'left',
            'left-top',
            'left-bottom',
            'right',
            'right-top',
            'right-bottom'
        ],
        selected: 'top'
    };
});

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("Text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    console.log(ev.dataTransfer.getData("Text"));
    var data = ev.dataTransfer.getData("Text");
    ev.target.appendChild(document.getElementById(data));
}