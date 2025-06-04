import type { Request, Response, NextFunction } from "express";
import { getUserBySessionTokenAndId } from "../services/auth-service";
import { verify, type JwtPayload } from "jsonwebtoken";

export const isAuth = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const session_token = req.headers.authorization; // header 'Authorization' de la request del cliente
	console.log(session_token);

	if (!session_token) {
		res.status(401).json({ message: "No estas autenticado :c" });
		return;
	}

	let payload: JwtPayload;
	try {
		payload = verify(session_token, process.env.SECRET_KEY) as JwtPayload;

		if (!payload.user_id) {
			res.status(401).json({ message: "NO hay user_id en el token :c" });
			return;
		}
	} catch (error) {
		res.status(401).json({ message: "Token invalido :c" });
		return;
	}

	try {
		const user = await getUserBySessionTokenAndId(
			session_token,
			payload.user_id,
		);
		req.context = { user: user };
	} catch (error) {
		res.status(401).json({ message: "Token invalido :c" });
		return;
	}

	next();
};
