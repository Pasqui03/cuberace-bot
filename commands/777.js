const mo3Format = require('./format/mo3');
const mo3 = mo3Format("777");

module.exports = {
    data: mo3.data,
    execute: mo3.execute,
};