import express from 'express';
import { getCommentById, getComments,getCommentsByPost } from '../services/comment-service';

export const commentRouter = express.Router();

commentRouter.get('/', async (req, res) => {
  try {
    const comments = await getComments();
    res.json({ "comments": comments });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error skibidi' });
  }
});

commentRouter.get('/post/:post', async (req, res) => {
    try {
      const id_post = parseInt(req.params.post)
      const comments = await getCommentsByPost(id_post);
      res.json({ "comments": comments });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error skibidi' });
    }
  });
  
commentRouter.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const comment = await getCommentById(id)
    if (comment) {
      res.json(comment);
    } else {
      res.status(404).json({ error: 'Comment not found lolo' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error sigma male rizzler niggachain' });
  }
});
