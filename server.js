const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();

const path = require('path');

let notes = require('./db/db.json');

const { v4: uuidv4 } = require('uuid');

const fs = require ('fs')


app.use(express.urlencoded({ extended: true }));


app.use(express.json());

app.use(express.static('public'));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });
  
  app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });



app.get('/api/notes', (req, res) => {
    res.json(notes)
});

app.post('/api/notes', (req, res) => {
   

    req.body.id = uuidv4();

    notes.push(req.body)
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(notes)
});



app.delete("/api/notes/:id", (req, res) => {
    let id = req.params.id
    notes = notes.filter(n => {
        if (id === n.id) {
            return false
        } else {
            return true
        }
    })
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(notes)
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});