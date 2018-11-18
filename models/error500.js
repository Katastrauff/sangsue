
module.modules = module.parent.modules;
const model = require('./model.js');

module.exports = class error500 extends model {
    constructor(request) {
        super(request);

        this.error = 'An error occured... Sorry !';
    }
}
