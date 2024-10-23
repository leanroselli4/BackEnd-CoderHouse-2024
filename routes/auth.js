// routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import passport from '../config/passport.js';
import UserRepository from '../repositories/UserRepository.js';
import UserDTO from '../dto/UserDTO.js';
import { isAdmin } from '../middleware/authorization.js';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: User already exists
 *       500:
 *         description: Error registering user
 */
router.post('/register', async (req, res) => {
  try {
    console.log(req.body);
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).send('Missing required fields');
    }
    const existingUser = await UserRepository.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).send('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserRepository.createUser({ first_name, last_name, email, age, password: hashedPassword });
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).send(`Error registering user: ${error.message}`);
  }
});

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Retrieve a list of all users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Error retrieving users
 */
router.get('/users', passport.authenticate('jwt', { session: false }), isAdmin, async (req, res) => {
  try {
    const users = await UserRepository.getAllUsers();
    res.render('users', { users });
  } catch (error) {
    console.error('Error retrieving users:', error.message);
    res.status(500).send(`Error retrieving users: ${error.message}`);
  }
});

/**
 * @swagger
 * /auth/current:
 *   get:
 *     summary: Get current user
 *     description: Retrieve information about the currently logged-in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information
 *       500:
 *         description: Error fetching user
 */
router.get('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await UserRepository.getUserById(req.user._id);
    res.json(new UserDTO(user));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

export default router;