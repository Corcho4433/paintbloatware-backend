import express from "express";
import { addTag, getAllTags } from "../services/tag-service";
import { isAuthMiddleware, type UserFromToken } from "../middleware/authMiddleware";
import { getAdmin } from "../services/user-service";

export const tagRouter = express.Router();

tagRouter.get("/", async (req, res,next) => {
  try {

    const tag_res = await getAllTags();

  
    res.status(200).json({
      tags: tag_res,
    });

  } catch (error) {
    next(error);
  }
})

tagRouter.post("/upload",isAuthMiddleware, async (req, res, next) => {
  try {
    const user = req.user as UserFromToken;
    const { tag_name } = req.body;

    const isAdmin = await getAdmin(user.id);

    if (!isAdmin) {
      throw Error("You are not an admin");
    }

    const result = await addTag(tag_name);
    if (!result) {
      throw Error("fail");
    }

    console.log(result, ' recv added');

    res.status(200).json({
      status: "Added tag" + tag_name,
    })

  } catch(error) {
      next(error);
  }
})