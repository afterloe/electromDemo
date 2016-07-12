/**
 * Created by afterloe on 7/12/2016.
 */
const WTObject = require(`${__dirname}/wtObject`);

class WTCondition extends WTObject{
    constructor(primary,selected,rule,foreign,range){
        super();
        this.primary = primary;
        this.foreign = foreign;
        this.rule = rule;
        this.selected = selected;
        this.range = this.buildRange(range);
    }
}

module.exports = WTCondition;