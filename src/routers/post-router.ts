import express from 'express';
import { getPosts,getPostsWUser } from '../services/post-service';

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
      const posts = await getPostsWUser();
      res.json({ "posts": posts });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error skibidi' });
    }
  });
  
postRouter.get('/:id', async (req, res) => {
  try {
    const post = null;
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error sigma' });
  }
});
