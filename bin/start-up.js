/**
 * Created by afterloe on 6/29/2016.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const electron = require("electron");

// 加载主应用模块
require(`${__dirname}/application`)(electron);

// 抓取未处理的异常
process.on('uncaughtException',err => {
    console.log(err);
});