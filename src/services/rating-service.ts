import { db } from "../db/db";

export const getRatingsByUser = async (userID: string) => {
	return await db.ratings.findMany({
		where: {
			id_user: userID,
		},
	});
};

export const getRatingsByPost = async (postID: string) => {
	const result = await db.ratings.aggregate({
		where: {
			id_post: postID,
		},
		_sum: {
			value: true,
		},
	});

	return result._sum.value || 0;
};

export const createRating = async (postID: string, userID: string, value: number) => {
	// Buscar si ya existe un rating del usuario para este post
	const existingRating = await db.ratings.findFirst({
		where: {
			id_post: postID,
			id_user: userID,
		},
	});

	if (existingRating) {
		// Si existe, actualizar el valor
		return await db.ratings.update({
			where: {
				id: existingRating.id,
			},
			data: {
				value: value,
			},
		});
	} else {
		// Si no existe, crear uno nuevo
		return await db.ratings.create({
			data: {
				id_post: postID,
				id_user: userID,
				value: value,
			},
		});
	}
};
