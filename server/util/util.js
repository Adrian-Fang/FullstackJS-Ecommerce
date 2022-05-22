var $conf = require('../conf');

Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

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

function generateCodeAndEmail() {
  const digits = '0123456789';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let otp = '', ref_code = '';
  for(let i=0; i<4; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
    ref_code += chars[Math.floor(Math.random()*26)];
  };
  let otp_email_body = `<html>
                        <body>
                            <div style="width: 600px; margin: 20px auto; padding: 10px 20px; color: #555; font-size: 1rem; border: 0.0625rem solid #d9d7d6; border-radius: 0.25rem; ">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <a href="https://one-mall.netlify.com"><img src="https://one-mall.netlify.app/static/one-mall-logo.png"
                                            alt="One-Mall" style="width: 120px;"></a>
                                    <p style="font-size: 0.8rem;">Help us verify your email address</p>
                                </div>
                                <hr>
                                <p>Thanks for creating new One-Mall account, we just want to make sure it's really you. Please input the code
                                    below when prompted. This code's ref is: </p>
                                <div style="text-align: center; margin: 3rem auto;">
                                    <h1>${otp}</h1>
                                    <p>(This code is valid for 10 mins)</p>
                                </div>
                                <p>Please don't share this code to whom you do not recognize. If this email is not intended for you, please
                                    ignore it. Thank you!</p>
                                <hr>
                                <div style="text-align: center; font-size: 0.8rem;">
                                    This message was procuded and distributed by One-Mall open source ecommerce software. Feel free to reply back or
                                    contribute, via <a href="https://github.com/Adrian-Fang/FullstackJS-Ecommerce">Github</a>
                                </div>
                            </div>
                        </body>
                    </html>`;
  return {otp, ref_code, otp_email_body};
};


module.exports = { 
  generateOrderId,
  getCurrentDateTime,
  generateCodeAndEmail
};
