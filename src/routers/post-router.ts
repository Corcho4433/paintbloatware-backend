import express from "express";
import {
	createPost,
	getPostById,
	getPosts,
	getPostsByUser,
} from "../services/post-service";
import { isAuth } from "../utils/auth";

export const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
	try {
		const posts = await getPosts();
		res.json({ posts: posts });
	} catch (error) {
		res.status(500).json({ error: "Internal server error skibidi" });
	}
});

postRouter.get("/user/:id", async (req, res) => {
	try {
		const id_user = req.params.id;
		const posts = await getPostsByUser(id_user);
		res.json({ posts: posts });
	} catch (error) {
		res.status(500).json({ error: "Internal server error skibidi" });
	}
});

postRouter.get("/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const post = await getPostById(id);
		if (post) {
			res.json(post);
		} else {
			res.status(404).json({ error: "Post not found" });
		}
	} catch (error) {
		res.status(500).json({ error: "Internal server error sigma" });
	}
});

postRouter.post("/", isAuth, async (req, res) => {
	try {
		const post_body = req.body;
		const user = req.context?.user;
		const post = await createPost({ id_user: user.id as string, ...post_body });
		res.json({ post: post });
	} catch (error) {}
});

// postRouter.post('/id/comment', async (req, res) => { | crear comentario
