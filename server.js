import express from 'express';
import http from 'http';
import { Server as socketIo } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import mongoose from 'mongoose';
import handlebarsLayouts from 'handlebars-layouts';
import productRouter from './routes/products.js';
import cartRouter from './routes/carts.js';
import authRouter from './routes/auth.js';
import sessionRouter from './routes/sessions.js';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';
import User from './models/User.js';
import cookieParser from 'cookie-parser';
import passport from './config/passport.js';

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new socketIo(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect('mongodb://localhost:27017/eshop')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Configuración de Handlebars
const hbs = engine({
    defaultLayout: 'main', // Si tienes un layout principal
    extname: '.handlebars',
});

hbs.handlebars.registerHelper(handlebarsLayouts(hbs.handlebars));

app.engine('handlebars', hbs);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas API
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/auth', authRouter);
app.use('/api/sessions', sessionRouter);

// Rutas de vistas
app.get('/', (req, res) => res.render('index'));
app.get('/users', async (req, res) => {
    const users = await User.find();
    res.render('users', { users });
});
app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.render('products', { products });
});
app.get('/cart', (req, res) => res.render('cart'));
app.get('/realtimeproducts', async (req, res) => {
    const products = await Product.find();
    res.render('realTimeProducts', { products });
});

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    const emitUpdatedProducts = async () => {
        const products = await Product.find();
        io.emit('updateProducts', products);
    };
    emitUpdatedProducts();

    socket.on('addProduct', async (product) => {
        await Product.create(product);
        emitUpdatedProducts();
    });
    socket.on('deleteProduct', async (productId) => {
        await Product.findByIdAndDelete(productId);
        emitUpdatedProducts();
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
