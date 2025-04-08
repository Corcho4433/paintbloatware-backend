import express from 'express';
import { getPostById, getPosts,getPostsWithUser } from '../services/post-service';

export const postRouter = express.Router();

postRouter.get('/', async (req, res) => {
  try {
    const posts = await getPosts();
    res.json({ "posts": posts });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error skibidi' });
  }
});


postRouter.get('/user', async (req, res) => {
    try {
      const posts = await getPostsWithUser();
      res.json({ "posts": posts });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error skibidi' });
    }
  });
  
postRouter.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const post = await getPostById(id)
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error sigma' });
  }
});
