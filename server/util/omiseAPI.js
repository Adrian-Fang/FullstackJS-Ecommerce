// This Util is just draft, and NOT in any use, @2020-08-16

var $conf = require('../conf');

var omise = require('omise')({
    secretKey: $conf.omiseSecretKey,
    omiseVersion: "2019-05-29"
});

/*
For very detailed Charge APIs, please read the documents on
 https://www.omise.co/charges-api
*/

function chargeCard(orderId, amount, currency, token) {
    return new Promise((resolve, reject) => {
        omise.charges.create({
            description: `Paying for order ${orderId}`,
            amount: amount * 100,
            currency: currency,
            capture: $conf.captureCharge,
            card: token
        }, (err, res) => {
            if (res.paid) {
                console.log('payment successfully');
                return res.paid;
            } else {
                throw res.failure_code;
            }
        }).then(
            res => resolve(res),
            error => reject(new Error('Error'))
        )
    });
}


module.exports = { chargeCard };