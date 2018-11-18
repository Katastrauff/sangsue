
module.modules = module.parent.modules;
const model = require('./model.js');

module.exports = class home extends model {
    constructor(request) {
        super(request);
        this.action = '?_method=getit';
    }
}
