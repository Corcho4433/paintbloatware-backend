import { db } from "../db/db";


interface CommentThreadBody {
	id_comment: string
	id_user: string
	content: string
}

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

export const getCommentThreadsByComment = async ({ id_comment, page = 1 }: { id_comment: string; page?: number }) => {
  const pageSize = 12;
  const [threads, totalCount] = await Promise.all([
    db.commentThread.findMany({
      where: { id_comment },
      include: {
        user: { select: { id: true, name: true, urlPfp:true } },
      },
      orderBy: { created_at: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.commentThread.count({ where: { id_comment } })
  ]);

  const maxPages = Math.ceil(totalCount / pageSize);
  return {
    threads,
    maxPages,
    currentPage: page,
    totalCount
  };
}

export const getCommentThreadById = async (id: string) => {
  return await db.commentThread.findFirst({
    where: { id },
    include: {
      user: { select: { id: true, name: true } },
      comment: true,
    },
  });
};

export const deleteCommentThread = async (id: string) => {
  return await db.commentThread.delete({ where: { id } });
};
