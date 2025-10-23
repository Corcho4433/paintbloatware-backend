import { db } from "../db/db";

// methods
export const getTrendingTags = async () => {
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

  const recentRatings = await db.ratings.findMany({
    where: {
      like_date: {
        gte: twelveHoursAgo,
      },
    },
    include: {
      post: {
        include: {
          TagsForPost: {
            include: {
              tag: true,
            },
          },
        },
      },
    },
  });

  // Count likes for each tag
  const tagLikesCount: { [key: string]: number } = {};
  recentRatings.forEach((rating) => {
    rating.post.TagsForPost.forEach((tagForPost) => {
      const tagName = tagForPost.tag.name;
      tagLikesCount[tagName] = (tagLikesCount[tagName] || 0) + 1;
    });
  });

  // Get all tags
  const allTags = await db.tags.findMany({ select: { name: true } });

  // Map all tags to include likeCount, default 0
  const tagsWithLikes = allTags.map(tag => ({
    name: tag.name,
    likeCount: tagLikesCount[tag.name] || 0
  }));

  // Sort by likeCount descending
  tagsWithLikes.sort((a, b) => b.likeCount - a.likeCount);

  return { tags: tagsWithLikes };
};

