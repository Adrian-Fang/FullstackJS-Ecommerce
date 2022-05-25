const conf = require('../utils/conf')

export function formatMoney (value) {
    return new Intl.NumberFormat(conf.locale, {
        style: 'currency',
        currency: conf.currency
    }).format(value)
}