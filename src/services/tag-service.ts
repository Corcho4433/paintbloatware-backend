import { db } from "../db/db";

export const addTag = async (tag_name: string) => {
  return await db.tags.create({
    data: {
      name: tag_name,
    }
  })
}


export const getAllTags = async () => {
  return await db.tags.findMany({
    select: {
      name: true,
    }
  })
}