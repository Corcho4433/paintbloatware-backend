import type { Request, Response, NextFunction } from "express";
import { verify, type JwtPayload, TokenExpiredError } from "jsonwebtoken";

export const isAuthMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const auth_header = req.headers.authorization; // header 'Authorization' de la request del cliente
	
	const access_token = auth_header?.split(" ")[1];

	if (!access_token) {
		res.status(401).json({ message: "No estas autenticado :c" });
		return;
	}

	let payload: JwtPayload;
	try {
		payload = verify(access_token, process.env.SECRET_KEY) as JwtPayload;

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
		req.context = { user: { id: payload.user_id } };
	} catch (error) {
		res.status(401).json({ message: "Token invalido :c" });
		return;
	}

	next();
};
