/**
 * Created by afterloe on 7/1/2016.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const [core, utilContr] = [require("../bin/core"), require("../bin/util")];
let db = core.getDateBase(), planDB = core.readJson(`${__dirname}/../databases/plan.json`), newItem = new Array();

let allowDrop = ev => ev.preventDefault();

let drag = ev => ev.dataTransfer.setData("Text", ev.target.id);

let drop = (ev, flag) => {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("Text"), retDom = ev.target, tagDom = document.getElementById(data), command = tagDom.getElementsByClassName("tagSelect")[0];
    flag = "tag" === flag;
    console.log(flag);
    if(flag){
        command.removeAttribute("disabled");
        newItem.push(tagDom);
    }else{
        let index = newItem.findIndex(item => item == tagDom);
        if(index > -1) newItem.splice(index,1);
        command.setAttribute("disabled", "disabled");
    }
    if (retDom.getAttribute("electron-drop"))
        retDom.appendChild(tagDom);
    else {
        document.getElementById("tag" === flag ? "newSelectOrder" : "systemOrder").appendChild(tagDom);
    }
};

let buildCommand = () => {
    let commandArr = new Array(), command;
    for (let [tableName,table] of db.entries()) {
        command = new Object();
        command.id = tableName;
        command.name = tableName;
        command.innerHtml = buildSelect(table);
        commandArr.push(command);
    }
    return commandArr;
};

let buildSelect = item => {
    let innerHtml = `<select class="form-control tagSelect" disabled="disabled">`, flag = true;
    for (let value of item.values()) {
        value = Object.values(value).join(",");
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
    if(!planDB){
        planDB = new Array();
        planDB.push("选择装配方案");
        planDB.push("新建选配方案");
        core.writeData(planDB,`${__dirname}/../databases/plan.json`);
    }
    return planDB;
};
let app = angular.module('GreeApp', ['ui.bootstrap']);
app.controller('GreeCtrl', ($scope, $sce, $uibModal, $log, $http, $timeout) => {
    require(`${__dirname}/../controller/contro_common`)($scope);
    $scope.dynamic = 25;
    $scope.commands = buildCommand();
    $scope.updateDB = () => {
        location.reload();
    };
    $scope.dbCommandsNumber = $scope.commands.length;
    $scope.TrustDangerousSnippet = snippet => $sce.trustAsHtml(snippet);
    $scope.loadPlain = plainName => {
        $scope.btn_create = !$scope.btn_create;
        $scope.assemblyPlain = ``;
    };
    $scope.selectFile = openFile;
    $scope.configurationPlan = {
        options: readConfigPlan(),
        selected: '选择装配方案'
    };
    $scope.assemblyPlain = `<br/>`;

    $scope.items = ['item1', 'item2', 'item3'];
    $scope.saveConfigurationPlan = () => {
        //let modalInstance = $uibModal.open({
        //    animation : true,
        //    templateUrl: 'myModalContent.html',
        //    controller: 'ModalInstanceCtrl',
        //    size: "lg",
        //    resolve: {
        //        items: function () {
        //            return $scope.items;
        //        }
        //    }
        //});
        //
        //modalInstance.result.then(function (selectedItem) {
        //    $scope.selected = selectedItem;
        //}, function () {
        //    $log.info('Modal dismissed at: ' + new Date());
        //});

        //let name = window.prompt("输入项目名");
        //console.log(name);
        newItem.forEach(item => planDB.push(item.innerHTML));
        console.log(planDB);
        //core.writeData(planDB,`${__dirname}/../databases/plan.json`);
    };
});

app.controller('ModalInstanceCtrl', ($scope, $uibModalInstance, items) => {
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});