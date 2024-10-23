// routes/carts.js
import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Ticket from '../models/Ticket.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * @swagger
 * /carts/{cid}/products/{pid}:
 *   delete:
 *     summary: Remove product from cart
 *     description: Deletes a product from a cart.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product removed from cart
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /carts/{cid}:
 *   put:
 *     summary: Update cart products
 *     description: Updates the products in a cart.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /carts/{cid}/products/{pid}:
 *   put:
 *     summary: Update product quantity in cart
 *     description: Updates the quantity of a product in the cart.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product quantity updated in cart
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /carts/{cid}:
 *   delete:
 *     summary: Remove all products from cart
 *     description: Deletes all products from a cart.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: All products removed from cart
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /carts/{cid}:
 *   get:
 *     summary: Get cart details
 *     description: Retrieves details of a specific cart.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Cart details
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /carts/{cid}/products/{pid}:
 *   post:
 *     summary: Add product to cart
 *     description: Adds a product to a specific cart or increases its quantity.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product added to cart
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }
    await cart.save();
    res.redirect('/cart');
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * @swagger
 * /carts/{cid}/purchase:
 *   post:
 *     summary: Purchase the cart
 *     description: Processes a purchase of the cart, creating a ticket and updating stock.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Purchase completed
 *        404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
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

    const ticket = new Ticket({
      code: uuidv4(),
      purchase_datetime: new Date(),
      amount: purchasedProducts.reduce((total, item) => total + item.quantity * item.product.price, 0),
      purchaser: req.user.email
    });
    await ticket.save();

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

