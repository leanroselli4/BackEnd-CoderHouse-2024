// routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import passport from '../config/passport.js';
import UserRepository from '../repositories/UserRepository.js';
import UserDTO from '../dto/UserDTO.js';
import { isAdmin } from '../middleware/authorization.js';

const router = express.Router();

// Ruta para registrar un usuario
router.post('/register', async (req, res) => {
  try {
    console.log(req.body);

    const { first_name, last_name, email, age, password } = req.body;

    // Asegurarse de que todos los campos requeridos estén presentes
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).send('Missing required fields');
    }

    // Verificar si el usuario ya existe
    const existingUser = await UserRepository.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).send('User already exists');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = await UserRepository.createUser({ first_name, last_name, email, age, password: hashedPassword });
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).send(`Error registering user: ${error.message}`);
  }
});

// Ruta para mostrar todos los usuarios (solo admin)
router.get('/users', passport.authenticate('jwt', { session: false }), isAdmin, async (req, res) => {
  try {
    const users = await UserRepository.getAllUsers();
    res.render('users', { users });
  } catch (error) {
    console.error('Error retrieving users:', error.message);
    res.status(500).send(`Error retrieving users: ${error.message}`);
  }
});

// Ruta para obtener el usuario actual (solo autenticado)
router.get('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await UserRepository.getUserById(req.user._id);
    res.json(new UserDTO(user));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

export default router;
