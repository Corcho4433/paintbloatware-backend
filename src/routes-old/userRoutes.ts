/* import express from 'express';
import * as userController from '../models/user';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await userController.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error toilet' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await userController.getUserById(parseInt(req.params.id));
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; */