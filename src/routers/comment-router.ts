import express from "express";
import { createComment, getCommentById, getCommentsByPost } from "../services/comment-service";
import { isAuthMiddleware } from "../middleware/authMiddleware";
import { error } from "console";

export const commentRouter = express.Router();

commentRouter.get("/:post", async (req, res) => {
	try {
		const id_post = req.params.post;
		const comments = await getCommentsByPost(id_post);
		res.status(200).json({ comments: comments });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error skibidi" });
	}
});

commentRouter.post("/:post", isAuthMiddleware ,async (req, res) => {
	try {
		const id_post = req.params.post;
		const id_user = req.user!.id;
		const content = req.body.content;

		if (!content ){
			res.status(401).json({error: "Required field in body missing: [content]"})
			return;
		}
		if (!id_post) {
			res.status(400).json({error: "Required param missing: [id_post]"})
			return;
		}
		const comment = await createComment({id_user,id_post,content})
		res.status(200).json({new_comment: comment})
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error skibidi" });
	}
});

commentRouter.get("/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const comment = await getCommentById(id);
		if (comment) {
			res.json(comment);
		} else {
			res.status(404).json({ error: "Comment not found lolo" });
		}
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ error: "Internal server error sigma male rizzler niggachain" });
	}
});
