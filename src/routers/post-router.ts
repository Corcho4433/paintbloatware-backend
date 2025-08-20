import express from "express";
import {
	createPost,
	getPostById,
	getPosts,
	getPostsByUser,
} from "../services/post-service";
import { createComment } from "../services/comment-service";
import { isAuthMiddleware } from "../middleware/authMiddleware";
import { BadRequest, NotFound } from "../errors/server_errors";
import { createRating, getRatingsByPost } from "../services/rating-service";

export const postRouter = express.Router();

postRouter.get("/", async (req, res, next) => {
	try {
		const page = Number.parseInt(req.query.page as string) || 1;
		const posts = await getPosts({ page });
		if (!posts) {
			throw new NotFound("No se encontraron posts para este")
		}

		res.status(200).json({ posts: posts });
	} catch (error) {
		console.log(error);

	}
});

postRouter.get("/user/:id", async (req, res, next) => {
	try {
		const id_user = req.params.id;
		const posts = await getPostsByUser(id_user);
		if (!posts) {
			throw new BadRequest("Ese usuario no tiene posts")
		}

		res.status(200).json({ posts: posts });
	} catch (error) {
		next(error)
	}
});

postRouter.get("/:id", async (req, res, next) => {
	try {
		const id = req.params.id;
		const post = await getPostById(id);

		if (!post) {
			throw new BadRequest("Ese post no existe")
		}

		res.status(200).json({ post: post });
	} catch (error) {
		next(error)
	}
});

postRouter.post("/", isAuthMiddleware, async (req, res, next) => {
	try {
		const post_body = req.body;
		const user = req.user;

		if (!user) {
			throw new BadRequest("No tienes permisos para crear un post");
		}

		const post = await createPost({ id_user: user.id, ...post_body });

		if (!post) {
			throw new BadRequest("No se pudo crear el post");
		}

		res.status(200).json({ post: post });
	} catch (error) {
		next(error)
	}
});

postRouter.post("/:id/comment", isAuthMiddleware, async (req, res, next) => {
	try {
		const comment_body = req.body;
		const user = req.user;

		const comment = await createComment({
			id_user: user.id,
			...comment_body,
		});

		res.status(200).json({ comment: comment });
	} catch (error) {
		next(error)
	}
});

postRouter.get("/:id/ratings", async (req, res, next) => {
	try {
		const id = req.params.id;
		const ratings = await getRatingsByPost(id);
		if (!ratings) {
			throw new BadRequest("No hay ratings para ese post");
		}

		res.status(200).json({ ratings: ratings });
	} catch (error) {
		next(error)
	}
});

postRouter.post("/:id/ratings", isAuthMiddleware, async (req, res, next) => {
	try {
		if (!req.params.id) {
			throw new BadRequest("Debes enviar un valor");
		}

		const id = req.params.id;
		const value = req.body.value;
		const user = req.user;

		const rating = await createRating(id, user.id, value);

		if (!rating) {
			throw new BadRequest("No se pudo crear el rating");
		}

		res.status(200).json({ rating: rating });
	} catch (error) {
		next(error)
	}
});