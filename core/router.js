/*
 * Router.js
 * 
 * Route the entering request.
 * 
 */

try {
    var fs = require('fs');
    var path = require('path');
    var app = module.parent.app; // Gets the app defined in server.js



    function sendResponse(request, response, view, controller, model) {
        controller = controller || view;
        model = model || controller;
        try {
            var controllerClass = require('../controllers/' + controller + '.js');
            var controller = new controllerClass();
            controller.render(request, response, view, model);
        } catch (err) {
            console.error(err.stack);
            sendResponse(request, response, 'error', 'error500');
        }
    }

    
    app.get('', function (request, response) {
        var view = request.path;
        if (request.path === '/') {
            view = 'home';
        }
        view = view.startsWith('/') ? view.substring(1) : view;

        var viewPath = path.join(__dirname, '../views/' + view + '.hbs');
        fs.exists(viewPath, function (exists) {
            var controller;
            if (!exists) {
                view = "error";
                controller = "error404";
            }
            sendResponse(request, response, view, controller);
        });
    });

    /* POST requests => erreur pour l'instant */
    app.post('', function (request, response) {
        var view = request.path;
        if (request.path === '/') {
            view = 'home';
        }
        view = view.startsWith('/') ? view.substring(1) : view;

        var viewPath = path.join(__dirname, '../views/' + view + '.hbs');
        fs.exists(viewPath, function (exists) {
            var controller;
            if (!exists) {
                view = "error";
                controller = "error404";
            }
            sendResponse(request, response, view, controller);
        });
    });


    //app.get('/500', function (req, res) {
    //    throw new Error('oops');
    //});
    
    
    // Error 500, error occured on server (with throw new Error('Ooops !'))
    app.use(function (err, request, response, next) {
        console.error(err.stack);
        sendResponse(request, response, 'error', 'error500');
    });

    app.use(function (request, response, next) {
        sendResponse(request, response, 'error', 'error404');
    });
}
catch (err) {
    console.error(err);
}