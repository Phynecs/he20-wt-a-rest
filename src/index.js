import express from 'express'
import { v4 as uuidv4 } from 'uuid';
import Person from "./Person.js";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let persons = []

// Test zwecke - wehe eper loescht das..
let person = new Person(uuidv4(), "foo", "bar", "foo.bar@hf-ict.ch")

app.use(bodyParser.json())

persons.push(person)

//GET / Gibt ein Array mit allen gespeicherten Personen aus.
app.get('/', function(req, res) {
    res.send(persons);
});

//GET /{id} Gibt explizit die Person mit der gesuchten ID aus. Wenn nicht vorhanden wir ein HTTP 404-Fehler zurückgegeben.
app.get('/:id', function(req, res) {
    const id = req.params.id;
    const person = persons.find((p) => p.id === id);
    if (person) {
        res.send(person);
    }
    res.status(404).send();
});

//POST / Speichert eine Person, die via Request Body mitgesendet wird.
app.post('/', function (req, res) {
    let person = new Person(uuidv4(), req.body.name, req.body.nachname, req.body.email);
    persons.push(person)
    res.status(201).send(person);
});

//PUT /{id} Überschreibt die bestehende Person mit den Daten, die im Request Body mitgeschickt werden.
app.put('/:id', (req, res) => {
    const id = req.params.id;
    let personNew = new Person(uuidv4(), req.body.name, req.body.nachname, req.body.email)
    const person = persons.find((p) => p.id === id)
    if (person) {
        let index = persons.indexOf(person)
        persons.splice(index, 1)
    }
    persons.push(personNew)
    res.send(personNew)
})

//PATCH /{id} Überschreibt nur die Eigenschaften einer Person, die im Request Body übermittelt werden.
app.patch('/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find((p) => p.id === id);
    if (person) {
        const data = req.body;
        for (let key in data) {
            person[key] = data[key];
        }
        res.send(person);
    }
    res.status(404).send();
})

//DELETE /{id} Löscht die entsprechende Person.
app.delete('/:id', (req, res) => {
    const id = req.params.id;
    const personIdx = persons.findIndex((p) => p.id === id);
    if (personIdx > -1) {
        persons.splice(personIdx, 1);
        res.status(204).send();
    }
    res.status(404).send();
})


app.listen(port)
/*


Methode Pfad Action
GET / Gibt ein Array mit allen gespeicherten Personen aus.
GET /{id} Gibt explizit die Person mit der gesuchten ID aus. Wenn nicht vorhanden wir ein HTTP 404-Fehler zurückgegeben.
POST / Speichert eine Person, die via Request Body mitgesendet wird.
PUT /{id} Überschreibt die bestehende Person mit den Daten, die im Request Body mitgeschickt werden.
PATCH /{id} Überschreibt nur die Eigenschaften einer Person, die im Request Body übermittelt werden.
DELETE /{id} Löscht die entsprechende Person.

{
id: «zufälig generierte ID»
name: «max»,
nachname: «musterman»
email: «info@maxmuster.com»
}
 */