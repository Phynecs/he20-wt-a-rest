import express from 'express'
import { Person, PersonModel } from "./Person.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

await mongoose.connect('mongodb://127.0.0.1:27017/test');
app.use(bodyParser.json())


//GET / Gibt ein Array mit allen gespeicherten Personen aus.
app.get('/', async function (req, res) {
    // find all documents
    let mongoPersons = await PersonModel.find({})
    console.log(mongoPersons.all)
    res.send(mongoPersons);
});

//GET /{id} Gibt explizit die Person mit der gesuchten ID aus. Wenn nicht vorhanden wir ein HTTP 404-Fehler zurückgegeben.
app.get('/:id', async function (req, res) {
    const id = req.params.id;

    const person = await PersonModel.findById(id)

    if (person) {
        res.send(person);
    }
    res.status(404).send();
});

//POST / Speichert eine Person, die via Request Body mitgesendet wird.
app.post('/', function (req, res) {
    let person = new Person(req.body.name, req.body.nachname, req.body.email);
    let instance = new PersonModel(person);

    instance.save(function (err) {
        console.log(err)
    });
    res.status(201).send(instance);
});

//PUT /{id} Überschreibt die bestehende Person mit den Daten, die im Request Body mitgeschickt werden.
app.put('/:id', async (req, res) => {
    const id = req.params.id;
    let person = new Person(req.body.name, req.body.nachname, req.body.email)
    let instance = await PersonModel.findOneAndReplace({ _id: id}, person, {
        returnOriginal: false
    })

    res.send(instance)
})

//PATCH /{id} Überschreibt nur die Eigenschaften einer Person, die im Request Body übermittelt werden.
app.patch('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let instance = await PersonModel.findByIdAndUpdate(id, req.body, {
            returnOriginal: false
        });
        res.send(instance)
    } catch (err) {
        res.status(404).send()
    }
})

//DELETE /{id} Löscht die entsprechende Person.
app.delete('/:id', (req, res) => {
    const id = req.params.id;
    PersonModel.findByIdAndDelete({_id: id}, function (err, docs) {
        if (err){
            res.status(404).send();
        } else {
            res.status(204).send();
        }
    })
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