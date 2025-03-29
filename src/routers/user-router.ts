import express from 'express';
import { getUsers } from '../services/user-service';

export const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  try {
    const users = await getUsers();
    res.json({ "users": users });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error toilet' });
  }
});

userRouter.get('/:id', async (req, res) => {
  try {
    const user = null; // TODO: haganlo
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
