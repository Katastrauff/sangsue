'use strict';

try {
    const port = process.env.PORT || 8080;
    const express = require('express');
    const exphbs = require('express-handlebars');
    const path = require('path');
    const bodyParser = require('body-parser');
    const app = express();
    const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    const fs = require('fs');
    const xpath = require('xpath');
    const dom = require('xmldom').DOMParser
    const querystring = require('querystring');
    const htmlencoder = new require('node-html-encoder').Encoder();

    module.modules = {
        path: path,
        app: app,
        bodyParser: bodyParser,
        XMLHttpRequest: XMLHttpRequest,
        fs: fs,
        xpath: xpath,
        dom: dom,
        querystring: querystring,
        htmlencoder: htmlencoder
    }

    app.use(bodyParser.urlencoded({ extended: false }));
    // Authorize JSON
    app.use(bodyParser.json());

    // Use engine ehbs to provide html templates and render them with models
    app.engine('.hbs', exphbs({
        defaultLayout: 'main',
        extname: '.hbs',
        layoutsDir: path.join(__dirname, 'views/layouts')
    }));
    app.set('view engine', '.hbs');

    // Path for css and js and errors
    app.use(express.static(path.join(__dirname, 'views')));

    // Log all entering requests
    app.use((request, response, next) => {
        console.log(request.headers);
        next();
    });

    // Route entering requests
    require('./core/router');

    // Listen to port and get all requests to this port
    app.listen(port);
} catch (err) {
    console.error(err);
}