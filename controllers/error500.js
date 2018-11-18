
module.modules = module.parent.modules;
const controller = require('./controller.js');

module.exports = class error500 extends controller {
    constructor() {
        super();
    }

    render(request, response, view, model) {
        response.url = request.originalUrl;
        response.status(500);
        super.render(request, response, view, model);
    }
};