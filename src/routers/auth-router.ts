import express from "express";
import {
	createPassword,
	deleteLastSession,
	generateUserSession,
	verifyRefreshToken,
	verifyUser,
} from "../services/auth-service";
import { createUser } from "../services/user-service";
import { AuthError, BadRequest, ValidationError } from "../errors/server_errors";
import { type UserBody } from "../services/user-service";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res, next) => {
	try {
        const { body } = req;
		const { name, email, password } = body;
		const password_hash = await createPassword(password);
		const user : UserBody = { email, name, password_hash };
		const createdUser = await createUser(user);

		if (!createdUser) {
            throw new AuthError()
        }

		res.status(201).json({ data: createdUser.id });
	} catch (error) {
		next(error);
	}
});

authRouter.post("/login", async (req, res, next) => {
	try {
		const { body } = req;
		const { email, password } = body;
        if (!email || !password) {
            throw new ValidationError("Se requieren email y contraseña")
        }

		const user = await verifyUser(email, password);
        if (!user) {
            throw new AuthError();
        }

		const { session_token, refresh_token } = await generateUserSession(user.id);
		res.status(200).json({ data: { session_token, refresh_token } }); // TODO: Devolver en cookies
	} catch (error) {
		next(error)
	}
});

authRouter.post("/refresh", async (req, res, next) => {
	try {
		const { body } = req;
		const { refresh_token } = body;

        if (!refresh_token) {
            throw new ValidationError("Necesitas un refresh token bro")
        }

		const user = await verifyRefreshToken(refresh_token);
		if (!user) {
            throw new AuthError()
        };

		const { session_token, refresh_token: new_refresh_token } = await generateUserSession(user.id);

		await deleteLastSession(user.id, refresh_token);

		res.status(200).json({ data: { session_token, refresh_token: new_refresh_token } }); // TODO: Devolver en cookies
	} catch (error) {
		next(error)
	}
});

