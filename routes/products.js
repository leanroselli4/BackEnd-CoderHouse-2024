import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Ruta para obtener productos con paginación, filtrado y ordenamiento
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

// Ruta para crear un nuevo producto
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

// Ruta para eliminar un producto
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