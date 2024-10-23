import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtiene una lista de productos con paginación, filtrado y ordenamiento.
 *     description: Permite obtener productos paginados, filtrados por categoría y ordenados por precio.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de productos por página.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página actual.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordena los productos por precio de forma ascendente (asc) o descendente (desc).
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Filtra los productos por categoría.
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Error al obtener los productos.
 */
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    };

    const filter = query ? { category: query } : {};

    const result = await Product.paginate(filter, options);
    res.render('products', {
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crea un nuevo producto.
 *     description: Permite crear un nuevo producto con nombre, precio, categoría y descripción.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto creado exitosamente.
 *       500:
 *         description: Error al crear el producto.
 */
router.post('/', async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const product = new Product({ name, price, category, description });
    await product.save();
    res.redirect('/products'); // Redirige a la vista de productos después de agregar
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).send('Error creating product');
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Elimina un producto por su ID.
 *     description: Permite eliminar un producto usando su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto a eliminar.
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente.
 *       500:
 *         description: Error al eliminar el producto.
 */
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products'); // Redirige a la vista de productos después de eliminar
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Error deleting product');
  }
});

export default router;