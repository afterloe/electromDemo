/**
 * Created by afterloe on 7/12/2016.
 */
const regex = /([^\[\]]+)(?=\])/g;

class WTObject {

    buildRange(value){
        let _arr = value.match(regex);
        return _arr ? _arr[0].split(",") : null;
    }

    toString(){
        return JSON.stringify(this);
    }

    equals(other){
        return this == other;
    }
}

module.exports = WTObject;