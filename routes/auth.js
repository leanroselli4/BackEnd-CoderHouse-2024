// routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
const router = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true });
    return res.json({ token });
  })(req, res, next);
});

export default router;
