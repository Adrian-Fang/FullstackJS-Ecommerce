const mailService = require('../../util/mailer')

module.exports = {
    sendTestEmail: (req, res, next) => {
        let email = {
            from: '"OneMall Service " <one-mall@outlook.com>',
            to: 'adrian.ffang@gmail.com', //could be a list of email addresses
            subject: 'Confirm your email address',
            text: 'Plain text body',
            html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js'
        };
        mailService.sendEmail(email);
        next();
    },
}