import express from "express";
import { createComment, getCommentById, getCommentsByPost } from "../services/comment-service";
import { isAuthMiddleware } from "../middleware/authMiddleware";
import { BadRequest, NotFound, Unauthorized } from "../errors/server_errors";

export const commentRouter = express.Router();

commentRouter.get("/:post", async (req, res, next) => {
	try {
		const page = Number.parseInt(req.query.page as string) || 1;
		const id_post = req.params.post;
		const comments = await getCommentsByPost(id_post, { page });

		res.status(200).json({ 
			comments: comments,
			maxPages: comments.maxPages,
			currentPage: comments.currentPage,
			totalCount: comments.totalCount
		});
	} catch (error) {
		next(error)
	}
});

commentRouter.post("/:post", isAuthMiddleware ,async (req, res, next) => {
	try {
		const id_post = req.params.post;
		const user = req.body.user;
		const content = req.body.content;

		if (!content ){
			throw new NotFound();
		}

		if (!id_post) {
			throw new BadRequest("No se encuentra ese post")
		}

		const comment = await createComment({id_user: user, id_post,content})
		res.status(200).json({new_comment: comment})
	} catch (error) {
		next(error)
	}
});

commentRouter.get("/:id", async (req, res, next) => {
	try {
		const id = req.params.id;
		const comment = await getCommentById(id);

		if (!comment) {
			throw new BadRequest("Comment doesnt exist")
		}

		res.status(200).json(comment);
	} catch (error) {
		next(error)
	}
});
