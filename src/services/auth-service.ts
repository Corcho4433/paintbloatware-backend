import { randomUUID } from "node:crypto";
import { db } from "../db/db";
import { getUserByEmail } from "./user-service";

export const verifyUser = async (email: string, password: string) => {
	const user = await getUserByEmail(email);
	const is_match = await Bun.password.verify(password, user.password);
	if (!is_match) {
		throw new Error("La contraseña no coincide aprende a escribir :v");
	}
	return user;
};

const generateSessionToken = () => {
	return randomUUID();
};

export const getUserBySessionToken = async (session_token: string) => {
	const user = db.user.findFirst({
		where: {
			sessions: {
				some: { session_token },
			},
		},
	});
	if (!user) {
		throw new Error(`No hay un usuario con el token ${session_token}`);
	}
	return user;
};

export const generateUserSession = async (id_user: string) => {
	const session_token = generateSessionToken();
	try {
		await db.session.create({
			data: { id_user, session_token },
		});
		return session_token;
	} catch (error) {
		throw new Error("Error al crear la sesion :c");
	}
};

export const createPassword = async (password: string) => {
	const password_hash = await Bun.password.hash(password);
	return password_hash;
};
