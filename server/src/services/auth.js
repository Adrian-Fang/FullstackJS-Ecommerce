const util = require('../utils/util');
const mailService = require('./mailer');
const pool = require('../database/connection').pool;
//TODO: Move database operations to database layer files.

const verifyUserEmail= ( credential ) => {
    //generate OTP, Ref_Code(not used now), and email first
    const { otp, ref_code, otp_email_body } = mailService.generateCodeAndEmail();
    try {
        let otpEmailSql = `INSERT INTO AUTH_OTP (ref_code, code, type, email) VALUES ('${ref_code}', '${otp}', 1, '${credential}');`;
        pool.query(otpEmailSql, (err, result) => {
            if(err) {
                console.error(util.getCurrentDateTime(), '| Error occured inserting email OTP to database, ref_code: ', ref_code)
                throw err; 
            } else {
                console.log(util.getCurrentDateTime(), '| OPT generated and saved.')}
        });
    
        //send email
        let email = {
            from: '"OneMall Service " <one-mall@outlook.com>',
            to: credential, //could be a list of email addresses
            subject: 'Confirm your email address',
            html: otp_email_body
        };
        mailService.sendEmail(email, ref_code); //Console will log the ref_code so we can check
    } catch (error) {
        throw(error);
    }
};

const verifyUserMobile= ( credential ) => {
    //User registers with mobile
    const { otp, ref_code } = util.generateCodeAndEmail();
    try {
        let otpMobileSql = `INSERT INTO AUTH_OTP (ref_code, code, type, mobile) VALUES ('${ref_code}', '${otp}', 1, '${credential}');`;
        pool.query(otpMobileSql,  (err, result) => {
            if(err) {
                console.error(util.getCurrentDateTime(), '| Error occured inserting mobile  OTP to database, ref_code: ', ref_code, result)
                throw err; 
            } else {
                //TODO: Send SMS with Free SMS service providers
                console.log(util.getCurrentDateTime(), '| OPT generated and saved.');
            }
        });
    } catch (error) {
        throw(error);
    }
};

module.exports = {
    verifyUserEmail,
    verifyUserMobile
}