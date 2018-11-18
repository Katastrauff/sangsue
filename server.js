'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const port = process.env.PORT || 8080;
var bodyParser = require('body-parser');



var app = module.exports = express();
module.app = app;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', '.hbs');

/* Path for css and js and errors */
app.use(express.static(path.join(__dirname, 'views')));

app.use((request, response, next) => {
    console.log(request.headers);
    next();
});


require('./core/router');




app.listen(port);