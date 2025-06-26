import express from "express";
import {
	createPost,
	getPostById,
	getPosts,
	getPostsByUser,
} from "../services/post-service";
import { createComment } from "../services/comment-service";
import { isAuthMiddleware, type UserFromToken } from "../middleware/authMiddleware";

export const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
	try {
		const page = Number.parseInt(req.query.page as string) || 1;

		const posts = await getPosts({ page });
		res.json({ posts: posts });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error skibidi" });
	}
});

postRouter.get("/user/:id", async (req, res) => {
	try {
		const id_user = req.params.id;
		const posts = await getPostsByUser(id_user);
		res.json({ posts: posts });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error :c" });
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
		console.error(error);
		res.status(500).json({ error: "Internal server error :c" });
	}
});

postRouter.post("/", isAuthMiddleware, async (req, res) => {
	try {
		const post_body = req.body;
		const user = req.user!;
		console.log(user)
		const post = await createPost({ id_user: user.id, ...post_body });
		res.json({ post: post });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "No se pudo crear el post :c " });
	}
});

postRouter.post("/:id/comment", isAuthMiddleware, async (req, res) => {
	try {
		const comment_body = req.body;
		const user = req.user as UserFromToken;
		const comment = await createComment({
			id_user: user.id,
			...comment_body,
		});
		res.json({ comment: comment });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "No se pudo crear el comentario :c" });
	}
});
