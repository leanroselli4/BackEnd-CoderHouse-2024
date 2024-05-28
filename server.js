const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());

// Importa los routers
const productsRouter = require('./routes/products.js');
const cartsRouter = require('./routes/carts.js');

// Ruta básica para la raíz del servidor
app.get('/', (req, res) => {
    res.send('Bienvenido al E-commerce API de Lean Roselli!');
});

// Usa los routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});