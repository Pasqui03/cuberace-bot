const ao5Format = require('./format/ao5');
const ao5 = ao5Format("222");

module.exports = {
    data: ao5.data,
    execute: ao5.execute,
};