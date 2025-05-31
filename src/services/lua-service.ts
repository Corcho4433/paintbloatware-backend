import type { Comment } from "@prisma/client";
import { db } from "../db/db";

export const getSourcecodeByPost = async (post_id: string) => {
	try {
		return await db.post.findFirst({
			where: {
				id: post_id,
			},
			select: {
				content: true,
			},
		});
	} catch (error) {
		console.error(error);
	}
};
