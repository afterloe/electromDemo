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
SmartPlant.controller("SmartPlantCtrl", ['$scope', '$interval', '$postgres', ($scope, $interval, $postgres) => {
    require(`${__dirname}/../controller/contro_common`)($scope);
    $scope.timers = 0;
    $scope.img = `${__dirname}/../sources/f382d63f8794a4c29f911ae80ff41bd5ac6e3949.gif`;

    let changeList = () => {
        if($scope.task) clearInterval($scope.task);
        $scope.task = setInterval(() => {
            $postgres.queryRealTimeEquipment({
                ip : $scope.ip,
                callback: (err, count, rows) => {
                    $scope.timers += 1;
                    if(count > 0)
                        $scope.equipment = rows[0];
                    $scope.$apply();
                }
            });
        },500);
    };

    $scope.queryHistory = () => {
        clearInterval($scope.task);
        $scope.equipment = null;
        $postgres.queryHistroyEquipment({
            ip : $scope.ip,
            callback: (err, count, rows) => {
                if(count > 0)
                    $scope.history = rows;
                $scope.$apply();
            }
        });
    };

    $scope.queryRealTime = () => {
        $scope.history = null;
        changeList();
    };

    dropEventTrigger.register((...args) => {
        let [ip] = args;
        $scope.ip = ip;
        changeList();
    });

    // init factory EquipmentList
    $scope.equipmentList = [{
        ip: "192.168.1.2",
        name: "智能设备- 1"
    }, {
        ip: "192.168.1.3",
        name: "智能设备- 2"
    }, {
        ip: "192.168.1.4",
        name: "智能设备- 3"
    }, {
        ip: "192.168.1.5",
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
            if(!ip) return;
            pool.query(`${selectRealTime} WHERE ip = $1::text`, [ip], (_err, _result) => {
                if (callback) callback.apply(_result, [_err, _result["rowCount"], _result["rows"]]);
            });
        },
    };
});