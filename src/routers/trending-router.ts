import express from "express";
import { getTrendingTags } from "../services/trending-service";

export const trendingRouter = express.Router()

trendingRouter.get("/", async (req, res,next) => {
  try {
    const result = await getTrendingTags();
    res.status(200).json(result);
  } catch(error) {
    console.log(error);
    next(error);
  }
})
