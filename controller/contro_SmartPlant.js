/**
 * Created by afterloe on 16-7-18.
 */
const [core, utilContr] = [require("../bin/core"), require("../bin/util")];

let dropEventTrigger = (() => {
    let callbackArr = new Array();

    return {
        register: _callback => {
            return _callback in callbackArr ? true : callbackArr.push(_callback);
        },
        execute: (...args) => {
            callbackArr.forEach(_callback => {
                if (_callback.apply) _callback.apply(this, args);
            });
        }
    };

})();

let allowDrop = ev => ev.preventDefault();

let drag = ev => ev.dataTransfer.setData("equipment_id", ev.path[0].getAttribute("data-ip"));

let drop = ev => {
    dropEventTrigger.execute(ev.dataTransfer.getData("equipment_id"));
};

let SmartPlant = angular.module('SmartPlant', ['ngAnimate', 'ui.bootstrap']);

/**
 * 主页控制器
 */
SmartPlant.controller("SmartPlantCtrl", ['$scope', '$postgres', ($scope, $postgres) => {
    require(`${__dirname}/../controller/contro_common`)($scope);
    $scope.timers = 0;
    dropEventTrigger.register((...args) => {
        let [ip] = args;
        if ($scope.task) {
            clearInterval($scope.task);
        } else {
            $scope.task = setInterval(() => {
                $postgres.queryRealTimeEquipment({
                    ip,
                    callback: (err, count, rows) => {
                        $scope.timers +=1;
                        let equipment = new Object();
                        equipment.ip = ip;
                        equipment.timers = $scope.timers;
                        equipment.count = count;
                        equipment.rows = rows;
                        $scope.equipment = equipment;
                        $scope.$apply();
                    }
                });
            },500);
        }
    });

    // init factory EquipmentList
    $scope.equipmentList = [{
        ip: "192.168.1.4",
        name: "智能设备- 1"
    }, {
        ip: "192.168.1.5",
        name: "智能设备- 2"
    }, {
        ip: "192.168.1.6",
        name: "智能设备- 3"
    }, {
        ip: "192.168.1.7",
        name: "智能设备- 4"
    }];

}]);

SmartPlant.service('$postgres', function () {
    const Pool = require("pg").Pool;

    let pool = new Pool({
        user: "postgres",
        database: "Tesm",
        password: "123456",
        port: 5432,
        max: 15,
        host: "47.89.29.77"
    });

    const [selectRealTime,selectHistroy] = ["SELECT id,ip,equimentname,runporgname,xjc,yjc,zjc,xxd,yxd,zxd,xjd,yjd,zjd,daystoptime,nightruntime,f,s,dayruntime  FROM realtime", "SELECT id,ip,equimentname,runporgname,xjc,yjc,zjc,xxd,yxd,zxd,xjd,yjd,zjd,daystoptime,nightruntime,f,s,dayruntime FROM historic "];

    return {
        queryRealTimeEquipment: queryObject => {
            let {ip,callback} = queryObject;
            pool.query(`${selectRealTime} WHERE ip = $1::text`, [ip], (_err, _result) => {
                if (callback) callback.apply(_result, [_err, _result["rowCount"], _result["rows"]]);
            });
        },
        queryHistroyEquipment: queryObject => {
            let {ip,callback} = queryObject;
            pool.query(`${selectRealTime} WHERE ip = $1::text`, [ip], (_err, _result) => {
                if (callback) callback.apply(_result, [_err, _result["rowCount"], _result["rows"]]);
            });
        },
    };
});