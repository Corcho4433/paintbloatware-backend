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
	const pageSize = 12;
	
	const [posts, totalCount] = await Promise.all([
		db.post.findMany({
			skip: (page - 1) * pageSize,
			take: pageSize,
			select: {
				id: true,
				url_bucket: true,
				content: true,
				description: true,
				created_at: true,
				edited: true,
				user: {
					select: {
						name: true,
						id: true,
					},
				},
				_count: {
					select: {
						comments: true,
						ratings: true
					},
				},
				TagsForPost: {
					select: {
						tag: {
							select: {
								id: true,
								name: true
							}
						}
					}
				}
			},
		}),
		db.post.count()
	]);

	// Get rating sums for all posts in parallel
	const postsWithRatings = await Promise.all(
		posts.map(async (post) => {
			const ratingResult = await db.ratings.aggregate({
				where: {
					id_post: post.id,
				},
				_sum: {
					value: true,
				},
			});

			return {
				...post,
				rating: ratingResult._sum.value || 0
			};
		})
	);

	const maxPages = Math.ceil(totalCount / pageSize);

	return {
		posts: postsWithRatings,
		maxPages,
		currentPage: page,
		totalCount
	};
};

export const getPostsByUser = async ({ userID, page }: { userID: string; page: number }) => {
	const pageSize = 12;

	const [posts, totalCount] = await Promise.all([
		db.post.findMany({
			where: {
				id_user: userID,
			},
			skip: (page - 1) * pageSize,
			take: pageSize,
			select: {
				id: true,
				url_bucket: true,
				content: true,
				description: true,
				edited: true,
				created_at: true,
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
				TagsForPost: {
					select: {
						tag: {
							select: {
								id: true,
								name: true
							}
						}
					}
				},
			},
		}),
		db.post.count({
			where: {
				id_user: userID,
			}
		})
	]);

	// Get rating sums for all posts in parallel
	const postsWithRatings = await Promise.all(
		posts.map(async (post) => {
			const ratingResult = await db.ratings.aggregate({
				where: {
					id_post: post.id,
				},
				_sum: {
					value: true,
				},
			});

			return {
				...post,
				rating: ratingResult._sum.value || 0
			};
		})
	);

	const maxPages = Math.ceil(totalCount / pageSize);

	return {
		posts: postsWithRatings,
		maxPages,
		currentPage: page,
		totalCount
	};
};

export const getPostById = async (PostID: string) => {
	const [post, ratingResult] = await Promise.all([
		db.post.findFirst({
			select: {
				id: true,
				content: true,
				url_bucket: true,
				created_at: true,
				description: true,
				edited: true,
				TagsForPost: {
					select: {
						tag: {
							select: {
								id: true,
								name: true
							}
						}
					}
				},
				user: {
					select: {
						name: true,
						urlPfp: true,
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
		}),
		db.ratings.aggregate({
			where: {
				id_post: PostID,
			},
			_sum: {
				value: true,
			},
		})
	]);

	if (!post) {
		return null;
	}

	return {
		...post,
		rating: ratingResult._sum.value || 0
	};
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


	if (!postResult) {
		throw new Error("Failed to create post");
	}

	if (tags && tags.length > 0) {
		await db.tagsForPost.createMany({
			data: tags.map((tag) => ({
				id_post: postResult.id,
				id_tag: tag,
			})),
		});
	}

	return postResult;
};

export const getPostRatingInteractions = async (post_id: string) => {
	return await db.ratings.count({
		where: {
			id_post: post_id,
		}
	})
}

export const getPostRating = async (post_id: string) => {
	const posts = await db.ratings.findMany({
		where: {
			id_post: post_id,
		}
	})

	let total_like_count: number = 0;
	posts.forEach((rating) => {
		total_like_count += rating.value;
	})

	return total_like_count;
}