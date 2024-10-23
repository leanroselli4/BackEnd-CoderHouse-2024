import { Router } from 'express';
import bcrypt from 'bcrypt';
import { mockPets } from '../mocking/mockPets.js'; // Ruta a tu archivo de mockPets
import { generateMockUsers } from '../mocking/mockUsers.js';
import User from '../models/User.js'; // Verifica la ruta al modelo User

const router = Router();

/**
 * @swagger
 * /mockingpets:
 *   get:
 *     summary: Genera mascotas mockeadas.
 *     description: Retorna una lista de mascotas generadas aleatoriamente.
 *     responses:
 *       200:
 *         description: Lista de mascotas generadas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       breed:
 *                         type: string
 *                       age:
 *                         type: number
 *       500:
 *         description: Error al generar las mascotas.
 */
router.get('/mockingpets', (req, res) => {
    try {
        const pets = mockPets();
        res.json({ pets });
    } catch (error) {
        res.status(500).json({ error: 'Error al generar mascotas' });
    }
});

/**
 * @swagger
 * /mockingusers:
 *   get:
 *     summary: Genera 50 usuarios mockeados.
 *     description: Retorna una lista de 50 usuarios con roles aleatorios y contraseñas encriptadas.
 *     responses:
 *       200:
 *         description: Lista de usuarios generados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       password:
 *                         type: string
 *       500:
 *         description: Error al generar los usuarios.
 */
router.get('/mockingusers', async (req, res) => {
    try {
        const users = generateMockUsers(50);
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Error al generar usuarios' });
    }
});

/**
 * @swagger
 * /generateData:
 *   post:
 *     summary: Genera usuarios y mascotas mockeadas.
 *     description: Inserta usuarios mockeados en la base de datos y retorna los usuarios insertados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: number
 *                 description: Cantidad de usuarios a generar.
 *               pets:
 *                 type: number
 *                 description: Cantidad de mascotas a generar.
 *     responses:
 *       200:
 *         description: Usuarios insertados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 insertedUsers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       password:
 *                         type: string
 *       500:
 *         description: Error al generar los datos.
 */
router.post('/generateData', async (req, res) => {
    const { users, pets } = req.body; // Usuarios y mascotas que llegan en el cuerpo de la petición
    try {
        const mockUsers = generateMockUsers(users);
        const insertedUsers = await User.insertMany(mockUsers); // Inserta los usuarios en la base de datos
        // Aquí podrías agregar la lógica para insertar las mascotas
        res.json({ insertedUsers });
    } catch (error) {
        res.status(500).json({ error: 'Error al generar los datos' });
    }
});

export default router;