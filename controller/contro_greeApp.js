/**
 * Created by afterloe on 7/1/2016.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const [core, utilContr] = [require("../bin/core"), require("../bin/util")];
const colorTag = ['label-default', 'label-primary', 'label-success', 'label-info', 'label-warning', 'label-danger'];
let db = core.getDateBase(), planDB = core.readJson(`${__dirname}/../databases/plan.json`), newItem = new Array();

let init = $scope => {
    $scope.selectPlan = false;
    $scope.selectCase = true;
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
        newItem.push({data, tagDom: tagDom.innerHTML});
    } else {
        let index = newItem.findIndex(item => item.data == data);
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
            this.optionalList = true;
            break;
        case 2 :
            this.selectPlan = true;
            this.selectCase = false;
            this.optionalList = true;
            break;
        case 3 :
            this.selectPlan = true;
            this.selectCase = true;
            this.optionalList = false;
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

let buildCommands = condition => {
    let commandArr = new Array(), command;
    if (condition) {
        for (let cond of condition) {
            for (let [tableName,table] of db.entries()) {
                if (cond !== tableName) continue;
                command = new Object();
                command.id = tableName;
                command.key = tableName;
                command.name = tableName;
                command.options = assemblyCommands(table);
                commandArr.push(command);
            }
        }
    } else {
        for (let [tableName,table] of db.entries()) {
            if ("condition" === tableName) continue;
            command = new Object();
            command.id = tableName;
            command.key = tableName;
            command.name = tableName;
            command.options = assemblyCommands(table);
            commandArr.push(command);
        }
    }
    return commandArr;
};

let assemblyCommands = item => {
    let options = new Array();
    for (let value of item.values()) {
        options.push({
            key: value["id"],
            value: core.values(value, 0)
        });
    }
    return {
        options, selected: options[0]
    };
};

utilContr.resSystemInfo("uploadDatabases", (err, tacticBlock, data) => {
    console.log(JSON.stringify(err), tacticBlock, data);
    location.reload();
});

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

let buildOrderList = (arr, $sce, $scope) => {
    let innerHtml = "", sequence = 0, max_sequence = colorTag.length - 1, value;
    for (let type of arr) {
        value = type.selected.value.join(" ");
        innerHtml += `<h4><span class="label ${colorTag[sequence]}">${type.id}</span>
                            <small class="pull-right">${value}</small>
                        </h4>`;
        if ("能力" == type.id) selectPic(value, $scope);
        sequence == max_sequence ? sequence = 0 : sequence++;
    }
    return $sce.trustAsHtml(innerHtml);
};

let getConditionsByName = name => {
    let condition = new Array();
    for (let [key,value] of db.get("condition").entries()) {
        if (name === value.execute) condition.push(value);
    }
    return condition;
};

let getOptions = (name, rang) => {
    let table = db.get(name), options = new Array(), values;
    rang.forEach(value => {
        if ("string" == typeof value) value = Number.parseInt(value);
        if (table.has(value)) {
            values = table.get(value);
            options.push({
                key: value,
                value: core.values(values, 0)
            });
        }
    });
    return options;
};

let selectPic = (value, $scope) => {
// TODO
//    $scope.selectRandom = "小壳体.png";
//    $scope.selectRandom = "中壳体.png";
    $scope.selectRandom = "大壳体.png";
};

let transformValue = (value, label) => {
    if ("能力" === label)
        return value.value[0];
    else
        return value.key;
};

let GreeApp = angular.module('GreeApp', ['ngAnimate', 'ui.bootstrap']);

GreeApp.controller("optionalListCtr", ['$scope', '$rootScope', '$selectPlain', '$uibModal', '$sce', ($scope, $rootScope, $selectPlain, $uibModal, $sce) => {
    $scope.selectRandom = "userLogo.png";
    $scope.planName = "请选型";

    $rootScope.$on("optionalList", () => {
        $scope.selectPlan = false;
        $scope.planName = $selectPlain.getPlanName();
        $scope.TrustDangerousSnippet = buildOrderList($selectPlain.getSelectPlan(), $sce, $scope);
    });

    $scope.openPro = () => {
        $uibModal.open({
            animation: true,
            templateUrl: 'alertMessage.html',
            controller: 'altMsgCtr',
            size: "sm",
            resolve: {
                message: {
                    context: "正在打开PRO Engineer",
                    title: "这里！"
                }
            }
        });

        utilContr.noticeMaster("openProEngineer");
    };

    $scope.break = num => {
        $rootScope.$broadcast("backPlan");
    };
}]);

/**
 * 壳体选择控制器
 */
GreeApp.controller("selectCaseCtr", ['$scope', '$rootScope', '$sce', '$selectPlain', ($scope, $rootScope, $sce, $selectPlain) => {
    $scope.sourcePlan = true;
    $scope.break = () => {
        $rootScope.$broadcast("backPlan");
    };

    $scope.checkOthers = (selectOption, label) => {
        let conditions = getConditionsByName(label), value = transformValue(selectOption.selected, label), flagArr = new Array(), _flag;
        if (conditions.length > 0) { // 如果条件存在 则循环删除个个command的信息
            $scope.commands.forEach(control => {
                conditions.forEach(condition => {
                    if(control.name === condition.target){
                        _flag = (value >= condition.min && value <= condition.max);
                        flagArr.push(_flag);
                        if(_flag){
                            control.options.options = getOptions(condition.target, condition.rang);
                            if (control.options.options.length > 0) {
                                control.options.selected = control.options.options[0];
                                control.error = false;
                            } else
                                control.error = true;
                        }
                    }
                });
                if(flagArr.length > 0) {
                    let flag = false;
                    flagArr.forEach(_flag => _flag ? flag = true : null);
                    if(!flag){
                        control.options.options = new Array();
                        control.options.selected = {};
                        control.error = true;
                    }
                }
            });
        }
    };

    $scope.selectChange = dom => console.log(dom);

    $scope.exportSelect = () => {
        let solutionPlane = new Array();
        for (let command of $scope.commands) {
            solutionPlane.push({
                id: command.id,
                key : command.options.selected.key,
                selected: command.options.selected
            });
        }
        $rootScope.$broadcast("nextPlan");
        $selectPlain.setSelectPlan(solutionPlane);
        $rootScope.$broadcast("optionalList");
        // 写出指定位置写出XML
        utilContr.noticeMaster("writeSelectedData",{
            name : "xxx",
            data : solutionPlane
        });
    };

    $rootScope.$on("loadPlanInSelection", () => {
        $scope.sourcePlan = false;
        $scope.commands = buildCommands($selectPlain.getPlan());
    });
}]);

/**
 * 选择配置方案 控制器
 */
GreeApp.controller("selectPlanCtr", ['$scope', '$sce', '$uibModal', '$log', '$rootScope', '$selectPlain', ($scope, $sce, $uibModal, $log, $rootScope, $selectPlain) => {
    $scope.commands = buildCommands();

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
            let commandList = new Array();
            innerHtml = ``;
            obj.forEach(command => {
                innerHtml += command.tagDom;
                commandList.push(command.data);
            });
            $selectPlain.setPlanName(plainName);
            $selectPlain.setPlan(commandList);
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
            core.writeData(newItem, `${__dirname}/../databases/${planName}.plan`);
            planDB.push(planName);
            core.writeData(planDB, `${__dirname}/../databases/plan.json`);
            $scope.btn_select = true;
            $scope.btn_save = false;
        }, () => {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.nextStep = planName => {
        // TODO
        newItem = new Array();
        $rootScope.$broadcast("nextPlan");
        $rootScope.$broadcast("loadPlanInSelection");
    };
}]);


GreeApp.service('$selectPlain', function () {
    let plan = '', selectPlan = '', planName = '';
    return {
        getPlan: () => {
            return plan;
        },
        setPlan: value => {
            plan = value;
        },
        getSelectPlan: () => {
            return selectPlan;
        },
        setSelectPlan: value => {
            selectPlan = value;
        },
        getPlanName: () => {
            return planName;
        },
        setPlanName: value => {
            planName = value;
        }
    };
});

/**
 * 主页控制器
 */
GreeApp.controller("GreeCtrl", ['$scope', '$rootScope', ($scope, $rootScope) => {
    require(`${__dirname}/../controller/contro_common`)($scope);
    init($scope);
    $scope.planNumber = 1;
    $scope.selectTab = TabNum => {
        $scope.planNumber = TabNum;
        selectPlan.apply($scope, [TabNum]);
    };
    $scope.dynamic = 0;

    $rootScope.$on("nextPlan", () => {
        $scope.planNumber++;
        selectPlan.apply($scope, [$scope.planNumber]);
    });

    $rootScope.$on("backPlan", () => {
        $scope.planNumber--;
        selectPlan.apply($scope, [$scope.planNumber]);
    });
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

GreeApp.controller('altMsgCtr', ($scope, $uibModalInstance, message) => {
    $scope.messageTitle = message.title;
    $scope.messageContext = message.context;
    $scope.ok = () => {
        $uibModalInstance.close();
    };

    $scope.cancel = () => {
        $uibModalInstance.dismiss('cancel');
    };
});