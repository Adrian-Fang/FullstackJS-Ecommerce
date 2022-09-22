const nodemailer = require('nodemailer')
const $conf = require('../conf')
const util = require('../utils/util')

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 588,
    tls: {
        ciphers: 'SSLv3'
    },
    auth: $conf.emailAccountAuth
})

const generateCodeAndEmail = () => {
  const digits = '0123456789';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let otp = '', ref_code = '';
  try {
    for(let i=0; i<4; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
        ref_code += chars[Math.floor(Math.random()*26)];
    };
    let otp_email_body = `<html>
                          <body style="background-color: #F5F6F7;">
                              <div
                                  style="background-color: white; width: 80vw; margin: 20px auto; padding: 10px 20px; color: #666; font-size: 1rem; border: 0.0625rem solid #d9d7d6; border-radius: 0.25rem; ">
                                  <div style="display: flex; justify-content: space-between; align-items: center;">
                                      <a href="https://one-mall.netlify.com"><img src="https://one-mall.netlify.app/static/one-mall-logo.png"
                                              alt="One-Mall" style="width: 120px;"></a>
                                      <p style="font-size: 0.8rem;">Help us verify your email address</p>
                                  </div>
                                  <hr>
                                  <p>Thanks for creating new One-Mall account, we just want to make sure it's really you. Please input the code
                                      below when prompted. This code's ref is: </p>
                                  <div style="text-align: center; margin: 3rem auto;">
                                      <h1 style="color: lightblue;">${otp}</h1>
                                      <p>(This code is valid for 10 mins)</p>
                                  </div>
                                  <p>Please don't share this code to whom you do not recognize. If this email is not intended for you, please
                                      ignore it. Thank you!</p>
                                  <hr>
                                  <div style="text-align: center; font-size: 0.8rem;">
                                      This message was procuded and distributed by One-Mall open source ecommerce software. Feel free to reply
                                      back or
                                      contribute, via <a href="https://github.com/Adrian-Fang/FullstackJS-Ecommerce" style="text-decoration: none;">Github</a>
                                  </div>
                              </div>
                          </body>
                         </html>`;
    return { otp, ref_code, otp_email_body };
  } catch (error) {
    throw(error);
  }
};

const sendEmail = (email, ref_code) => {
    try {
        transporter.sendMail(email, (err, info) => {
        if(err) { 
            // throw(err);//throw error will crash app
            console.log(err);
        } else { 
            console.log(util.getCurrentDateTime(), '| Email sent by mailerService ref: ', ref_code);
        }
    });
    } catch (error) {
        throw(error);
    }
};

module.exports = {
    generateCodeAndEmail,
    sendEmail,
}