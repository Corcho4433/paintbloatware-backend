import express from "express";
import { adminMiddleware, isAuthMiddleware } from "../middleware/authMiddleware";
import { deleteComment, deletePost, deleteUser, getAllComments, getAllUsers, getDashboardData } from "../services/admin-service";
import { BadRequest, ServerError } from "../errors/server_errors";
import { getPosts } from "../services/post-service";
import { addTag } from "../services/tag-service";
export const adminRouter = express.Router();


adminRouter.get("/dashboard",isAuthMiddleware,adminMiddleware ,async (req, res, next) => {
  try {
    // Lógica para obtener datos del dashboard administrativo
    const dashboardData = await getDashboardData();
    res.json(dashboardData);
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/users", isAuthMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1;
    const users = await getAllUsers(page);
    res.json(users);
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/comments", isAuthMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1;  
    const comments = await getAllComments(page);
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/posts", isAuthMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1;
    const posts = await getPosts({page: page, userId: undefined});
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/upload",isAuthMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { tag_name } = req.body;



    const result = await addTag(tag_name);
    if (!result) {
      throw new ServerError("fail");
    }


    res.status(200).json({
      status: "Added tag" + tag_name,
    })

  } catch(error) {
      next(error);
  }
})
adminRouter.delete("/user/:id", isAuthMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      throw new BadRequest("User ID is required");
    }
    await deleteUser(userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/comment/:id", isAuthMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const commentId = req.params.id;
    if (!commentId) {
      throw new BadRequest("Comment ID is required");
    }
    await deleteComment(commentId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/post/:id", isAuthMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      throw new BadRequest("Post ID is required");
    }
    await deletePost(postId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
