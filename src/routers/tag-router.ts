import express from "express";
import { isAuthMiddleware } from "../middleware/authMiddleware";
import { addTag, getAllTags } from "../services/tag-service";

export const tagRouter = express.Router();

tagRouter.get("/", async (req, res) => {
  try {

    const tag_res = await getAllTags();
    
    console.log("check aall tags", tag_res);

    res.send(200).json({
      tags: tag_res,
    });

  } catch (er) {
    console.log(er);
  }
})

tagRouter.post("/upload", async (req, res) => {
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

  } catch(err) {
    console.log(err);
  }
})