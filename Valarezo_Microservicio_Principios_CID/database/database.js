import mongoose from "mongoose";
const database = "productsdb";
async function Conection(username, password) {
    const URL = "mongodb+srv://" + username + ":" + password + "@cluster0.edipl.mongodb.net/" + database + "?retryWrites=true&w=majority";
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true, });
        console.log("Connected to MongoDBAtlas successfully");
    } catch (error) {
        console.log("Error with connect to the MongoDBAtlas: " + error);
    };

}

export default Conection;

