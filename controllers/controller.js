
const qs = require('querystring');
const objects = require('../core/objects.js');

module.exports = class controller {
    constructor() {
    }

    getModel(request, modelName) {
        var modelClass = require('../models/' + modelName + '.js');
        return new modelClass(request);
    }

    render(request, response, view, modelName, fnMethodRoute) {
        var model = this.getModel(request, modelName);

        if (fnMethodRoute) {
            var pos = request.url.indexOf('?');
            if (pos > 0) {
                var querystring = request.url.substring(pos + 1, request.url.length - pos + 1);
                var qstr = qs.parse(querystring);
                if (qstr._method) {
                    var post = request.body;

                    var responseData = fnMethodRoute(request, response, view, modelName, qstr._method, post);
                    var json = JSON.stringify(responseData);
                    response.setHeader('Content-Type', 'application/json');
                    response.send(json);
                    return;
                }
            }
        }

        response.render(view, model);
    }
};