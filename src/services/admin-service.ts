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
const obfuscateEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;
  
  const visibleChars = Math.min(3, Math.floor(username.length / 2));
  const obfuscated = username.substring(0, visibleChars) + '***';
  
  return `${obfuscated}@${domain}`;
};


export const getAllUsers = async (page: number) => {
  const pageSize = 10;
  const [users, totalUsers] = await Promise.all([
    db.user.findMany({
      skip: (page - 1) * pageSize,
      orderBy: { created_at: 'desc' },
      take: pageSize,
      include: {
        Admin: true,
      },
    }),
    db.user.count()
  ]);

  const usersWithAdminFlag = users.map(user => ({
    id: user.id,
    name: user.name,
    email: obfuscateEmail(user.email),
    urlPfp: user.urlPfp,
    description: user.description,
    created_at: user.created_at,
    isAdmin: user.Admin.length > 0,
  }));

  const maxPages = Math.ceil(totalUsers / pageSize);
  
  return {
    users: usersWithAdminFlag,
    totalCount: totalUsers,
    maxPages,
    currentPage: page
  };
};

export const getAllComments = async (page: number) => {
  const pageSize = 10;
  const [comments,totalCount] = await Promise.all([
    db.comment.findMany({
      skip: (page - 1) * pageSize,
      orderBy: { created_at: 'desc' },
      take: pageSize,
      select: {
        id: true,
      content: true,
      created_at: true,
      user: {
        select: {
          id:true,
          name:true,
          urlPfp:true
        }
      },
      post: {
        select: {
          id:true,
        }
      },
      _count: {
        select: { CommentThread: true }
      }
    }
  }),
    db.comment.count()
  ]);
  const maxPages = Math.ceil(totalCount / pageSize);
  return { comments,  totalCount, maxPages, currentPage: page };
};

export const deleteComment = async (commentId: string) => {
  await db.comment.delete({
    where: { id: commentId }
  }); 
};

export const deleteCommentThread = async (threadId: string) => {
  await db.commentThread.delete({
    where: { id: threadId }
  });
}

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

export const deleteTag = async (tagId: string) => {
  await db.tags.delete({
    where: { id: tagId }
  });
}

export const addAdmin = async (userId: string) => {
  await db.admin.create({
    data: {
      user: {
        connect: { id: userId }
      }
    }
  });}

  export const deleteAdmin = async (userId: string) => {
    await db.admin.deleteMany({
      where: { userId: userId }
    });
  }