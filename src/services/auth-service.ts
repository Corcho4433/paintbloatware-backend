import { sign, TokenExpiredError, verify, type JwtPayload } from "jsonwebtoken";
import { db } from "../db/db";
import { getUserByEmail } from "./user-service";



export const verifyUser = async (email: string, password: string) => {
	const user = await getUserByEmail(email);

	console.log("user by email: ", user);

	const is_match = await Bun.password.verify(password, user.password);
	if (!is_match) {
		return; //throw new Error("La contraseña no coincide aprende a escribir :v");
	}

	console.log("match: ", is_match);

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
		console.log(error)
		throw new Error("Error al generar el token :c");
	}
};

const generateRefreshToken = async (user_id: string) => {
	try {
		const refresh_token = sign({ user_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
		
		await db.session.create({
			data: { id_user: user_id, refresh_token },
		});

		return refresh_token;
	} catch (error) {
		console.log(error)
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
	await db.session.deleteMany({
		where: {
			id_user,
			refresh_token,
		},
	});
};

export const verifyRefreshToken = async (refresh_token: string) => {
	try {

		let payload: JwtPayload;
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
				sessions: {
					some: { refresh_token, id_user: payload.user_id },
				}
			},
		});

		return user;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};