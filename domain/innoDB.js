/**
 * Created by afterloe on 2016/7/13.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const [WTPart,WTOptionSet,WTCondition] = [require(`${__dirname}/wtPart`), require(`${__dirname}/wtOptionSet`), require(`${__dirname}/wtCondition`)];

class InnoDB {

    static partBuilder(table) {
        let _softProperty, _part, _arr = new Array();
        table.forEach((_item, _index) => {
            if (0 === _index) {
                _softProperty = _item;
                return;
            }
            _part = new WTPart(_item[0], _item[1], _item[2], _item[3]);
            _item.forEach((__data, __index) => {
                if (__index < 3) return;
                _part[_softProperty[__index]] = __data;
            });
            _arr.push(_part);
        });
        return _arr;
    }

    static optionsBuilder(table) {
        let _arr = new Array();
        table.forEach((_item, _index) => {
            if (0 === _index) return;
            _arr.push(new WTOptionSet(_item[0], _item[1], _item[2]));
        });
        return _arr;
    }

    static conditionBuilder(table) {
        let _arr = new Array();
        table.forEach((_item, _index) => {
            if (0 === _index) return;
            _arr.push(new WTCondition(_item[0], _item[1], _item[2], _item[3], _item[4], _item[5]));
        });
        return _arr;
    }
}

module.exports = InnoDB;