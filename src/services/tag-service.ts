import { db } from "../db/db";

export const addTag = async (tag_name: string) => {
  return await db.tags.create({
    data: {
      name: tag_name,
    }
  })
}


export const getAllTags = async (page:number) => {
  const pageSize = 20;
  const [tags, totalTags] = await Promise.all([ db.tags.findMany({
    select: {
      id: true,
      name: true,
    },
    skip: (page - 1) * pageSize,
    take: pageSize
  }), db.tags.count() ]);
  const maxPages = Math.ceil(totalTags / pageSize);
  return { tags, totalTags, maxPages, currentPage: page };
}