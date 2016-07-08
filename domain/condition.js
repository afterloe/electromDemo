/**
 * Created by afterloe on 7/8/2016.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const [builtRange,buildTagRange,regex] = [Symbol("builtRange"),Symbol("buildTagRange"),/([^\[\]]+)(?=\])/g];

class Condition {
    constructor(data) {
        this.execute = data[0];
        this[builtRange](data[1].match(regex));
        this.rule = data[2];
        this.target = data[3];
        this[buildTagRange](data[4].match(regex));
    }

    [builtRange](arr){
        if(!arr) return;
        arr = arr[0].split("~");
        let flag = 2 === arr.length;
        if(flag){
            this.min = arr[0];
            this.max = arr[1];
        }else{
            this.min = arr[0];
            this.max = arr[0];
        }
    }

    [buildTagRange](arr){
        if(!arr) return;
        arr = arr[0].split(",");
        this.rang = arr;
    }

    formatOut () {
        let _self = this;
        return {label : _self.itemName,click : _self.itemClick};
    }
}

module.exports = Condition;