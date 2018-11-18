/*
 * Router.js
 * 
 * Route the entering request.
 * 
 */

module.modules = module.parent.modules;
var mods = module.modules;


function sendResponse(request, response, viewName, controllerName, model) {
    var controllerClass, controller;
    controllerName = controllerName || viewName;
    model = model || controllerName;
    try {
        controllerClass = require('../controllers/' + controllerName + '.js');
        controller = new controllerClass();
        controller.render(request, response, viewName, model);
    } catch (err) {
        console.error(err.stack);
        sendResponse(request, response, 'error', 'error500');
    }
}

function callback(request, response) {
    var viewName, viewPath, controllerName;
    viewName = request.path === '/' ? 'home' : request.path;
    viewName = viewName.startsWith('/') ? viewName.substring(1) : viewName;
    viewPath = mods.path.join(__dirname, '../views/' + viewName + '.hbs');
    mods.fs.exists(viewPath, function (exists) {
        if (!exists) {
            viewName = "error";
            controllerName = "error404";
        }
        sendResponse(request, response, viewName, controllerName);
    });
};

function download(request, response) {
    var filename = mods.path.basename(request.path);
    var filepath = request.url;
    if (!filepath.startsWith('.'))
        filepath = '.' + filepath;
    response.download(filepath, filename); // Set disposition and send it.
}

// all download requests
mods.app.get('download*', download);
mods.app.get('/download*', download);
mods.app.get('/download/*', download);
mods.app.get('/downloads*', download);
mods.app.get('/downloads/*', download);

// all GET methods
mods.app.get('', callback);
mods.app.get('*', callback);

// all methods post
mods.app.post('', callback);
mods.app.post('*', callback);
    
// Error 500, error occured on server (with throw new Error('Ooops !'))
mods.app.use(function (err, request, response, next) {
    console.error(err.stack);
    sendResponse(request, response, 'error', 'error500');
});
// If all other routes don't match, then error 404 not found is launched
mods.app.use(function (request, response, next) {
    sendResponse(request, response, 'error', 'error404');
});