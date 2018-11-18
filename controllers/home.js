
const controller = require('./controller.js');
const leecher = require('../business/leecher.js');

module.exports = class home extends controller {
    constructor() {
        super();
    }

    route(request, response, view, model, methodName, postData) {
        if (methodName === 'getit') {

            return leecher(postData["url"]);
        }
    }

    render(request, response, view, model) {
        super.render(request, response, view, model, this.route);
    }
};