
try {
    module.modules = module.parent.modules;
    var mods = module.modules;


    module.exports = class controller {
        constructor(authorizedJsonMethods) {
            this.authorizedJsonMethods = authorizedJsonMethods;
        }

        getModel(request, modelName) {
            var modelClass = require('../models/' + modelName + '.js');
            return new modelClass(request);
        }

        getMethodName(request) {
            var methodName, querystring, pos;
            pos = request.url.indexOf('?');
            if (pos > 0) {
                querystring = mods.querystring.parse(request.url.substring(pos + 1, request.url.length - pos + 1));
                methodName = querystring._method;
            }
            return methodName;
        }

        getJsonData(request, response, model, methodName, postData) {
        }

        render(request, response, view, modelName) {
            var model, methodName, jsonData, jsonString;
            model = this.getModel(request, modelName);
            if (this.authorizedJsonMethods) {
                methodName = this.getMethodName(request);
                if (methodName) {
                    if (this.authorizedJsonMethods.includes(methodName)) {
                        jsonData = this.getJsonData(request, response, model, methodName, request.body);
                        jsonString = JSON.stringify(jsonData);
                        if (jsonData.result === 'error' || jsonData.error === true) {
                            response.status(500);
                        }
                    } else {
                        response.url = request.originalUrl;
                        response.status(404);
                        jsonString = '';
                    }
                    response.setHeader('Content-Type', 'application/json');
                    response.send(jsonString);
                    return;
                }
            }
            response.render(view, model);
        }
    };

} catch (err) {
    console.log(err);
}