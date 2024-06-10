const express = require('express');
const path = require('path');
const fs = require('fs');

module.exports = (carts) => {
    const router = express.Router();
    const cartsFilePath = path.join(__dirname, '..', 'carrito.json');

    const readDataFromFile = () => {
        if (fs.existsSync(cartsFilePath)) {
            const data = fs.readFileSync(cartsFilePath);
            return JSON.parse(data);
        }
        return [];
    };

    const writeDataToFile = () => {
        fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
    };

    // Ruta raíz POST /
    router.post('/', (req, res) => {
        const newCart = {
            id: carts.length ? (parseInt(carts[carts.length - 1].id) + 1).toString() : '1',
            products: []
        };
        carts.push(newCart);
        writeDataToFile();
        res.status(201).json(newCart);
    });

    // Ruta GET /:cid
    router.get('/:cid', (req, res) => {
        const cart = carts.find(c => c.id === req.params.cid);
        res.json(cart || { error: 'Carrito no encontrado' });
    });

    // Ruta POST /:cid/product/:pid
    router.post('/:cid/product/:pid', (req, res) => {
        const cart = carts.find(c => c.id === req.params.cid);
        if (cart) {
            const product = cart.products.find(p => p.product === req.params.pid);
            if (product) {
                product.quantity += 1;
            } else {
                cart.products.push({ product: req.params.pid, quantity: 1 });
            }
            writeDataToFile();
            res.status(201).json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    });

    return router;
};