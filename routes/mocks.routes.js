import { Router } from 'express';
import bcrypt from 'bcrypt';
import { mockPets } from '../mocking/mockPets.js'; // Ruta a tu archivo de mockPets
import { generateMockUsers } from '../mocking/mockUsers.js';
import User from '../models/User.js'; // Verifica la ruta al modelo User

const router = Router();

// Endpoint para mockingpets
router.get('/mockingpets', (req, res) => {
    try {
        const pets = mockPets();
        res.json({ pets });
    } catch (error) {
        res.status(500).json({ error: 'Error al generar mascotas' });
    }
});

// Endpoint para generar 50 usuarios mockeados
router.get('/mockingusers', async (req, res) => {
    try {
        const users = generateMockUsers(50);
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Error al generar usuarios' });
    }
});

// Endpoint para generar usuarios y mascotas
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