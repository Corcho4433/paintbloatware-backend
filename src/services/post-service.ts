import type { Post } from "@prisma/client";
import { db } from "../db/db";

export const getPosts = async ({ page }: { page: number }) => {
	return await db.post.findMany({
		skip: (page - 1) * 10,
		take: 10,
		select: {
			image_json: true,
			title: true,
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
		include: {
			_count: {
				select: {
					comments: true,
				},
			},
		},
	});
};

export const getPostById = async (PostID: string) => {
	return await db.post.findFirst({
		select: {
			id: true,
			title: true,
			content: true,
			image_json: true,
			user: {
				select: {
					name: true,
					id: true,
				},
			},
			comments: {
				select: {
					id: true,
					content: true,
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

interface PostBody {
	title: string;
	content: string;
	image: string;
	id_user: string;
}

export const createPost = async (post: PostBody) => {
	return await db.post.create({
		data: {
			title: post.title,
			content: post.content,
			id_user: post.id_user,
			image_json: post.image,
		},
	});
};
