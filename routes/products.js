const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = './data/products.json';

// Función para leer los datos de productos
const readProducts = () => {
    const data = fs.readFileSync(path, 'utf8');
    return JSON.parse(data);
};

// Función para escribir los datos de productos
const writeProducts = (products) => {
    fs.writeFileSync(path, JSON.stringify(products, null, 2));
};

// Ruta raíz GET / (listar todos los productos)
router.get('/', (req, res) => {
    const { limit } = req.query;
    let products = readProducts();
    if (limit) {
        products = products.slice(0, limit);
    }
    res.json(products);
});

// Ruta GET /:pid (obtener un producto por id)
router.get('/:pid', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id == req.params.pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

// Ruta raíz POST / (agregar un nuevo producto)
router.post('/', (req, res) => {
    const products = readProducts();
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

    const id = products.length ? products[products.length - 1].id + 1 : 1;
    const newProduct = { id, title, description, code, price, status, stock, category, thumbnails };

    products.push(newProduct);
    writeProducts(products);

    res.status(201).json(newProduct);
});

// Ruta PUT /:pid (actualizar un producto por id)
router.put('/:pid', (req, res) => {
    const products = readProducts();
    const index = products.findIndex(p => p.id == req.params.pid);
    
    if (index !== -1) {
        const { id, ...updates } = req.body;
        products[index] = { ...products[index], ...updates };
        writeProducts(products);
        res.json(products[index]);
    } else {
        res.status(404).send('Product not found');
    }
});

// Ruta DELETE /:pid (eliminar un producto por id)
router.delete('/:pid', (req, res) => {
    let products = readProducts();
    const initialLength = products.length;
    products = products.filter(p => p.id != req.params.pid);
    
    if (products.length < initialLength) {
        writeProducts(products);
        res.status(204).send();
    } else {
        res.status(404).send('Product not found');
    }
});

module.exports = router;