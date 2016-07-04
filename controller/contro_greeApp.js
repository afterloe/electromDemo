/**
 * Created by afterloe on 7/1/2016.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const [core, utilContr] = [require("../bin/core"), require("../bin/util")];
let db = core.getDateBase(), planDB = core.readJson(`${__dirname}/../databases/plan.json`);

let allowDrop = ev => ev.preventDefault();

let drag = ev => ev.dataTransfer.setData("Text", ev.target.id);

let drop = (ev, flag) => {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("Text"), retDom = ev.target, tagDom = document.getElementById(data), command = tagDom.getElementsByClassName("tagSelect")[0];
    console.log("tag" === flag ? command.removeAttribute("disabled") : command.setAttribute("disabled", "disabled"));
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

let configurationPlanSnippet = selectPlain => {
    return `<div>233</div>`;
};

angular.module('GreeApp', ['ui.bootstrap']).controller('GreeCtrl', ($scope, $sce, $http, $timeout) => {
    require(`${__dirname}/../controller/contro_common`)($scope);
    $scope.dynamic = 25;
    $scope.commands = buildCommand();
    $scope.updateDB = () => {
        location.reload();
    };
    $scope.dbCommandsNumber = $scope.commands.length;
    $scope.TrustDangerousSnippet = snippet => $sce.trustAsHtml(snippet);
    $scope.loadPlain = plain => {
        console.log(plain);
    };
    $scope.selectFile = openFile;
    $scope.configurationPlan = {
        options: readConfigPlan(),
        selected: '选择装配方案'
    };
});