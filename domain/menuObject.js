/**
 *  create by afterloe on 10-6-2016
 *
 * @mail afterloeliu@jwis.cn
 * @tel 13539759930
 */

class MenuObject {
  constructor(itemName,itemClick) {
    this.itemName = itemName;
    this.itemClick = itemClick;
  }

  formatOut () {
    let _self = this;
    return {label : _self.itemName,click : _self.itemClick};
  }
}

module.exports = MenuObject;
