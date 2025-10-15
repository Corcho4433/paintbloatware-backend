import express from "express";
import { getUserById, getUserPersonalInfoByID, getUsers, updatePersonalInfo } from "../services/user-service";
import { getCommentsByUser } from "../services/comment-service";
import { BadRequest, NotFound } from "../errors/server_errors";
import { isAuthMiddleware } from "../middleware/authMiddleware";
import { type User } from "@prisma/client";
import { type UserUpdateInterface } from "../services/user-service";
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

userRouter.put('/info/:id', isAuthMiddleware, async (req, res, next) => {
	try {
		const user = req.user as User & { id: string };
		const id = req.params.id;
		if (!user) {
			res.status(401).json("No estas autenticada")
			return;
		}
		if (user.id !== id) {
			res.status(403).json("No tienes permiso para modificar este usuario");
			return;
		}

		const data = req.body as UserUpdateInterface;


		const response = updatePersonalInfo(user.id, data)
		res.status(200).json("Information update succesfully")
		return;
		// Continue with update logic here

	} catch (error) {
		next(error);
	}
})

userRouter.get('/info/:id', isAuthMiddleware, async (req, res, next) => {
	try {
		const user = req.user as User & { id: string };
		const id = req.params.id;
		if (!user) {
			res.status(401).json("No estas autenticada")
			return;
		}
		if (user.id !== id) {
			res.status(403).json("No tienes permiso para modificar este usuario");
			return;
		}

		const data = await getUserPersonalInfoByID(user.id);
		if (!data) {
			res.status(400).json("Failed")
			return;
		}
		console.log(data.accounts)
		res.status(200).json({
			id: data.id,
			email: data.email,
			name: data.name,
			description: data.description,
			urlPfp: data.urlPfp,
			oauth: data.accounts.length > 0
		});
		return;
		// Continue with update logic here

	} catch (error) {
		next(error);
	}
})