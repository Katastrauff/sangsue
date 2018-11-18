
module.modules = module.parent.modules;
var mods = module.modules;
const controller = require('./controller.js');


module.exports = class home extends controller {
    constructor() {
        super();
    }

    render(request, response, view, modelName) {
        var model = super.getModel(request, modelName);
        var filename = request.url;
        if (filename.indexOf('?') >= 0) {
            filename = filename.substring(0, filename.indexOf('?'));
        }
        if (filename.indexOf('#') >= 0) {
            filename = filename.substring(0, filename.indexOf('?'));
        }
        var ext = mods.path.extname(filename);

        response.url = request.originalUrl;
        response.status(404);
        if (ext === '.css' && ext === '.js') {
            response.send('');
        } else {
            response.render(view, model);
        }
    }
};