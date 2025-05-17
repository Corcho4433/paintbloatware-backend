import type { Post } from "@prisma/client";
import { db } from "../db/db";

export const getPosts = async () => {
	return await db.post.findMany({
		include: {
			user: {
				select: {
					name: true,
					id: true,
				},
			},
			_count: {
				select: {
					comments: true,
				},
			},
		},
	});
};

export const getPostsByUser = async (userID: string) => {
	return await db.post.findMany({
		where: {
			id_user: userID,
		},
	});
};

export const getPostById = async (PostID: string) => {
	return await db.post.findFirst({
		include: {
			user: {
				select: {
					name: true,
					id: true,
				},
			},
			comments: {
				include: {
					user: {
						select: {
							name: true,
							id: true,
						},
					},
				},
			},
		},
		where: {
			id: PostID,
		},
	});
};

export const createPost = async (post: Post) => {
	return await db.post.create({
		data: post,
	});
};
