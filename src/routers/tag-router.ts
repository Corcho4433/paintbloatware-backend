import express from "express";
import { addTag, getAllTags } from "../services/tag-service";

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

tagRouter.post("/upload", async (req, res, next) => {
  try {

    const { tag_name } = req.body;
    const result = await addTag(tag_name);
    if (!result) {
      throw Error("fail");
    }

    console.log(result, ' recv added');

    res.send(200).json({
      status: "Added tag" + tag_name,
    })

  } catch(error) {
      next(error);
  }
})