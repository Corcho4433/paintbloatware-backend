import express from "express";
import {
	createPassword,
	deleteLastSession,
	generateUserSession,
	verifyAdminUser,
	verifyRefreshToken,
	verifyUser,
} from "../services/auth-service";
import { createLocalUser, getUserById } from "../services/user-service";
import {
	AuthError,
	BadRequest,
	ValidationError,
} from "../errors/server_errors";
import type { UserBody } from "../services/user-service";
import { isAuthMiddleware, type UserFromToken } from "../middleware/authMiddleware";
import { getSubscriptionByUserId } from "../services/subscription-service";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res, next) => {
	try {
		const { body } = req;
		const { name, email, password } = body;

		// Validar que todos los campos estén completos
		if (!name || !email || !password) {
			throw new ValidationError("Se requieren nombre, email y contraseña");
		}

		// Validar que la contraseña tenga al menos 8 caracteres
		if (password.length < 8) {
			throw new ValidationError("La contraseña debe tener al menos 8 caracteres");
		}

		const password_hash = await createPassword(password);
		const user: UserBody = { email, name, password_hash };
		const createdUser = await createLocalUser(user);

		if (!createdUser) {
			throw new AuthError();
		}
		const { session_token, refresh_token } = await generateUserSession(createdUser.id);
		res
			.cookie("session_token", session_token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60,
			})
			.cookie("refresh_token", refresh_token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60 * 24 * 7,
			})
			.status(201)
			.json({ success: true });

	} catch (error) {
		next(error);
	}
});

authRouter.post("/login", async (req, res, next) => {
	try {
		const { body } = req;
		const { email, password } = body;
		if (!email || !password) {
			throw new ValidationError("Se requieren email y contraseña");
		}

		const createdUser = await verifyUser(email, password);
		if (!createdUser) {
			throw new AuthError();
		}

		const { session_token, refresh_token } = await generateUserSession(createdUser.id);
		res
			.cookie("session_token", session_token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60, // 1 hora
			})
			.cookie("refresh_token", refresh_token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
			})
			.status(200)
			.json({ success: true });
	} catch (error) {
		next(error);
	}
});

authRouter.post("/logout", isAuthMiddleware, async (req, res, next) => {
	try {
		const user = req.user as UserFromToken;
		const { refresh_token } = req.cookies;
		if (!refresh_token) {
			throw new BadRequest("No hay refresh token");
		}

		await deleteLastSession(user.id, refresh_token);
		res
			.clearCookie("session_token")
			.clearCookie("refresh_token")
			.status(200)
			.json({ success: true });
	} catch (error) {
		next(error);
	}
});

authRouter.post("/refresh", async (req, res, next) => {
	try {
		const refresh_token = req.cookies.refresh_token;

		if (!refresh_token) {
			throw new ValidationError("Necesitas un refresh token bro");
		}
		
		console.log("Refresh token received:", refresh_token);
		
		const user = await verifyRefreshToken(refresh_token);
		if (!user) {
			throw new AuthError("Token de refresh inválido");
		}

		console.log("User verified:", user.id);

		const { session_token, refresh_token: new_refresh_token } =
			await generateUserSession(user.id);

		await deleteLastSession(user.id, refresh_token);

		console.log("New tokens generated successfully");

		res
			.cookie("session_token", session_token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60, // 1 hora
			})
			.cookie("refresh_token", new_refresh_token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
			})
			.status(200)
			.json({ success: true });
	} catch (error) {
		console.log("Error in refresh endpoint:", error);
		next(error);
	}
});

authRouter.get("/me", isAuthMiddleware, async (req, res, next) => {
	try {
		// `req.user` viene del middleware isAuthMiddleware
		const user = req.user as UserFromToken;

		if (!user?.id) {
			throw new ValidationError("Usuario no autenticado");
		}

		// Buscar datos del usuario en DB
		const dbUser = await getUserById(user.id);
		if (!dbUser){
			throw Error("No estas logeado")
		}
		const isAdmin = await verifyAdminUser(user.id);
		const hasNitro = await getSubscriptionByUserId(user.id);

		
		res.status(200).json({
			data: {
				id: dbUser.id,
				pfp: dbUser.urlPfp,
				admin: !!isAdmin,
				nitro: !!hasNitro && hasNitro.status === "ACTIVE", // opcional: solo si está activa
			},
			success: true,
		});
	} catch (error) {
		next(error);
	}
});