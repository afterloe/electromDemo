const [core, angularBoots, utilContr] = [require("../bin/core"), require("angular-ui-bootstrap"),require("../bin/util")];

let app = angular.module('indexApp', ['ui.bootstrap']).controller('indexCtrl', $scope => {

  require(`${__dirname}/../controller/contro_common`)($scope);
});
