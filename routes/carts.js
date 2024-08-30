// routes/carts.js
import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Ticket from '../models/Ticket.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// DELETE api/carts/:cid/products/:pid
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    res.json({ status: 'success', message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT api/carts/:cid
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT api/carts/:cid/products/:pid
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }
    await cart.save();
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE api/carts/:cid
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    cart.products = [];
    await cart.save();
    res.json({ status: 'success', message: 'All products removed from cart' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET api/carts/:cid
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product');
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST api/carts/:cid/products/:pid
router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex !== -1) {
      // Incrementar cantidad si el producto ya existe en el carrito
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }
    await cart.save();
    res.redirect('/cart');  // Redirige a la vista de carrito
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST api/carts/:cid/purchase
router.post('/:cid/purchase', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product');
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    const purchasedProducts = [];
    const failedProducts = [];

    for (const item of cart.products) {
      const product = await Product.findById(item.product);
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
        purchasedProducts.push(item);
      } else {
        failedProducts.push(item.product);
      }
    }

    // Crear el ticket
    const ticket = new Ticket({
      code: uuidv4(),
      purchase_datetime: new Date(),
      amount: purchasedProducts.reduce((total, item) => total + item.quantity * item.product.price, 0),
      purchaser: req.user.email // Asegúrate de tener acceso al usuario actual
    });
    await ticket.save();

    // Actualizar el carrito
    cart.products = cart.products.filter(item => failedProducts.includes(item.product.toString()));
    await cart.save();

    res.json({
      status: 'success',
      ticket,
      failedProducts
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
