var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */

router.get('/', (req, res) => {
    let lista = fs.readFileSync('./data/personas.json', (err, data) => {
        if (err) throw err;
        return data;
    })
    const model = {
        'title': 'Listado de personas',
        'personas': JSON.parse(lista)
    }

    res.render('personas/view', model);
});

router.get('/add', (req, res) => {

    fs.readFile('./data/personas.json', (err, data) => {
        if (err) throw err;
        const lista = JSON.parse(data);
        const lastIndex = lista.length - 1;
        const lastId = lista[lastIndex].id + 1

        const model = {
            "title": 'Añadir nueva personas',
            "errors": [],
            "persona": { "id": lastId }

        }

        res.render('personas/add', model);
    });
});

router.post('/add', (req, res) => {
    const { id, nombre, apellidos, edad } = req.body;
    let errors = [];
    const persona = {
        "id": id,
        "nombre": nombre,
        "edad": edad,
        "apellidos": apellidos
    }

    if (!nombre) errors.push("El nombre es obligatorio");
    if (!apellidos) errors.push("Los apellidos son obligatorios");
    if (!edad) errors.push("la edad es obligatoria");

    if (errors.length) {

        const model = {
            "title": 'ERROR nueva personas',
            "errors": errors,
            "persona": persona
        }
        console.log("Erroreeees", model)
        res.render('personas/add', model);
        return;
    }

    fs.readFile('./data/personas.json', (err, data) => {
        if (err) throw err;
        const listado = JSON.parse(data);
        listado.push(persona);

        fs.writeFile('./data/personas.json', JSON.stringify(listado), 'utf8', (err) => {
            if (err) throw err;

            res.redirect('/');
        });

    });
});

router.get('/:id/edit', async(req, res) => {
    const { id } = req.params;

    const data = await fs.promises.readFile('./data/personas.json', 'utf8');
    const listado = JSON.parse(data);

    const index = listado.findIndex(item => item.id == id);
    if (index) {
        res.status(404).end();
        return;
    }

    const persona = listado[index];
    const model = {
        "title": 'Añadir nueva personas',
        "errors": [],
        "persona": persona

    }
    res.render('personas/edit', model);
});

router.post('/:id/edit', async(req, res) => {
    const { id } = req.params;
    console.log('AQui mas')
    const { nombre, apellidos, edad } = req.body;

    let errors = [];
    if (!nombre) errors.push("El nombre es obligatorio");
    if (!apellidos) errors.push("Los apellidos son obligatorios");
    if (!edad) errors.push("la edad es obligatoria");

    if (errors.length) {
        const model = {
            "title": 'ERROR nueva personas',
            "errors": errors,
            "persona": persona
        }
        res.render('personas/edit', model);
        return;
    }

    const data = fs.promises.readFile('./data/personas.json', 'utf8');
    const listado = JSON.stringify(data);
    const index = listado.findIndex(item => item.id == id);
    if (index) {
        res.status(404).end();
        return;
    }

    listado[index] = {
        'id': id,
        'nombre': nombre,
        'apellidos': apellidos,
        'edad': edad
    }

    await fs.promises.writeFile('./data/personas.json', JSON.stringify(listado), 'utf8');

    const model = {
        "title": `datos de ${persona.nombre}`,
        'persona': persona
    }

    res.render('personas/profile', model);
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile('./data/personas.json', (err, data) => {
        if (err) throw err;

        lista = JSON.parse(data);
        const persona = lista.find(p => p.id == id);

        if (!persona) {
            res.status(404).end();
            return;
        }

        const model = {
            "title": `datos de ${persona.nombre}`,
            'persona': persona
        }

        res.render('personas/profile', model);
    });

    res.status(404).end();
});

module.exports = router;