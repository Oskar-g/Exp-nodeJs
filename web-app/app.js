var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var demosRouter = require('./routes/demos');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/demos', demosRouter);

app.get('/demo', (req, res) => {
    res.status(200)
        .type('text/xml')
        .end('<html><body><h1>ASDLKASLDKJSAD</h1></body></html>');
});

app.get('/saluda/:name', (req, res) => {
    const { name } = req.params
    res.status(200)
        .type('text/plain')
        .end(`Povale ${name}`);
});

app.get('/cotilla/:id', (req, res, next) => {
    const { id } = req.params;
    const { page, size } = req.query;
    const idioma = req.header("Accept-Language");
    console.log(idioma);

    if (!page) {
        res.status(500);
        next(new Error("falta parametro \"page\""));
    }

    rslt = `ID: ${id}`;
    rslt += !!idioma ? ` idioma: ${idioma}` : '';
    rslt += !!page ? ` page: ${page}` : '';
    rslt += !!size ? ` size: ${size}` : '';

    res.status(200)
        .type('text/plain')
        .end(`Povale - ${rslt}`);
});

app.get('/google', (req, res) => {
    if (!res.headersSent)
        res.redirect(301, 'https://google.es');

    res.status(500).end();
});

app.get('/despide', (req, res) => {
    res.status(200)
        .type('text/plain')
        .end('Talue');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log("Entra aqui")
        // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;