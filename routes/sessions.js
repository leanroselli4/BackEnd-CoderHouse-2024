// routes/sessions.js
import express from 'express';
import currentUser from '../middleware/currentUser.js';
const router = express.Router();

router.get('/current', currentUser, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No user logged in' });
  }
  res.json(req.user);
});

export default router;
