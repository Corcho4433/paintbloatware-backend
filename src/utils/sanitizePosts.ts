export const sanitizePost = (post: any) => {
  if (!post) return post;
  
  const sanitized = post.sourceHidden ? { ...post, content: null } : { ...post };
  
  // Agregar campo nitro al usuario y eliminar subscription
  if (sanitized.user) {
    const hasNitro = !!(
      sanitized.user.subscription?.endDate && 
      sanitized.user.subscription.endDate > new Date()
    );
    
    const { subscription, ...userWithoutSubscription } = sanitized.user;
    
    sanitized.user = {
      ...userWithoutSubscription,
      nitro: hasNitro
    };
  }
  
  return sanitized;
};

export const sanitizePosts = (posts: any[]) => {
  return posts.map(sanitizePost);
};

export const sanitizeComment = (comment: any) => {
  if (!comment) return comment;
  
  const sanitized = { ...comment };
  
  // Agregar campo nitro al usuario y eliminar subscription
  if (sanitized.user) {
    const hasNitro = !!(
      sanitized.user.subscription?.endDate && 
      sanitized.user.subscription.endDate > new Date()
    );
    
    const { subscription, ...userWithoutSubscription } = sanitized.user;
    
    sanitized.user = {
      ...userWithoutSubscription,
      nitro: hasNitro
    };
  }
  
  return sanitized;
};

export const sanitizeComments = (comments: any[]) => {
  return comments.map(sanitizeComment);
};

export const sanitizeCommentThread = (thread: any) => {
  if (!thread) return thread;
  
  const sanitized = { ...thread };
  
  // Agregar campo nitro al usuario y eliminar subscription
  if (sanitized.user) {
    const hasNitro = !!(
      sanitized.user.subscription?.endDate && 
      sanitized.user.subscription.endDate > new Date()
    );
    
    const { subscription, ...userWithoutSubscription } = sanitized.user;
    
    sanitized.user = {
      ...userWithoutSubscription,
      nitro: hasNitro
    };
  }
  
  return sanitized;
};

export const sanitizeCommentThreads = (threads: any[]) => {
  return threads.map(sanitizeCommentThread);
};