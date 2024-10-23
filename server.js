import express from 'express';
import http from 'http';
import { Server as socketIo } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import mongoose from 'mongoose';
import productRouter from './routes/products.js';
import cartRouter from './routes/carts.js';
import authRouter from './routes/auth.js';
import sessionRouter from './routes/sessions.js';
import mocksRouter from './routes/mocks.router.js'; // Importar el nuevo router
import { fileURLToPath } from 'url';
import Product from './models/Product.js';
import User from './models/User.js';
import cookieParser from 'cookie-parser';
import passport from './config/passport.js';
import methodOverride from 'method-override'; // Importar method-override
import swaggerJSDoc from 'swagger-jsdoc'; // Importar Swagger
import swaggerUi from 'swagger-ui-express'; // Importar Swagger UI

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new socketIo(server);

// Swagger configuración
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Eshop API',
            version: '1.0.0',
            description: 'API para la gestión de Usuarios, Productos y Adopciones',
        },
    },
    apis: ['./routes/*.js'], // Asegúrate de ajustar la ruta si es necesario
};

// Inicializar Swagger
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
app.use(methodOverride('_method')); // Configurar method-override
app.use(passport.initialize());

// Sirviendo archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Handlebars con soporte para layouts y helpers
app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    extname: '.handlebars',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas API
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/auth', authRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/mocks', mocksRouter); // Agregar el nuevo router para mocks

// Rutas de vistas

// Página de inicio
app.get('/', (req, res) => {
    res.render('index');
});

// Gestión de Usuarios (CRUD)
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        const usersData = users.map(user => user.toObject());
        res.render('users', { users: usersData });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.render('users', { users: [] });
    }
});

app.post('/users/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.redirect('/users'); // Redirige a la lista de usuarios después de la eliminación
    } catch (error) {
        console.error('Error deleting user:', error);
        res.redirect('/users'); // Redirige en caso de error
    }
});

// Gestión de Productos
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.render('products', { products: [] });
    }
});

// Gestión del Carrito
app.get('/cart', async (req, res) => {
    try {
        // Lógica para obtener los productos del carrito del usuario
        const cart = {}; // Aquí debes integrar la lógica para obtener el carrito del usuario
        res.render('cart', { cart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.render('cart', { cart: {} });
    }
});

// Productos en Tiempo Real
app.get('/realtimeproducts', async (req, res) => {
    try {
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