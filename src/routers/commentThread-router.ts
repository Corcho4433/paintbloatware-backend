import express from "express";
import {
  createCommentThread,
  getCommentThreadsByComment,
  getCommentThreadById,
  deleteCommentThread,
} from "../services/commentThread-service";
import { isAuthMiddleware, type UserFromToken } from "../middleware/authMiddleware";

export const commentThreadRouter = express.Router();

commentThreadRouter.post("/", isAuthMiddleware, async (req, res, next) => {
  try {
    const { content, id_comment } = req.body;
    const user = req.user as UserFromToken;
    if (!content || !id_comment || !user?.id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const thread = await createCommentThread({
      content,
      id_comment,
      id_user: user.id,
    });
    res.status(201).json({ thread: thread.thread });
  } catch (error) {
    next(error);
  }
});

commentThreadRouter.get("/comment/:id", async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1;
    const result = await getCommentThreadsByComment({ id_comment: req.params.id, page });
    res.json({
      threads: result.threads,
      maxPages: result.maxPages,
      currentPage: result.currentPage,
      totalCount: result.totalCount
    });
  } catch (error) {
    next(error);
  }
});

commentThreadRouter.get("/:id", async (req, res, next) => {
  try {
    const thread = await getCommentThreadById(req.params.id);
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json({ thread });
  } catch (error) {
    next(error);
  }
});

commentThreadRouter.delete("/:id", isAuthMiddleware, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    await deleteCommentThread(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
