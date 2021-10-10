// main.js
const fs = require('fs')
const express = require('express')

const app = express()
app.use(express.json())
const port = process.env.PORT || 8084
let personajes = []

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Content-Type', 'application/json');
    next();
});

const loadPersonajes = () => {
    fs.readFile(__dirname + '/' + 'personajes.json', 'utf8', (err, data) => {
        personajes = JSON.parse(data)
    });
}
loadPersonajes()

const savePersonajes = () => {
    let data = JSON.stringify(personajes)
    fs.writeFileSync(__dirname + '/' + 'personajes.json', data)
}

app.get('/personaje', (req, res) => {
    res.json(personajes);
})

app.get('/personaje/:id', (req, res) => {
    let personaje = personajes.find(i => i.id == req.params.id);
    if (personaje == undefined)
        res.status(404).send('Personaje not found');
    else
        res.json(personaje);
})

app.post('/personaje', (req, res) => {
    let index = personajes.findIndex(i => i.id == req.params.id);
    if (index != -1)
      res.status(404).send('Personaje already exits'); 
    else {
      personajes.push(req.body);
      savePersonajes();
    }
    res.status(200).send('Personaje added');
  })

app.put('/personaje/:id', (req, res) => {
    let index = personajes.findIndex(i => i.id == req.params.id);
    if (index == -1)
        res.status(404).send('Personaje not found');
    else {
        personajes[index] = req.body;
        savePersonajes();
    }
    res.status(200).send('Personaje updated');
})

app.delete('/personaje/:id', (req, res) => {
    let index = personajes.findIndex(i => i.id == req.params.id);
    if (index == -1)
        res.status(404).send('Personaje not found');
    else {
        personajes = personajes.filter(i => i.id != req.params.id);
        savePersonajes();
    }
    res.status(200).send('Personaje deleted');
})

app.listen(port, () => 
  console.log(`Personajes Server listening on port ${port}`)
)