import Product from '../Schema/productSchema.js';
import crypto from 'crypto';

export const addProduct = async (request, response) => {
    const productData = request.body;

    if (!productData.name || !productData.description || !productData.price) {
        return response.status(400).json({ message: 'Los campos name, description y price son obligatorios.' });
    }

    const salt = crypto.randomBytes(16).toString('hex');

    productData.saltField = salt;

    const newProduct = new Product(productData);

    try {
        await newProduct.save();
        response.status(201).json(newProduct);
    } catch (error) {
        response.status(409).json({ message: error.message });
    }
};

export const getAllProducts = async (request, response) => {
    try {
        const products = await Product.find({});

        // Hashear los atributos de cada producto
        const hashedProducts = products.map(product => {
            const saltField = product.saltField;
            const id = product._id;
            const name = crypto.createHash('sha256').update(product.name + saltField).digest('hex');
            const description = crypto.createHash('sha256').update(product.description + saltField).digest('hex');
            const price = crypto.createHash('sha256').update(product.price.toString() + saltField).digest('hex');

            // Crear un nuevo objeto con los atributos hasheados
            return {
                id,
                name,
                description,
                price,
                saltField,
            };
        });

        response.status(200).json(hashedProducts);
    } catch (error) {
        response.status(404).json({ message: error.message });
    }
};

export const getProductById = async (request, response) => {
    const { id } = request.params;

    try {
        var product = await Product.findById(id);

        const saltField = product.saltField;
        const name = crypto.createHash('sha256').update(product.name + saltField).digest('hex');
        const description = crypto.createHash('sha256').update(product.description + saltField).digest('hex');
        const price = crypto.createHash('sha256').update(product.price.toString() + saltField).digest('hex');


        product.name = name;
        product.description = description;
        product.price = price;

        if (!product) {
            return response.status(404).json({ message: "Producto no encontrado" });
        }

        response.status(200).json(product);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
};

export const editProduct = async (request, response) => {
    try {
        const productId = request.params.id;
        const updatedProduct = request.body;

        const product = await Product.findById(productId);

        if (!product) {
            return response.status(404).json({ message: 'Producto no encontrado' });
        }

        product.name = updatedProduct.name;
        product.description = updatedProduct.description;
        product.price = updatedProduct.price;

        const result = await product.save();
        response.status(200).json(result);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        response.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const deleteProduct = async (request, response) => {
    const { id } = request.params;

    try {
        const result = await Product.findByIdAndRemove(id);

        if (!result) {
            return response.status(404).json({ message: 'Producto no encontrado' });
        }

        response.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
};

  