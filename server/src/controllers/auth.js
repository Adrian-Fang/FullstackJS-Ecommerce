const authService = require('../services/auth');

module.exports = {
    verifyEmailOrMobile: (req, res, next) => {
        const emailOrMobile = req.body.params.email;
        try {
            if(emailOrMobile.includes('@')) {
                //User registers with email
                authService.verifyUserEmail(emailOrMobile);
                res.status(200).send({ status: 1, msg: 'Email OTP sent.'});
            } else {
                //User registers with mobile
                authService.verifyUserMobile(emailOrMobile);
                res.status(200).send({ status: 1, msg: 'SMS OTP sent.' });
            }
        } catch (error) {
            res.status(error?.status || 500).send( {status: 0, msg: error?.message || error })
        }
    },
    }