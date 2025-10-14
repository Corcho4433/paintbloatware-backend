import { db } from "../db/db";

interface CommentBody {
	id_user: string
	id_post: string
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
			select: {
				id: true,
				content: true,
				user: {
					select: {
						name: true,
						id: true,
						urlPfp: true
					},
				},
			},
		}),
		db.comment.count()
	]);
	
	const maxPages = Math.ceil(totalCount / pageSize);

	return {
		comments,
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