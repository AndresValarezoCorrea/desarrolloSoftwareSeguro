import mongoose from "mongoose";

const productSchema =mongoose.Schema({
    name: String,
    description: String,
    price: String,
    saltField: String,
});

const collection= "product";
const Product =mongoose.model(collection, productSchema);

export default Product;