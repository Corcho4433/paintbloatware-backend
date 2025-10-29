import { db } from "../db/db";

interface CommentBody {
	id_user: string
	id_post: string
	content: string
}

interface CommentThreadBody {
	id_comment: string
	id_user: string
	content: string
}

export const getCommentById = async (commentID: string) => {
	return await db.comment.findFirst({
		where: {
			id: commentID,
		},
	});
};

export const getCommentsByPost = async (postID: string, {page}: { page: number }) => {
	const pageSize = 10;

	const [comments, totalCount] = await Promise.all([
		db.comment.findMany({
			where: {
				id_post: postID,
			},
			skip: (page - 1) * pageSize,
			take: pageSize,
			orderBy: { created_at: 'desc' },
			select: {
				id: true,
				content: true,
				created_at: true,
				user: {
					select: {
						name: true,
						id: true,
						urlPfp: true
					},
				},
				_count: {
					select: { CommentThread: true }
				},
			},
		}),
		db.comment.count({
			where: {
				id_post: postID,
			}
		})
	]);

	// Flatten the _count.CommentThread property for each comment
	const commentsWithThreadCount = comments.map(comment => ({
		...comment,
		commentThreadCount: comment._count?.CommentThread ?? 0
	}));

	const maxPages = Math.ceil(totalCount / pageSize);

	return {
		comments: commentsWithThreadCount,
		maxPages,
		currentPage: page,
		totalCount
	};
};

export const getCommentsByUser = async (userID: string) => {
	return await db.comment.findMany({
		where: {
			id_user: userID,
		},
	});
};

export const createComment = async (comment: CommentBody) => {
    return await db.comment.create({
        data: {
            id_post: comment.id_post,
            id_user: comment.id_user,
            content: comment.content
        },
        select: {
            id: true,
            content: true,
            user: {
                select: {
                    name: true,
                    id: true,
                    urlPfp: true
                }
            }
        }
    });
};

export const createCommentThread = async (commentThread: CommentThreadBody) => {
	const thread = await db.commentThread.create({
		data: {
			id_user: commentThread.id_user,
			content: commentThread.content,
			id_comment: commentThread.id_comment
		},
		select: {
			id: true,
			content: true,
			created_at: true,
			id_user: true,
			id_comment: true,
			user: {
				select: {
					name: true,
					id: true,
					urlPfp: true
				}
			}
		}
	});
	return { thread };
};

export const likeComment = async (commentID: string) => {
    return await db.comment.update({
        where: {
            id: commentID
        },
        data: {
            like_count: + 1
        }
    })
}