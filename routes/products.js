const express = require('express');
const path = require('path');
const fs = require('fs');

module.exports = (products, io) => {
    const router = express.Router();
    const productsFilePath = path.join(__dirname, '..', 'productos.json');

    const readDataFromFile = () => {
        if (fs.existsSync(productsFilePath)) {
            const data = fs.readFileSync(productsFilePath);
            return JSON.parse(data);
        }
        return [];
    };

    const writeDataToFile = () => {
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    };

    // Ruta raíz GET /
    router.get('/', (req, res) => {
        const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
        res.json(products.slice(0, limit));
    });

    // Ruta GET /:pid
    router.get('/:pid', (req, res) => {
        const product = products.find(p => p.id === req.params.pid);
        res.json(product || { error: 'Producto no encontrado' });
    });

    // Ruta raíz POST /
    router.post('/', (req, res) => {
        const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
        const newProduct = {
            id: products.length ? (parseInt(products[products.length - 1].id) + 1).toString() : '1',
            title, description, code, price, status, stock, category, thumbnails
        };
        products.push(newProduct);
        writeDataToFile();
        io.emit('updateProducts', products);
        res.status(201).json(newProduct);
    });

    // Ruta PUT /:pid
    router.put('/:pid', (req, res) => {
        const product = products.find(p => p.id === req.params.pid);
        if (product) {
            Object.assign(product, req.body);
            writeDataToFile();
            io.emit('updateProducts', products);
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    });

    // Ruta DELETE /:pid
    router.delete('/:pid', (req, res) => {
        const productIndex = products.findIndex(p => p.id === req.params.pid);
        if (productIndex !== -1) {
            products.splice(productIndex, 1);
            writeDataToFile();
            io.emit('updateProducts', products);
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    });

    return router;
};