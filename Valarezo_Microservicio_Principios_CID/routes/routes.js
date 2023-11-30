import express from "express";
import Jwt  from "jsonwebtoken";
import dotenv from 'dotenv';
import { addProduct, getAllProducts, editProduct, deleteProduct, getProductById } from "../controller/product-controller.js";

const router = express.Router();
dotenv.config();

const authenticateToken = (req, res, next) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado. Falta el token de autenticación.' });
  }

  Jwt.verify(token, accessTokenSecret, (err) => {
    if (err) {
      return res.status(403).json({ message: 'Token no válido.' });
    }
    next();
  });
};

router.post('/product',authenticateToken, addProduct);
router.get('/products',authenticateToken, getAllProducts);
router.get('/product/:id',authenticateToken, getProductById);
router.put('/product/:id',authenticateToken, editProduct);
router.delete('/product/:id',authenticateToken, deleteProduct);

router.get('/', (req, res) => {
  res.send('API enfocada a productos');
});

export default router;