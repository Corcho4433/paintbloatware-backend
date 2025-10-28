import { db } from '../db/db';

export const getDashboardData = async () => {

  const userCount = await db.user.count();
  const postCount = await db.post.count();
  const commentCount = await db.comment.count();
  const ratingCount = await db.ratings.count();

  return {
    userCount,
    postCount,
    commentCount,
    ratingCount
  };
};

export const getAllUsers = async (page: number) => {
  const pageSize = 10;
  const users = await db.user.findMany({
    skip: (page - 1) * pageSize,
     orderBy: { created_at: 'desc' },
    take: pageSize
  });
  return users;
};

export const getAllComments = async (page: number) => {
  const pageSize = 10;
  const comments = await db.comment.findMany({
    skip: (page - 1) * pageSize,
    orderBy: { created_at: 'desc' },
    take: pageSize
  });
  return comments;
};

export const deleteComment = async (commentId: string) => {
  await db.comment.delete({
    where: { id: commentId }
  }); 
};

export const deletePost = async (postId: string) => {
  await db.post.delete({
    where: { id: postId }
  });
};

export const deleteUser = async (userId: string) => {
  await db.user.delete({
    where: { id: userId }
  });
}