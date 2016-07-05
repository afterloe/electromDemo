/**
 * Created by afterloe on 7/1/2016.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const [core, utilContr] = [require("../bin/core"), require("../bin/util")];

let db = core.getDateBase(), planDB = core.readJson(`${__dirname}/../databases/plan.json`), newItem = new Array();

let init = $scope => {
    $scope.selectPlan = false;
    $scope.selectCase = true;
    $scope.selectBlower = true;
    $scope.selectElectricalBox = true;
    $scope.selectEvaporator = true;
    $scope.optionalList = true;
};

let allowDrop = ev => ev.preventDefault();

let drag = ev => ev.dataTransfer.setData("Text", ev.target.id);

let drop = (ev, flag) => {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("Text"), retDom = ev.target, tagDom = document.getElementById(data), command = tagDom.getElementsByClassName("tagSelect")[0];
    flag = "tag" === flag;
    if (flag) {
        command.removeAttribute("disabled");
        newItem.push(tagDom);
    } else {
        let index = newItem.findIndex(item => item == tagDom);
        if (index > -1) newItem.splice(index, 1);
        command.setAttribute("disabled", "disabled");
    }
    if (retDom.getAttribute("electron-drop"))
        retDom.appendChild(tagDom);
    else {
        document.getElementById("tag" === flag ? "newSelectOrder" : "systemOrder").appendChild(tagDom);
    }
};

let selectPlan = function (tabNumber) {
    switch (tabNumber) {
        case 1 :
            this.selectPlan = false;
            this.selectCase = true;
            this.selectBlower = true;
            this.selectElectricalBox = true;
            this.selectEvaporator = true;
            this.optionalList = true;
            break;
        case 2 :
            this.selectPlan = true;
            this.selectCase = false;
            this.selectBlower = true;
            this.selectElectricalBox = true;
            this.selectEvaporator = true;
            this.optionalList = true;
            break;
        case 3 :
            this.selectPlan = true;
            this.selectCase = true;
            this.selectBlower = false;
            this.selectElectricalBox = true;
            this.selectEvaporator = true;
            this.optionalList = true;
            break;
        case 4 :
            this.selectPlan = true;
            this.selectCase = true;
            this.selectBlower = true;
            this.selectElectricalBox = false;
            this.selectEvaporator = true;
            this.optionalList = true;
            break;
        case 5 :
            this.selectPlan = true;
            this.selectCase = true;
            this.selectBlower = true;
            this.selectElectricalBox = true;
            this.selectEvaporator = false;
            this.optionalList = true;
            break;
        case 6 :
            this.selectPlan = true;
            this.selectCase = true;
            this.selectBlower = true;
            this.selectElectricalBox = true;
            this.selectEvaporator = true;
            this.optionalList = false;
            break;
    }
};

let buildCommand = () => {
    let commandArr = new Array(), command;
    for (let [tableName,table] of db.entries()) {
        command = new Object();
        command.id = tableName;
        command.name = tableName;
        command.innerHtml = buildSelect(table, tableName);
        commandArr.push(command);
    }
    return commandArr;
};

let buildSelect = (item, tableName) => {
    let innerHtml = `<select class="form-control tagSelect" disabled="disabled" ng-model="${tableName}">`, flag = true;
    for (let value of item.values()) {
        value = core.values(value).join(",");
        if (flag) {
            flag = false;
            innerHtml += `<option label="${value}" value="${value}" selected="selected">${value}</option>`;
        }
        else
            innerHtml += `<option label="${value}" value="${value}">${value}</option>`;
    }
    innerHtml += `</select>`;
    return innerHtml;
};

let openFile = () => {
    utilContr.noticeMaster("openFileDialog", {});
};

let readConfigPlan = () => {
    if (!planDB) {
        planDB = new Array();
        planDB.push("选择装配方案");
        planDB.push("新建选配方案");
        core.writeData(planDB, `${__dirname}/../databases/plan.json`);
    }
    return planDB;
};

let GreeApp = angular.module('GreeApp', ['ngAnimate', 'ui.bootstrap']);

GreeApp.controller("optionalListCtr",['$scope', ($scope) => {

}]);

GreeApp.controller("selectEvaporatorCtr",['$scope', ($scope) => {

}]);

GreeApp.controller("selectElectricalBoxCtr",['$scope', ($scope) => {

}]);

GreeApp.controller("selectBlowerCtr",['$scope', ($scope) => {

}]);

/**
 * 壳体选择控制器
 */
GreeApp.controller("selectCaseCtr",['$scope', '$rootScope', ($scope,$rootScope) => {

}]);

/**
 * 选择配置方案 控制器
 */
GreeApp.controller("selectPlanCtr",['$scope','$sce','$uibModal','$log', ($scope,$sce,$uibModal,$log) => {
    $scope.commands = buildCommand();

    $scope.updateDB = () => {
        location.reload();
    };
    $scope.dbCommandsNumber = $scope.commands.length;
    $scope.planNumber = planDB ? planDB.length - 2 : 0;

    $scope.TrustDangerousSnippet = snippet => $sce.trustAsHtml(snippet);

    $scope.loadPlain = plainName => {
        let obj = core.readJson(`${__dirname}/../databases/${plainName}.plan`), innerHtml;
        $scope.assemblyPlain = '';
        if (obj) {
            innerHtml = ``;
            obj.forEach(command => {
                innerHtml += command;
            });
            $scope.btn_select = true;
            $scope.btn_save = false;
            $scope.assemblyPlain = innerHtml;
        } else {
            if ("新建选配方案" === plainName) {
                $scope.btn_create = false;
                $scope.btn_select = false;
                $scope.btn_save = true;
            } else {
                $scope.btn_save = false;
                $scope.btn_select = false;
            }
            $scope.assemblyPlain = ``;
        }
    };

    $scope.selectFile = openFile;
    $scope.configurationPlan = {
        options: readConfigPlan(),
        selected: '选择装配方案'
    };
    $scope.assemblyPlain = `<br/>`;

    $scope.saveConfigurationPlan = () => {
        let modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: undefined
        });

        modalInstance.result.then(planName => {
            let plain = new Array();
            newItem.forEach(item => plain.push(item.innerHTML));
            core.writeData(plain, `${__dirname}/../databases/${planName}.plan`);
            planDB.push(planName);
            plain = null;
            core.writeData(planDB, `${__dirname}/../databases/plan.json`);
        }, () => {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.nextStep = planName => {
        $scope.selectPlan = true;
        $scope.selectCase = false;
    };
}]);

/**
 * 主页控制器
 */
GreeApp.controller("GreeCtrl",['$scope', '$rootScope', ($scope,$rootScope) => {
    require(`${__dirname}/../controller/contro_common`)($scope);
    init($scope);
    $scope.selectTab = TabNum => {
        selectPlan.apply($scope, [TabNum]);
    };
    $scope.dynamic = 0;
}]);

/**
 * 模态框控制器
 */
GreeApp.controller('ModalInstanceCtrl', ($scope, $uibModalInstance) => {
    $scope.ok = () => {
        $uibModalInstance.close($scope.planName);
    };

    $scope.cancel = () => {
        $uibModalInstance.dismiss('cancel');
    };
});
