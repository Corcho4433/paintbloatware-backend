import { Router } from "express";
import { createRating, getRatingsByPost, getRatingsByUser } from "../services/rating-service";
import { isAuthMiddleware, type UserFromToken } from "../middleware/authMiddleware";
import { BadRequest, ValidationError } from "../errors/server_errors";
import { getPostById } from "../services/post-service";

export const ratingRouter = Router();

// Get ratings by user ID
ratingRouter.get("/user/:userId", async (req, res, next) => {
    try {
        const { userId } = req.params;
        const ratings = await getRatingsByUser(userId);
        res.json(ratings);
    } catch (error) {
        next(error);
    }
});

// Get ratings by post ID
ratingRouter.get("/post/:postId", async (req, res,next) => {
    try {
        const { postId } = req.params;
        const ratings = await getRatingsByPost(postId);
        res.json(ratings);
    } catch (error) {
        next(error);
    }
});

// Rate a post (-1; 1)
ratingRouter.post("/", isAuthMiddleware, async (req, res, next) => {
    try {
        const { postId, value } = req.body;
        const user = req.user as UserFromToken;
        if (value != -1 && value != 1 && value != 0) {
            throw new ValidationError("Invalid value given for rating {-1; 1; 0}")
        }

        const post_exists = await getPostById(postId);
        if (!post_exists) {
            throw new BadRequest(`Post by id ${postId} does not exist.`)    
        }

        const newRating = await createRating(postId, user.id, value);
        
        res.status(201).json(newRating);
    } catch (error) {
        next(error)
    }
});
