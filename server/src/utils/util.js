var $conf = require('../conf');

Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
};

function generateOrderId() {
  var r1 = Math.floor(Math.random() * 10);
  var r2 = Math.floor(Math.random() * 10);
  var sysDate = new Date().Format('yyyyMMddhhmmss');
  var orderId = $conf.platformId + r1 + sysDate + r2;
  return orderId;
}

function getCurrentDateTime() {
  return new Date().toLocaleString();
}

function inWhiteList(path, list) {
  let productDetailApiRegex = /\/api\/v1\/products\/[0-9]+/; //probably redundant, could be replaced if using passport.js os something
  let docsRegex = /\/api\/v1\/docs\/.+/; 
  return list.some((item) => item.includes(path) || productDetailApiRegex.test(path) || docsRegex.test(path) );
}

module.exports = { 
  generateOrderId,
  getCurrentDateTime,
  inWhiteList,
};
