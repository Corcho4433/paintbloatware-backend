import express from "express";
import { addTag, getAllTags } from "../services/tag-service";
import { isAuthMiddleware, type UserFromToken } from "../middleware/authMiddleware";
import { getAdmin } from "../services/user-service";

export const tagRouter = express.Router();

tagRouter.get("/", async (req, res,next) => {
  try {

    const tag_res = await getAllTags(1);

  
    res.status(200).json({
      tags: tag_res,
    });

  } catch (error) {
    next(error);
  }
})
