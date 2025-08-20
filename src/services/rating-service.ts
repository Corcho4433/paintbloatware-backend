import { db } from "../db/db";

export const getRatingsByUser = async (userID: string) => {
	return await db.ratings.findMany({
		where: {
			id_user: userID,
		},
	});
};

export const getRatingsByPost = async (postID: string) => {
	return await db.ratings.findMany({
		where: {
			id_post: postID,
		},
	});
};

export const createRating = async (postID: string, userID: string, value: number) => {
	return await db.ratings.create({
		data: {
			id_post: postID,
			id_user: userID,
			value: value,
		},
	});
};
