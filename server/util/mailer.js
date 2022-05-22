const nodemailer = require('nodemailer')
const $conf = require('../conf')
const util = require('../util/util')

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    tls: {
        ciphers: 'SSLv3'
    },
    auth: $conf.emailAccountAuth
})

module.exports = {
    sendEmail: (email, ref_code) => {
        transporter.sendMail(email, (err, info) => {
            if(err) return console.log(err)

            console.log(util.getCurrentDateTime(), '| Email sent, ref: ', ref_code);
        });
    }
}