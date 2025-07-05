import express from "express";
import { getUserById, getUsers } from "../services/user-service";
import { getCommentsByUser } from "../services/comment-service";
import { BadRequest, NotFound } from "../errors/server_errors";

export const userRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
	try {
		const users = await getUsers();
		if (!users) {
			throw new BadRequest("No se encontraron usuarios")
		}

		res.status(200).json({ users: users });
	} catch (error) {
		next(error)
	}
});

userRouter.post("/", async (req, res, next) => {
	try {
		res.status(201).send(req.body);
	} catch (error) {
		next(error)
	}
});

userRouter.get("/:id", async (req, res, next) => {
	try {
		const id = req.params.id;
		const user = await getUserById(id);
		if (!user) {
			throw new NotFound("No existe ese usuario")
		}
		res.status(200).json({ user });
	} catch (error) {
		next(error);
	}
});

userRouter.get("/:id/comments", async (req, res, next) => {
	try {
		const id = req.params.id;
		const comments = await getCommentsByUser(id);
		if (!comments) {
			throw new BadRequest("No comments found")
		}

		res.status(200).json({ comments });
	} catch (error) {
		next(error)
	}
});
