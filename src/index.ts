import express from 'express';
import { userRouter } from './routers/user-router';
import { postRouter } from './routers/post-router';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
