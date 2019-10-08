var express = require('express');
var router = express.Router();
const fs = require('fs');
const file = './data/personas.json';
/* GET home page. */

router.get('/', (req, res) => {
    fs.readFile(file, (err, data) => {
        if (err) throw err;
        let lista = JSON.parse(data);
        res.json(lista);
    });

});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile(file, (err, data) => {
        if (err) throw err;
        const lista = JSON.parse(data);
        let item = lista.find(e => e.id == id);
        console.log(item);
        if (item) {
            res.json(item);
        } else {
            res.status(404).end();
        }
    });
});

router.post('/', (req, res) => {

    const { id, nombre, apellidos, edad } = req.body;
    let errors = [];

    if (!id) {
        fs.readFile('./data/personas.json', (err, data) => {
            if (err) throw err;
            const lista = JSON.parse(data);
            const lastIndex = lista.length - 1;
            id = lista[lastIndex].id + 1
        });
    }

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
        res.status(400).json(errors);
        return;
    }

    fs.readFile('./data/personas.json', (err, data) => {
        if (err) throw err;
        const listado = JSON.parse(data);
        listado.push(persona);

        fs.writeFile('./data/personas.json', JSON.stringify(listado), 'utf8', (err) => {
            if (err) throw err;
            res.status(201).end();
        });

    });
});

router.put('/:id', async(req, res) => {
    const { id } = req.params;
    console.log('AQui mas')
    const { nombre, apellidos, edad } = req.body;

    let errors = [];
    if (!nombre) errors.push("El nombre es obligatorio");
    if (!apellidos) errors.push("Los apellidos son obligatorios");
    if (!edad) errors.push("la edad es obligatoria");

    if (errors.length) {
        res.status(400).json(errors);
        return;
    }

    const data = await fs.promises.readFile('./data/personas.json', 'utf8');
    const listado = JSON.parse(data);
    const index = listado.findIndex(item => item.id == id);

    if (index == -1) {
        res.status(404).end();
        return;
    }

    listado[index] = {
        'id': id,
        'nombre': nombre,
        'apellidos': apellidos,
        'edad': edad
    }

    await fs.promises.writeFile(file, JSON.stringify(listado), 'utf8');
    res.status(200).end();
});

router.patch('/:id', async(req, res) => {
    const { id } = req.params;

    let errors = [];
    if (!req.body.nombre) errors.push("El nombre es obligatorio");
    if (!req.body.apellidos) errors.push("Los apellidos son obligatorios");
    if (!req.body.edad) errors.push("la edad es obligatoria");

    if (errors.length) {
        res.status(400).json(errors);
        return;
    }

    const data = await fs.promises.readFile('./data/personas.json', 'utf8');
    const listado = JSON.parse(data);
    const index = listado.findIndex(item => item.id == id);

    if (index == -1) {
        res.status(404).end();
        return;
    }

    listado[index] = Object.assign(listado[index], req.body);

    await fs.promises.writeFile(file, JSON.stringify(listado), 'utf8');
    res.status(200).json(listado[index]);
});

router.delete('/:id', async(req, res) => {
    const { id } = req.params;

    const data = await fs.promises.readFile(file, 'utf8');
    const listado = JSON.parse(data);
    const index = listado.findIndex(item => item.id == id);

    if (index == -1) {
        res.status(404).end();
        return;
    }

    listado.splice(index, 1);
    await fs.promises.writeFile(file, JSON.stringify(listado), 'utf8');
    res.status(204).end();
});

module.exports = router;