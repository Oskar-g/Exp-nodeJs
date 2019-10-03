var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', (req, res) => {
    res.status(200)
        .type('text/xml')
        .end('<html><body><h1>ASDLKASLDKJSAD</h1></body></html>');
});

router.get('/form', (req, res) => {
    const rslt = {
        "title": 'titulo po vale',
        "nombre": 'paco',
        "apellidos": 'Matute'
    }

    res.render('persona-form', rslt);
});
/*
router.post('/form', (req, res) => {
    const { id, nombre, apellido } = req.body;
    const rslt = {
        "id": id,
        "nombre": nombre,
        "apellido": apellido
    }
    res.status(200)
        .json(rslt);
});
*/
router.get('/json', (req, res) => {
    const { id, nombre, apellido } = req.body;
    const rslt = {
        "id": id,
        "nombre": nombre,
        "apellido": apellido
    }
    res.status(200)
        .json(rslt);
});

router.get('/saluda/:name', (req, res) => {
    const { name } = req.params
    res.status(200)
        .type('text/plain')
        .end(`Povale ${name}`);
});

router.get('/cotilla/:id', (req, res, next) => {
    const { id } = req.params;
    const { page, size } = req.query;
    const idioma = req.header("Accept-Language");
    console.log(idioma);

    /*
    if (!page) {
        res.status(500);
        next(new Error("falta parametro \"page\""));
    }
    */

    rslt = `ID: ${id}`;
    rslt += !!idioma ? ` idioma: ${idioma}` : '';
    rslt += !!page ? ` page: ${page}` : '';
    rslt += !!size ? ` size: ${size}` : '';

    res.status(200)
        .type('text/plain')
        .end(`Povale - ${rslt}`);
});

router.get('/google', (req, res) => {
    if (!res.headersSent)
        res.redirect(301, 'https://google.es');

    res.status(500).end();
});

router.get('/despide', (req, res) => {
    res.status(200)
        .type('text/plain')
        .end('Talue');
});

module.exports = router;