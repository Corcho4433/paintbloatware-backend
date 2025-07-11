<<<<<<< HEAD
import express from "express";
import { authRouter } from "./routers/auth-router";
import { commentRouter } from "./routers/comment-router";
import { postRouter } from "./routers/post-router";
import { userRouter } from "./routers/user-router";
import { errorHandler, notFoundHandler } from "./errors/error_middleware";
=======
import express from 'express';
import { userRouter } from './routers/user-router';
import { postRouter } from './routers/post-router';
import { commentRouter } from './routers/comment-router';
import { authRouter } from './routers/auth-router'
import cors from 'cors';
>>>>>>> master

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Only allow this origin
}));

// Routes
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/auth", authRouter);

// Health check
app.get("/health", (req, res) => {
	try {
		res.json({ status: "healthy" });
	} catch (error) {
		console.log(error);
	}
});

app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
