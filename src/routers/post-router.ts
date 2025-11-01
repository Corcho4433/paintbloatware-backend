import express from "express";
import {
	createPost,
	getPostById,
	getPosts,
	getPostsByUser,
	getPostsByTag,
	deletePost,
	getPostsRandomized,
} from "../services/post-service";
import { createComment } from "../services/comment-service";
import { isAuthMiddleware, optionalAuthMiddleware, type UserFromToken } from "../middleware/authMiddleware";
import { BadRequest, NotFound } from "../errors/server_errors";
import { createRating, getRatingsByPost } from "../services/rating-service";
import type { PostBody } from "../services/post-service";
export const postRouter = express.Router();

postRouter.get("/", optionalAuthMiddleware, async (req, res, next) => {
	try {
		const page = Number.parseInt(req.query.page as string) || 1;
		const user = req.user as UserFromToken | undefined;
		const userId = user?.id;
		
		const result = await getPosts({ page, userId });

		res.status(200).json({ 
			posts: result.posts,
			maxPages: result.maxPages,
			currentPage: result.currentPage,
			totalCount: result.totalCount
		});
	} catch (error) {
		next(error);
	}
});

postRouter.get("/feed", isAuthMiddleware, async (req, res, next) => {
	try {
		const page = Number.parseInt(req.query.page as string) || 1;
		const user = req.user as UserFromToken;
		console.log("User in feed route:", user);
		const result = await getPostsRandomized({ userId: user.id, page });
		res.status(200).json({
			posts: result.posts,
			maxPages: result.maxPages,
			currentPage: result.currentPage,
			totalCount: result.totalCount
		});
	} catch (error) {
		next(error);
	}
});

postRouter.get("/user/:id", optionalAuthMiddleware, async (req, res, next) => {
	try {
		const id_user = req.params.id;
		const page = Number.parseInt(req.query.page as string) || 1;
		const loggedUserId = req.user as UserFromToken | undefined;
		if (!id_user) {
			throw new BadRequest("Debes enviar un id de usuario");
		}
		const posts = await getPostsByUser({ userID: id_user, page, loggedUserId: loggedUserId?.id });
		if (!posts) {
			throw new BadRequest("Ese usuario no tiene posts");
		}

		res.status(200).json({ maxPages: posts.maxPages, currentPage: posts.currentPage, posts: posts.posts, totalCount: posts.totalCount });
	} catch (error) {
		next(error);
	}
});

postRouter.get("/tag/:tag", async (req, res, next) => {
	try {
		const tagName = req.params.tag;
		const page = Number.parseInt(req.query.page as string) || 1;
		
		const result = await getPostsByTag(tagName, { page });
		console.log(result);
		if (!result.posts || result.posts.length === 0) {
			return res.status(200).json({ 
				posts: [],
				maxPages: 0,
				currentPage: page,
				totalCount: 0,
				message: `No se encontraron posts con la tag "${tagName}"`
			});
		}

		res.status(200).json({
			posts: result.posts,
			maxPages: result.pagination.totalPages,
			currentPage: result.pagination.currentPage,
			totalCount: result.pagination.totalCount
		});
	} catch (error) {
		next(error);
	}
});

postRouter.get("/:id",optionalAuthMiddleware, async (req, res, next) => {
	try {
		const id = req.params.id;
		const userId = (req.user as UserFromToken | undefined)?.id;
		if (!id) {
			throw new BadRequest("Debes enviar un id de post");
		}
		const post = await getPostById({PostID: id, userId: userId});

		if (!post) {
			throw new BadRequest("Ese post no existe");
		}

		res.status(200).json({ post: post });
	} catch (error) {
		next(error);
	}
});

postRouter.post("/", isAuthMiddleware, async (req, res, next) => {
	try {
		const post_body = req.body;
		const user = req.user as UserFromToken;

		if (!user || !user.id) {
			throw new BadRequest("No tienes permisos para crear un post");
		}

		const requiredFields: (keyof PostBody)[] = [
			"source",
			"image",
			"description",
			"tags",
		];

		for (const field of requiredFields) {
			if (post_body[field] === undefined || post_body[field] === null) {
				throw new BadRequest(`Falta el campo obligatorio: ${field}`);
			}
		}

		const post = await createPost({ id_user: user.id, ...post_body });

		if (!post) {
			throw new BadRequest("No se pudo crear el post");
		}

		res.status(200).json({ post: post });
	} catch (error) {
		next(error);
	}
});

postRouter.delete("/:id", isAuthMiddleware, async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id) {
			throw new BadRequest("Debes enviar un post id");
		}

		const user = req.user as UserFromToken;

		const post = await deletePost(id, user.id);

		if (!post) {
			throw new BadRequest("No se pudo eliminar el post");
		}

		res.status(200).json({ post: post });
	} catch (error) {
		next(error);
	}
});

postRouter.post("/:id/comment", isAuthMiddleware, async (req, res, next) => {
	try {
		const comment_body = req.body;
		const user = req.user as UserFromToken;

		const comment = await createComment({
			id_user: user.id,
			...comment_body,
		});

		res.status(200).json({ comment: comment });
	} catch (error) {
		next(error);
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
		next(error);
	}
});

postRouter.post("/:id/ratings", isAuthMiddleware, async (req, res, next) => {
	try {
		if (!req.params.id) {
			throw new BadRequest("Debes enviar un valor");
		}

		const id = req.params.id;
		const value = req.body.value;
		const user = req.user as UserFromToken;

		const rating = await createRating(id, user.id, value);

		if (!rating) {
			throw new BadRequest("No se pudo crear el rating");
		}

		res.status(200).json({ rating: rating });
	} catch (error) {
		next(error);
	}
});
