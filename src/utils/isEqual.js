var _ = require('lodash');

module.exports = function isArrayEqual(x, y) {
    return _(x).xorWith(y, _.isEqual).isEmpty();
};