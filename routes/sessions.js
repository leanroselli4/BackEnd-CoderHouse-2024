// routes/sessions.js
import express from 'express';
import currentUser from '../middleware/currentUser.js';
const router = express.Router();

/**
 * @swagger
 * /sessions/current:
 *   get:
 *     summary: Obtiene la información del usuario actual autenticado.
 *     description: Devuelve los datos del usuario autenticado usando el middleware `currentUser`. Si no hay usuario autenticado, responde con un código 401.
 *     responses:
 *       200:
 *         description: Información del usuario actual obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 cart:
 *                   type: string
 *                 age:
 *                   type: number
 *       401:
 *         description: No hay usuario autenticado.
 */
router.get('/current', currentUser, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No user logged in' });
  }
  res.json(req.user);
});

export default router;