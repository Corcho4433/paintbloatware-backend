import type { Request, Response, NextFunction } from "express";
import { verify, type JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { verifySessionToken } from "../services/auth-service";

export interface UserFromToken {
	id: string;
}

export const isAuthMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const auth_header = req.headers.authorization; // header 'Authorization' de la request del cliente
	const access_token_from_header = auth_header?.split(" ")[1];
	const access_token = req.cookies?.session_token; // 🍪 Token desde cookies

	// Priorizar token del header, pero usar cookie como fallback
	const session_token = access_token_from_header || access_token;

	if (!session_token) {
		console.log("No session token found", {
			header: access_token_from_header,
			cookie: access_token,
			cookies: req.cookies
		});
		res.status(401).json({ 
			message: "No estas autenticado :c",
			debug: {
				token: session_token,
				cookies: req.cookies
			}
		});
		return;
	}

	try {
		const user = await verifySessionToken(session_token);
		req.user = { id: user.id };
		next();
	} catch (error) {
		console.log("Auth middleware error:", error);
		
		if ((error as Error).message.includes("expirado")) {
			res.status(401).json({ message: "Session expired, please log in again" });
		} else {
			res.status(401).json({ message: "Token invalido :c" });
		}
		return;
	}
};

export const optionalAuthMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const auth_header = req.headers.authorization;
	const access_token_from_header = auth_header?.split(" ")[1];
	const access_token = req.cookies?.session_token;

	const session_token = access_token_from_header || access_token;

	if (!session_token) {
		// Si no hay token, continúa sin usuario
		req.user = undefined;
		next();
		return;
	}

	try {
		const user = await verifySessionToken(session_token);
		req.user = { id: user.id };
		next();
	} catch (error) {
		// Si el token es inválido, continúa sin usuario (no lanza error)
		console.log("Optional auth middleware: invalid token, continuing without user");
		req.user = undefined;
		next();
	}
};
