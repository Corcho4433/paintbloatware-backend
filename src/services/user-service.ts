import { db } from "../db/db";


export interface UserBody {
	email: string
	name: string
	password_hash: string
}

export interface UserUpdateInterface {
	email?: string
	name?: string
	description?: string
}

export const getUsers = async () => {
	return await db.user.findMany();
};

export const getUserById = async (UserID: string) => {
	return await db.user.findFirst({
		where: {
			id: UserID,
		},
		select: {
			id: true,
			name: true,
			urlPfp: true,
			description: true
		}
	});
};

export const getUserPersonalInfoByID = async (UserID: string) => {
	return await db.user.findFirst({
		where: {
			id: UserID,
		},
		select: {
			id: true,
			name: true,
			urlPfp: true,
			description: true,
			email: true,
		}
	})
}

export const updatePersonalInfo = async (userId: string, userData: UserUpdateInterface) => {
  // Filtrar campos undefined
  const dataToUpdate = Object.fromEntries(
    Object.entries(userData).filter(([_, value]) => value !== undefined)
  );

  return await db.user.update({
    where: { id: userId },
    data: dataToUpdate,
    select: {
      id: true,
      name: true,
      email: true,
      description: true,
      urlPfp: true
    }
  });
};

export const changePassword = async (userID: string, newPasswordHash: string) => {

	return await db.user.update({
		where: {id: userID},
		data: {
			password: newPasswordHash
		}
	})
}

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

export const createLocalUser = async (userBody: UserBody) => {
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


export const createOAuthUser = async (email: string, name: string) => {
	try {
		return db.user.create({
			data: {
				email: email,
				name: name,

			}
		})
	} catch (error) {
		console.log(error)
		throw new Error("Error al crear el usuario")
	}



}