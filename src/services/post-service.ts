import type { Post } from "@prisma/client";
import { db } from "../db/db";

export interface PostBody {
	source: string;
	image: string;
	description: string;
	tags: string[];
	id_user: string;
}

export const getPosts = async ({ page }: { page: number }) => {
	const pageSize = 10;
	
	const [posts, totalCount] = await Promise.all([
		db.post.findMany({
			skip: (page - 1) * pageSize,
			take: pageSize,
			select: {
				id: true,
				url_bucket: true,
				content: true,
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
		}),
		db.post.count()
	]);

	const maxPages = Math.ceil(totalCount / pageSize);

	return {
		posts,
		maxPages,
		currentPage: page,
		totalCount
	};
};

export const getPostsByUser = async ({ userID, page }: { userID: string; page: number }) => {
	return await db.post.findMany({
		where: {
			id_user: userID,
		},
		skip: (page - 1) * 10,
		take: 10,
		select: {
			id: true,
			url_bucket: true,
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

export const getPostById = async (PostID: string) => {
	return await db.post.findFirst({
		select: {
			id: true,
			content: true,
			url_bucket: true,
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


export const createPost = async (post: PostBody) => {
	const { tags } = post;
	console.log("post: ", post);

	console.log("tags: ", tags);
	const postResult = await db.post.create({
		data: {
			description: post.description,
			content: post.source,
			id_user: post.id_user,
			url_bucket: post.image,
		},
	});

	console.log("ohio post:", postResult);

	if (!postResult) {
		throw new Error("Failed to create post");
	}
	
	// Create tag relationships if tags exist
	if (tags && tags.length > 0) {
		await db.tagsForPost.createMany({
			data: tags.map((tag) => ({
				id_post: postResult.id,
				id_tag: tag,
			})),
		});
	}

	// Return the created post
	return postResult;
};
