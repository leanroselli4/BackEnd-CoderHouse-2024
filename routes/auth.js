import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
      console.log(req.body);

      const { first_name, last_name, email, age, password } = req.body;

      // Asegurarse de que todos los campos requeridos estén presentes
      if (!first_name || !last_name || !email || !age || !password) {
          return res.status(400).send('Missing required fields');
      }

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(409).send('User already exists');
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear un nuevo usuario
      const newUser = new User({ first_name, last_name, email, age, password: hashedPassword });
      await newUser.save();

      res.status(201).send('User registered successfully');
  } catch (error) {
      console.error('Error registering user:', error.message);
      res.status(500).send(`Error registering user: ${error.message}`);
  }
});
// Ruta para mostrar todos los usuarios
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Obtener todos los usuarios
    res.render('users', { users }); // Renderizar la vista con los datos de los usuarios
  } catch (error) {
    console.error('Error retrieving users:', error.message);
    res.status(500).send(`Error retrieving users: ${error.message}`);
  }
});

export default router;