
import { db } from "../db/db";

// interfaces
interface Rating {
  id_post: string,
  id_user: string,
  value: number,
}


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

  const tagLikesCount: { [key: string] : number } = {};

  recentRatings.forEach((rating) => {
    rating.post.TagsForPost.forEach((tagForPost) => {
      const tagName = tagForPost.tag.name;
      tagLikesCount[tagName] = (tagLikesCount[tagName] || 0) + 1;
    });
  });

  const trendingTags = Object.entries(tagLikesCount)
    .map(([name, likeCount]) => ({
      name,
      likeCount,
    }))
    .sort((a, b) => (b.likeCount as number) - (a.likeCount as number));

  return trendingTags;
};

export const likePost = async ( rating: Rating ) => {

  return await db.ratings.create({
    data: {
      id_post: rating.id_post,
      id_user: rating.id_user,
      value: rating.value,
      
    }
  })

}