import express from "express";
import { addAdmin, deleteComment, deletePost, deleteTag, deleteUser, getAllComments, getAllUsers, getDashboardData } from "../services/admin-service";
import { BadRequest, ServerError } from "../errors/server_errors";
import { getPosts } from "../services/post-service";
import { addTag, getAllTags } from "../services/tag-service";
export const adminRouter = express.Router();


adminRouter.get("/dashboard" ,async (req, res, next) => {
  try {
    // Lógica para obtener datos del dashboard administrativo
    const dashboardData = await getDashboardData();
    res.json(dashboardData);
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/verify", async (req, res, next) => {
  try {
    res.status(200).json({ message: "Admin verified" });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/users", async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1;
    const users = await getAllUsers(page);
    res.json(users);
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/comments", async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1;  
    const comments = await getAllComments(page);
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/posts", async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1;
    const posts = await getPosts({page: page, userId: undefined});
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/tags", async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1;
    const tags = await getAllTags(page);
    res.json(tags);
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/tags", async (req, res, next) => {
  try {
    const { name } = req.body;



    const result = await addTag(name);
    if (!result) {
      throw new ServerError("fail");
    }


    res.status(200).json({
      status: "Added tag" + name,
    })

  } catch(error) {
      next(error);
  }
})

adminRouter.post("/admin/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      throw new BadRequest("User ID is required");
    }
    await addAdmin(userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/tag/:id", async (req, res, next) => {
  try {
    const tagId = req.params.id;
    if (!tagId) {
      throw new BadRequest("Tag ID is required");
    }
    await deleteTag(tagId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/user/:id", async (req, res, next) => {
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

adminRouter.delete("/comment/:id", async (req, res, next) => {
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

adminRouter.delete("/post/:id", async (req, res, next) => {
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
