const util = require('../../util/util')
const mailService = require('../../util/mailer')
const pool = require('../../util/database').pool;

module.exports = {
    verifyEmailOrMobile: (req, res, next) => {
            const emailOrMobile = req.body.params.email;
            //generate OTP, Ref_Code(not used now), and email first
            const {otp, ref_code, otp_email_body} = util.generateCodeAndEmail();

            if(emailOrMobile.includes('@')) {
                //User registers with email
                let otpEmailSql = `INSERT INTO AUTH_OTP (ref_code, code, type, email) VALUES ('${ref_code}', '${otp}', 1, '${emailOrMobile}');`;
                pool.query(otpEmailSql, (err, result) => {
                    if(err) {
                        console.error(util.getCurrentDateTime(), '| Error occured inserting email OTP to database, ref_code: ', ref_code)
                        throw err; 
                    } else {console.log(util.getCurrentDateTime(), '| OPT generated and saved.')}
                })
                let email = {
                    from: '"OneMall Service " <one-mall@outlook.com>',
                    to: emailOrMobile, //could be a list of email addresses
                    subject: 'Confirm your email address',
                    html: otp_email_body
                };
                mailService.sendEmail(email, ref_code); //Console will log the ref_code so we can check
                //req.auth = { otp, ref_code, type: 'email' }; //add OPT info to request body, so controller can process it.
                res.status(200).json({ status: 1, msg: 'Email OTP sent.'})
            } else {
                //User registers with mobile
                let otpMobileSql = `INSERT INTO AUTH_OTP (ref_code, code, type, mobile) VALUES ('${ref_code}', '${otp}', 1, '${emailOrMobile}');`;
                pool.query(otpMobileSql,  (err, result) => {
                    if(err) {
                        console.error(util.getCurrentDateTime(), '| Error occured inserting mobile  OTP to database, ref_code: ', ref_code, result)
                        throw err; 
                    } else {console.log(util.getCurrentDateTime(), '| OPT generated and saved.')}
                })
                res.status(200).json({ status: 1, msg: 'SMS OTP sent.' });
            }
        },
    }