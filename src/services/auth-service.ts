import { sign, TokenExpiredError, verify, type JwtPayload } from "jsonwebtoken";
import { db } from "../db/db";
import { getUserByEmail } from "./user-service";



export const verifyUser = async (email: string, password: string) => {
	const user = await getUserByEmail(email);

	if (!user.password) {
		throw new Error("Usuario no tiene contraseña configurada");
	}

	const is_match = await Bun.password.verify(password, user.password);
	if (!is_match) {
		return; //throw new Error("La contraseña no coincide aprende a escribir :v");
	}

	return user;
};

export const createPassword = async (password: string) => {
	const password_hash = await Bun.password.hash(password);
	return password_hash;
};

const generateAccessToken = (user_id: string) => {
	try {
		const token = sign({ user_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
		return token;
	} catch (error) {
		console.log("Error generating access token:", error)
		throw new Error("Error al generar el token :c");
	}
};

const generateRefreshToken = async (user_id: string) => {
	try {
		const refresh_token_raw = sign({ user_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
		
		const refresh_token_hashed = await Bun.password.hash(refresh_token_raw);

		await db.session.create({
			data: { id_user: user_id, refresh_token: refresh_token_hashed },
		});

		return refresh_token_raw;
	} catch (error) {
		console.log("Error generating refresh token:", error)
		throw new Error("Error al generar el refresh token :c");
	}
};

export const generateUserSession = async (id_user: string) => {
	try {
		const session_token = generateAccessToken(id_user);
		const refresh_token = await generateRefreshToken(id_user);
		return { session_token, refresh_token };
	} catch (error) {
		console.log(error)
		throw new Error("Error al crear la sesion :c");
	}
};

export const deleteLastSession = async (id_user: string, refresh_token: string) => {
	try {
		const refresh_token_hashed = await Bun.password.hash(refresh_token);
		await db.session.deleteMany({
			where: {
				id_user,
				refresh_token: refresh_token_hashed,
			},
		});
	} catch (error) {
		throw new Error("Error al borrar la sesión :c");
	}
};

export const verifyRefreshToken = async (refresh_token: string) => {
	try {
		let payload: JwtPayload;
		const refresh_token_hashed = await Bun.password.hash(refresh_token);
		try {
			payload = verify(refresh_token, process.env.REFRESH_TOKEN_SECRET) as JwtPayload; 
	
			if (!payload.user_id) {
				throw new Error("NO hay user_id en el token :c");
			}
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new Error("Token expirado :c");
			}
		
			throw new Error("Token invalido :c");
		}

		const user = await db.user.findFirst({
			where: {
				id: payload.user_id,
				sessions: {
					some: { 
						refresh_token: refresh_token_hashed
					},
				}
			},
		});

		if (!user) {
			throw new Error("Usuario no encontrado o sesión inválida");
		}

		return user;
	} catch (error) {
		console.log("Error in verifyRefreshToken:", error);
		throw new Error((error as Error).message);
	}
};

export const verifySessionToken = async (session_token: string) => {
	try {
		if (!process.env.ACCESS_TOKEN_SECRET) {
			throw new Error("ACCESS_TOKEN_SECRET no está configurado");
		}

		const payload = verify(session_token, process.env.ACCESS_TOKEN_SECRET) as JwtPayload;
		
		if (!payload.user_id) {
			throw new Error("NO hay user_id en el token");
		}

		// Verify the user still exists
		const user = await db.user.findUnique({
			where: { id: payload.user_id }
		});

		if (!user) {
			throw new Error("Usuario no encontrado");
		}

		return user;
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			throw new Error("Token expirado");
		}
		console.log("Error in verifySessionToken:", error);
		throw new Error((error as Error).message);
	}
};