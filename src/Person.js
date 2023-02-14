import mongoose from "mongoose";

class Person {
    constructor(name, nachname, email) {
        this.name = name;
        this.nachname = nachname;
        this.email = email;
    }
}

const Schema = mongoose.Schema;

const PersonSchema = new Schema({
    name: String,
    nachname: String,
    email: String
});

const PersonModel = mongoose.model('PersonModel', PersonSchema);

export { Person, PersonModel };

// export default PersonModel
//{id: «zufälig generierte ID»name: «max»,nachname: «musterman»email: «info@maxmuster.com»}