/**
 * Created by afterloe on 7/12/2016.
 */
const WTObject = require(`${__dirname}/wtObject`);

class WTOptionSet extends WTObject {
    constructor(label,model,option){
        super();
        this.label = label;
        this.model = model;
        this.options = this.buildRange(option);
    }

    equals(other){
        if(!other.label) return false;
        if(!other.options) return false;
        if(this.options !== other.options) return false;
        return true;
    }
}

module.exports = WTOptionSet;