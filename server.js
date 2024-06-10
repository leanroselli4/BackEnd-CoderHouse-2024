const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 8080;

// Configurar Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Datos en memoria (puedes cambiarlos a una base de datos o archivos JSON como en la especificación original)
let products = [];
let carts = [];

// Importa los routers
const productsRouter = require('./routes/products.js')(products, io);
const cartsRouter = require('./routes/carts.js')(carts);

// Rutas de vistas
app.get('/', (req, res) => {
    res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products });
});

// Usa los routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Manejo de sockets
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.emit('updateProducts', products);

    socket.on('addProduct', (product) => {
        products.push(product);
        io.emit('updateProducts', products);
    });

    socket.on('deleteProduct', (index) => {
        products.splice(index, 1);
        io.emit('updateProducts', products);
    });
});

// Iniciar el servidor
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});