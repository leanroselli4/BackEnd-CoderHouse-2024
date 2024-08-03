import express from 'express';
import http from 'http';
import { Server as socketIo } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import mongoose from 'mongoose';
import productRouter from './routes/products.js';
import cartRouter from './routes/carts.js';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';
import User from './models/User.js'; // Importar el modelo User
import authRouter from './routes/auth.js'; // Importar rutas de autenticación
import sessionRouter from './routes/sessions.js'; // Importar rutas de sesiones
import cookieParser from 'cookie-parser';
import passport from './config/passport.js'; // Importar configuración de Passport

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new socketIo(server);

// Obtiene la ruta actual del archivo y el directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/eshop')
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));

// Configuración de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas API
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/auth', authRouter);
app.use('/api/sessions', sessionRouter);

// Rutas de vistas
app.get('/', async (req, res) => {
    try {
        // Obtener productos desde MongoDB y renderizar la vista
        const products = await Product.find();
        res.render('home', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.render('home', { products: [] });
    }
});

app.get('/realtimeproducts', async (req, res) => {
    try {
        // Obtener productos desde MongoDB y renderizar la vista
        const products = await Product.find();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.render('realTimeProducts', { products: [] });
    }
});

// Manejo de sockets
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Emitir productos actualizados a todos los clientes
    const emitUpdatedProducts = async () => {
        try {
            const products = await Product.find();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error fetching products for socket update:', error);
        }
    };

    // Emitir productos al conectar cliente
    emitUpdatedProducts();

    socket.on('addProduct', async (product) => {
        try {
            // Agregar producto a MongoDB
            await Product.create(product);
            // Emitir productos actualizados a todos los clientes
            emitUpdatedProducts();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            // Eliminar producto de MongoDB
            await Product.findByIdAndDelete(productId);
            // Emitir productos actualizados a todos los clientes
            emitUpdatedProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
