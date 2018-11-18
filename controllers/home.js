
try {
    module.modules = module.parent.modules;

    var controller = require('./controller.js');
    var leecherClass = require('../business/leecher.js');

    module.exports = class home extends controller {
        constructor() {
            super(['getit', 'customize']);
        }

        getJsonData(request, response, model, methodName, postData) {
            var leecher = new leecherClass();
            leecher.init(request, postData);
            var data = leecher.leech();
            if (methodName === 'getit') {
                leecher.buildText();
            }
            return data;
        }

        render(request, response, view, model) {
            super.render(request, response, view, model);
        }
    };

} catch (err) {
    console.log(err);
}