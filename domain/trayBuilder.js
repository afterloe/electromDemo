/**
 *  create by afterloe on 12-6-2016
 *
 * @author afterloe
 * @mail afterloeliu@jwis.cn
 * @tel 13539759930
 */
 const TITLE = "Engineer Mate";

 /**
 *  构建托盘单击菜单
 */
 let readyMenu = app => {
   let [menu,menuObject] = [new Array(),require(`${__dirname}/menuObject`)];
   menu.push(new menuObject("显示主页面", (menuItem, browserWindow) => {
     console.log("显示主页面");
   }).formatOut());
   menu.push(new menuObject("锁定界面", (menuItem, browserWindow) => {
     console.log("锁定界面");
   }).formatOut());
   menu.push(new menuObject("设置", (menuItem, browserWindow) => {
     console.log("设置");
   }).formatOut());
   menu.push(new menuObject("退出", (menuItem, browserWindow) => {
     app.quit();
   }).formatOut());
   return menu;
 };

let click = () => {
  global.engineerWhite.mainFrameWindow.show();
};

module.exports = (electron,appIcon) => {
  let [Menu,app] = [electron.Menu,electron.app];
  global.appIcon.setToolTip(TITLE); // 设置托盘 鼠标悬浮名
  global.appIcon.setContextMenu(Menu.buildFromTemplate(readyMenu(app)));
  global.appIcon.on("click", click);
};
