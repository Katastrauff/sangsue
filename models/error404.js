
module.modules = module.parent.modules;
const model = require('./model.js');

module.exports = class error404 extends model {
    constructor(request) {
        super();
        this.error = 'Are you lost ?';
    }
}
