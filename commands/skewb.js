const ao5Format = require('./format/ao5');
const ao5 = ao5Format("skewb");

module.exports = {
    data: ao5.data,
    execute: ao5.execute,
};