import express from "express";
import { getTrendingTags } from "../services/trending-service";

export const trendingRouter = express.Router()

trendingRouter.get("/", async (req, res,next) => {
  try {
    const orderedTrendings = await getTrendingTags();

    res.send(200).json({
      trendings: orderedTrendings,
    });
  } catch(error) {
    console.log(error);
    next(error);
  }
})
