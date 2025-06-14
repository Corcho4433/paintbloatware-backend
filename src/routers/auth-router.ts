import express from "express";
import {
	createPassword,
	deleteLastSession,
	generateUserSession,
	verifyRefreshToken,
	verifyUser,
} from "../services/auth-service";
import { createUser } from "../services/user-service";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
	try {
		const { body } = req;
		const { name, email, password } = body;
		const password_hash = await createPassword(password);
		const user = await createUser(email, name, password_hash);
		if (!user) throw new Error("No se creo el usuario :3");
		res.status(201).json({ data: user.id });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: (error as Error).message });
	}
});

authRouter.post("/login", async (req, res) => {
	try {
		const { body } = req;
		const { email, password } = body;
		const user = await verifyUser(email, password);
		const { session_token, refresh_token } = await generateUserSession(user.id);
		res.status(200).json({ data: { session_token, refresh_token } }); // TODO: Devolver en cookies
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: (error as Error).message });
	}
});

authRouter.post("/refresh", async (req, res) => {
	try {
		const { body } = req;
		const { refresh_token } = body;

		const user = await verifyRefreshToken(refresh_token);
		if (!user) throw new Error("No se pudo verificar el refresh token :c");

		const { session_token, refresh_token: new_refresh_token } = await generateUserSession(user.id);

		await deleteLastSession(user.id, refresh_token);

		res.status(200).json({ data: { session_token, refresh_token: new_refresh_token } }); // TODO: Devolver en cookies
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: (error as Error).message });
	}
});

