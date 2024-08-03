Proyecto E-Commerce CoderHouse 2024 (Backend)
Para iniciar el servidor, usa el siguiente comando en tu terminal:
bash: npm start
La aplicación estará disponible en http://localhost:3000.

Estructura del Proyecto:
-server.js: Archivo principal del servidor Express.
-models/Product.js: Definición del esquema y modelo de productos utilizando Mongoose.
-models/Cart.js: Definición del esquema y modelo de carritos utilizando Mongoose.
-models/User.js: Definición del esquema y modelo de usuarios con autenticación y autorización.
-routes/products.js: Rutas y controladores para los productos.
-routes/carts.js: Rutas y controladores para los carritos.
-routes/sessions.js: Rutas para autenticación y autorización de usuarios.
-views/: Vistas Handlebars para renderizar las páginas HTML.
-data/: Archivos JSON.
-public/: Archivos estáticos (CSS, imágenes, etc.).

Funcionalidades Implementadas:
-Gestión de Productos: Consulta de productos con paginación, filtros y ordenamientos. Vista en tiempo real de productos con Socket.IO.
-Gestión de Carritos: Adición, eliminación y actualización de productos en el carrito. Vista específica de carrito con lista de productos asociados.
-Sistema de Autenticación y Autorización:
-Modelo de Usuario: Creación de usuarios con campos para nombre, correo electrónico, edad, contraseña encriptada, carrito y rol.
-Encriptación de Contraseñas: Uso de bcrypt para encriptar las contraseñas de los usuarios.
-Autenticación con JWT: Implementación de un sistema de inicio de sesión que utiliza JWT para autenticación de usuarios.
-Estrategia “Current”: Extracción y validación de JWT para obtener el usuario asociado. Ruta /api/sessions/current para devolver los datos del usuario logueado basado en el JWT.

Dependencias Principales:
-Express: Framework web para Node.js.
-MongoDB y Mongoose: Base de datos y ODM para almacenamiento de datos.
-Socket.IO: Librería para comunicación bidireccional en tiempo real.
-Handlebars: Motor de plantillas para generar las vistas HTML.
-bcrypt: Paquete para encriptar contraseñas.
-Passport: Middleware para la autenticación con estrategias locales y JWT.
-jsonwebtoken: Paquete para manejar JWT.

Autor:
Leandro Roselli. 2024
