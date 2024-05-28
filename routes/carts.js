const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const cartsPath = path.join(__dirname, '../data/carts.json');

// Función para leer los datos de carritos
const readCarts = () => {
    const data = fs.readFileSync(cartsPath, 'utf8');
    return JSON.parse(data);
};

// Función para escribir los datos de carritos
const writeCarts = (carts) => {
    fs.writeFileSync(cartsPath, JSON.stringify(carts, null, 2));
};

// Ruta raíz POST / (crear un nuevo carrito)
router.post('/', (req, res) => {
    const carts = readCarts();
    const id = carts.length ? carts[carts.length - 1].id + 1 : 1;
    const newCart = { id, products: [] };

    carts.push(newCart);
    writeCarts(carts);

    res.status(201).json(newCart);
});

// Ruta GET /api/carts (listar todos los carritos)
router.get('/', (req, res) => {
    const carts = readCarts();
    res.json(carts);
});

// Ruta GET /:cid (listar productos de un carrito por id)
router.get('/:cid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id == req.params.cid);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).send('Cart not found');
    }
});

// Ruta POST /:cid/product/:pid (agregar un producto al carrito)
router.post('/:cid/product/:pid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id == req.params.cid);
    if (!cart) {
        return res.status(404).send('Cart not found');
    }

    const { pid } = req.params;
    const { quantity = 1 } = req.body;
    const productIndex = cart.products.findIndex(p => p.product == pid);

    if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
    } else {
        cart.products.push({ product: pid, quantity });
    }

    writeCarts(carts);
    res.status(201).json(cart);
});

module.exports = router;