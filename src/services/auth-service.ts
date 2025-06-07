import { sign } from "jsonwebtoken";
import { db } from "../db/db";
import { getUserByEmail } from "./user-service";

export const verifyUser = async (email: string, password: string) => {
	const user = await getUserByEmail(email);

	console.log("user by email: ", user);

	const is_match = await Bun.password.verify(password, user.password);
	if (!is_match) {
		throw new Error("La contraseña no coincide aprende a escribir :v");
	}

	console.log("match: ", is_match);

	return user;
};

export const createPassword = async (password: string) => {
	const password_hash = await Bun.password.hash(password);
	return password_hash;
};

// Hay que revisar esto
export const getUserByAccessToken = async (
	session_token: string
) => {
	const user = db.user.findFirst({
		where: {
			sessions: {
				some: { session_token, id_user: user_id },
			},
		},
	});
	if (!user) {
		throw new Error(`No hay un usuario con el tokend ${session_token}`);
	}
	return user;
};

const generateAccessToken = (user_id: string) => {
	try {
		const token = sign({ user_id }, process.env.SECRET_KEY, { expiresIn: "15m" });
		return token;
	} catch (error) {
		throw new Error("Error al generar el token :c");
	}
};

const generateRefreshToken = async (user_id: string) => {
	try {
		const refresh_token = sign({ user_id }, process.env.SECRET_KEY_REFRESH, { expiresIn: "30d" });
		await db.session.create({
			data: { id_user: user_id, refresh_token },
		});
		return refresh_token;
	} catch (error) {
		throw new Error("Error al generar el refresh token :c");
	}
};

export const generateUserSession = async (id_user: string) => {

	try {
		const session_token = generateAccessToken(id_user);
		const refresh_token = await generateRefreshToken(id_user);
		return { session_token, refresh_token };
	} catch (error) {
		throw new Error("Error al crear la sesion :c");
	}
};