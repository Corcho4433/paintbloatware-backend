import { db } from "../db/db";
import { ValidationError } from "../errors/server_errors";


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

export const getAdmin = async (UserID: string) => {
  return await db.admin.findFirst({
    where: {
      userId: UserID
    }
  })
};

export const deleteUserById = async (UserID: string) => {
	return await db.user.delete({
		where: {
			id: UserID
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
    accounts: {
      select: {
        provider: true,
        type: true
      }
    }
  }
})
}

export const updatePersonalInfo = async (userId: string, userData: UserUpdateInterface) => {
  // Verificar si el usuario tiene cuentas OAuth (Google, GitHub, etc.)
  const oauthAccount = await db.account.findFirst({
    where: {
      userId: userId,
      type: "oauth"
    }
  });


  // Si tiene cuenta OAuth y está intentando cambiar el email, no permitirlo
  

  // Filtrar campos undefined
  const entries = oauthAccount && userData.email
	? Object.entries(userData).filter(([key, value]) => key !== 'email' && value !== undefined) // No actualizar email si tiene OAuth
	: Object.entries(userData).filter(([_, value]) => value !== undefined);

  const dataToUpdate = Object.fromEntries(entries);


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
		throw new ValidationError("No hay usuario con el email/nombre dado");
	}
	return user;
};

export const createLocalUser = async (userBody: UserBody) => {
	try {
		const user = await db.user.create({
			data: { email: userBody.email, name: userBody.name, password: userBody.password_hash },
		});
		return user;
	} catch (error) {
		console.log(error)
		throw new ValidationError("Email ya registrado");
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