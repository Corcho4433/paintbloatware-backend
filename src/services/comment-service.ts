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

export const getCommentsByPost = async (postID: string) => {
	return await db.comment.findMany({
		where: {
			id_post: postID,
		},
	});
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
	});
};
