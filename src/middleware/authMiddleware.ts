import type { Request, Response, NextFunction } from "express";
import { verify, type JwtPayload, TokenExpiredError } from "jsonwebtoken";

export const isAuthMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const auth_header = req.headers.authorization; // header 'Authorization' de la request del cliente
	const access_token_from_header = auth_header?.split(" ")[1];
	const access_token_from_cookie = req.cookies?.session_token; // 🍪 Token desde cookies

	console.log("🍪 Cookies:", req.cookies);
	console.log("📋 Header Authorization:", auth_header);

	// Priorizar token del header, pero usar cookie como fallback
	const access_token = access_token_from_header || access_token_from_cookie;

	if (!access_token) {
		res.status(401).json({ 
			message: "No estas autenticado :c",
			debug: {
				headerToken: !!access_token_from_header,
				cookieToken: !!access_token_from_cookie,
				cookies: req.cookies
			}
		});
		return;
	}

	let payload: JwtPayload;
	try {
		payload = verify(
			access_token,
			process.env.ACCESS_TOKEN_SECRET,
		) as JwtPayload;

		if (!payload.user_id) {
			res.status(401).json({ message: "NO hay user_id en el token :c" });
			return;
		}
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			res.status(401).json({ message: "Token expirado :c" });
			return;
		}

		res.status(401).json({ message: "Token invalido :c" });
		return;
	}

	try {
		req.user = { id: payload.user_id };
	} catch (error) {
		res.status(401).json({ message: "Token invalido :c" });
		return;
	}

	next();
};
