import { db } from "../db/db";


export interface UserBody {
	email: string
	name: string
	password_hash: string
}
export const getUsers = async () => {
	return await db.user.findMany();
};

export const getUserById = async (UserID: string) => {
	return await db.user.findFirst({
		where: {
			id: UserID,
		},
	});
};

export const getUserByEmail = async (email: string) => {
	const user = await db.user.findFirst({
		where: {
			email: email,
		},
	});
	if (!user) {
		throw new Error("No hay usuario con el email/nombre dado :3");
	}
	return user;
};

export const createUser = async (userBody: UserBody) => {
	try {
		userBody.email
		const user = await db.user.create({
			data: { email: userBody.email, name: userBody.name, password: userBody.password_hash },
		});
		return user;
	} catch (error) {
		console.log(error)
		throw new Error("Error al crear el usuario :c");
	}
};
