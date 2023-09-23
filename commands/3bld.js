const bo3Format = require('./format/bo3');
const bo3 = bo3Format("3bld");

module.exports = {
    data: bo3.data,
    execute: bo3.execute,
};