Proyecto eShop
Este proyecto es una aplicación web para una tienda virtual desarrollada con Node.js, Express, MongoDB y Socket.IO. Permite gestionar productos y carritos de compra, además de ofrecer una vista en tiempo real de los productos añadidos.

Iniciar el servidor:
bash
npm start

Acceder a la aplicación:

La aplicación estará disponible en http://localhost:3000.

Estructura del Proyecto:
-server.js: Archivo principal del servidor Express.
-models/Product.js: Definición del esquema y modelo de productos utilizando Mongoose.
-models/Cart.js: Definición del esquema y modelo de carritos utilizando Mongoose.
-routes/products.js: Rutas y controladores para los productos.
-routes/carts.js: Rutas y controladores para los carritos.
-views/: Vistas Handlebars para renderizar las páginas HTML.
-data/: Archivos JSON.
-public/: Archivos estáticos (CSS, imágenes, etc.).

Funcionalidades Implementadas
-Gestión de Productos:
Consulta de productos con paginación, filtros y ordenamientos.
Vista en tiempo real de productos con Socket.IO.

-Gestión de Carritos:
Adición, eliminación y actualización de productos en el carrito.
Vista específica de carrito con lista de productos asociados.

-Dependencias Principales:
Express: Framework web para Node.js.
MongoDB y Mongoose: Base de datos y ODM para almacenamiento de datos.
Socket.IO: Librería para comunicación bidireccional en tiempo real.
Handlebars: Motor de plantillas para generar las vistas HTML.

Autores:
Leandro Roselli
