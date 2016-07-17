/**
 * Created by afterloe on 7/1/2016.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const [core, utilContr] = [require("../bin/core"), require("../bin/util")];
const colorTag = ['label-default', 'label-primary', 'label-success', 'label-info', 'label-warning', 'label-danger'];
let db = core.getDateBase();

let init = $scope => {
    $scope.selectPlan = false;
    $scope.selectCase = true;
    $scope.optionalList = true;
};

let allowDrop = ev => ev.preventDefault();

let drag = ev => ev.dataTransfer.setData("modelName", ev.path[0].innerText);

let drop = ev => {
    ev.preventDefault();
    let modelName = ev.dataTransfer.getData("modelName"), level = Number.parseInt(ev.path[1].className.substring(ev.path[1].className.length - 1)) + 1,
        partHtml = `<h3 class="col-md-offset-${level}" ondrop="drop(event,'source')" ondragover="allowDrop(event)"><span class="label ${colorTag[level]}">${modelName}</span></h3>`;
    ev.path[1].innerHTML += partHtml;
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
    }
};

utilContr.resSystemInfo("uploadDatabases", (err, tacticBlock, data) => {
    console.log(JSON.stringify(err), tacticBlock, data);
    location.reload();
});

let openFile = () => {
    utilContr.noticeMaster("openFileDialog", {});
};

let buildOrderList = (ctrlListArr, $sce) => {
    let innerHtml = "";
    try {
        let partTable = db.get("part"), sequence = 0, max_sequence = colorTag.length - 1;
        ctrlListArr.forEach(ctrlList => {
            let ctrl = partTable.get(ctrlList.id);
            if (ctrl) {
                innerHtml += `<p class="lead">
            <h4><span class="label ${colorTag[sequence]}">${ctrlList.key}</span></h4>
                ${JSON.stringify(ctrl)}
            </p>`;
                sequence >= max_sequence ? 0 : sequence += 1;
            }
        });
    } catch (error) {
        console.log(error);
    }
    return $sce.trustAsHtml(innerHtml);
};

let selectPic = (produce, value) => `${produce}_${value}.jpg`;

let partType = () => {
    let _arr = new Array("请选择产品"), _type;
    try {
        for (let [key,value] of db.get("part").entries()) {
            _type = value.model;
            if (!_arr.find(__type => _type === __type)) _arr.push(_type);
        }
    } catch (err) {
        console.log(err);
    }
    return _arr;
};

let findBOM = produce => {
    let bom = new Array();
    try {
        for (let [key,value] of db.get("part").entries()) {
            if (produce === value.model) {
                if (!bom.find(_part => _part.type === value.type && _part.level === value.level - 1))
                    bom.push({
                        type: value.type,
                        level: value.level - 1,
                        partNum: value.partNum
                    });
            }
        }
    } catch (err) {
        console.log(err);
    }
    return bom;
};

let renderBOM = bom => {
    let bomHtml = "";
    try {
        bom.forEach(_part => {
            bomHtml += `<h3 class="col-md-offset-${_part.level}" ondrop="drop(event,'source')" ondragover="allowDrop(event)"><span class="label ${colorTag[_part.level]}">${_part.type}</span></h3>`;
        });
    } catch (err) {
        console.log(err);
    }
    return bomHtml;
};

let getPartsList = produce => {
    let group = new Array();
    try {
        for (let [key,value] of db.get("part").entries()) {
            if (produce === value.model) {
                if (!group.find(_part => _part.name === value.type))
                    group.push({
                        name: value.type
                    });
            }
        }
    } catch (err) {
        console.log(err);
    }
    return group;
};

let findParts = (produce, type) => {
    let partList = new Array();
    try {
        for (let [key,value] of db.get("part").entries()) {
            if (produce === value.model && type === value.type) {
                partList.push({
                    id: value.partNum,
                    enable: false,
                    value: `Part|No - ${value.partNum}`
                });
            }
        }
    } catch (err) {
        console.log(err);
    }
    return partList;
};

let buildCommands = (produce, bomList) => {
    let _commandList = new Array();
    try {
        bomList.forEach(_bom => {
            _commandList.push({
                name: _bom.type,
                options: findParts(produce, _bom.type)
            });
        });
    } catch (err) {
        console.log(err);
    }
    return _commandList;
};

let queryOptionSets = produce => {
    let _optionSets = new Array();
    try {
        for (let [key,value] of db.get("options").entries()) {
            if (produce === value.model) {
                _optionSets.push({
                    name: value.label,
                    options: value.options,
                    model: value.label
                });
            }
        }
    } catch (err) {
        console.log(err);
    }
    return _optionSets;
};

let queryRelatedSets = (produce, selectedModel) => {
    let relatedSets = new Array();
    try {
        for (let [key,value] of db.get("condition").entries()) {
            if (selectedModel.name === value.primary && produce === value.model && selectedModel.model == value.selected)
                relatedSets.push(value);
        }
    } catch (err) {
        console.log(err);
    }
    return relatedSets;
};

let changeOptions = function (range) {
    this.forEach(option => {
        range.forEach(number => option.enable = false);
        range.forEach(number => {
            if (option.id == number)
                option.enable = true;
        });
    });
};

let queryCtrls = function (optionSets) {
    this.forEach(ctrl => {
        optionSets.forEach(optionSet => {
            if (ctrl.name === optionSet.foreign) {
                changeOptions.apply(ctrl.options, [optionSet.range]);
            }
        });
    });
};

let GreeApp = angular.module('GreeApp', ['ngAnimate', 'ui.bootstrap']);

GreeApp.controller("optionalListCtr", ['$scope', '$rootScope', '$selectPlain', '$uibModal', '$sce', ($scope, $rootScope, $selectPlain, $uibModal, $sce) => {
    $scope.selectRandom = "userLogo.png";
    $scope.planName = "请选型";

    $rootScope.$on("optionalList", () => {
        $scope.selectPlan = false;
        $scope.planName = $selectPlain.getProduce();
        $scope.TrustDangerousSnippet = buildOrderList($selectPlain.getSelectPlan(), $sce, $scope);
        $scope.selectRandom = selectPic($selectPlain.getProduce(), $selectPlain.getPlanName());
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
        $rootScope.$broadcast("nextPlan");
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

    $scope.clickOption = model => {
        let relatedSets = queryRelatedSets($selectPlain.getProduce(), model);
        queryCtrls.apply($scope.commands, [relatedSets]);
    };

    $scope.exportSelect = () => {
        let solutionPlane = new Array();
        for (let ctrl of $scope.commands) {
            solutionPlane.push({
                id: ctrl.selected,
                key: ctrl.name
            });
        }
        for (let selected of $scope.optionSets) {
            if ("外壳" === selected.name) $selectPlain.setPlanName(selected.model);
        }
        $rootScope.$broadcast("nextPlan");
        $selectPlain.setSelectPlan(solutionPlane);
        $rootScope.$broadcast("optionalList");
        /**
         * 写出指定位置写出XML
         *
         utilContr.noticeMaster("writeSelectedData", {
            name: "xxx",
            data: solutionPlane
        });
         **/
    };

    $rootScope.$on("loadPlanInSelection", () => {
        $scope.sourcePlan = false;
        $scope.commands = buildCommands($selectPlain.getProduce(), $selectPlain.getPlan());
        $scope.optionSets = queryOptionSets($selectPlain.getProduce());
    });
}]);

/**
 * 选择配置方案 控制器
 */
GreeApp.controller("selectPlanCtr", ['$scope', '$sce', '$uibModal', '$log', '$rootScope', '$selectPlain', ($scope, $sce, $uibModal, $log, $rootScope, $selectPlain) => {

    $scope.products = {
        options: partType(),
        selected: "请选择产品"
    };

    $scope.TrustDangerousSnippet = snippet => $sce.trustAsHtml(snippet);
    $scope.productsNum = $scope.products.options.length - 1;

    $scope.loadBom = selected => {
        let bomObject = findBOM(selected);
        $scope.bom = renderBOM(bomObject);
        $scope.partGroups = getPartsList(selected);
        $selectPlain.setProduce(selected);
        $selectPlain.setPlan(bomObject);
    };

    $scope.changeLi = (index, type) => {
        $scope.partGroups.forEach(_group => {
            _group.active = false;
            _group.parts = null;
        });
        $scope.partGroups[index].active = true;
        $scope.partGroups[index].parts = findParts($selectPlain.getProduce(), type);
        $scope.partGroups[index].number = $scope.partGroups[index].parts.length;
    };

    $scope.selectFile = openFile;
    $scope.updateDB = () => {
        location.reload();
    };

    $scope.nextStep = planName => {
        $rootScope.$broadcast("nextPlan");
        $rootScope.$broadcast("loadPlanInSelection");
    };
}]);


GreeApp.service('$selectPlain', function () {
    let plan, selectPlan, planName, produce;
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
        },
        setProduce: value => {
            produce = value;
        },
        getProduce: () => {
            return produce;
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
        $scope.dynamic += 33;
        $scope.planNumber++;
        if ($scope.planNumber > 3) return;
        selectPlan.apply($scope, [$scope.planNumber]);
    });

    $rootScope.$on("backPlan", () => {
        $scope.planNumber -= 1;
        $scope.dynamic -= 33;
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