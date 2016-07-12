/**
 * Created by afterloe on 7/12/2016.
 */
const WTObject = require(`${__dirname}/wtObject`);

class WTPart extends WTObject{
    constructor(model,type,partNum,level){
        super();
        this.model = model;
        this.type = type;
        this.partNum = partNum;
        this.level = level;
    }

    equals(other){
        if(!other.partNum) return false;
        if(this.partNum !== other.partNum) return false;
        return true;
    }
}

module.exports = WTPart;