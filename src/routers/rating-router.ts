import { Router } from "express";
import { createRating, getRatingsByPost, getRatingsByUser } from "../services/rating-service";
import { isAuthMiddleware } from "../middleware/authMiddleware";
import { BadRequest, ValidationError } from "../errors/server_errors";
import { getPostById } from "../services/post-service";

export const ratingRouter = Router();

// Get ratings by user ID
ratingRouter.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const ratings = await getRatingsByUser(userId);
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ error: "Failed to get user ratings" });
    }
});

// Get ratings by post ID
ratingRouter.get("/post/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const ratings = await getRatingsByPost(postId);
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ error: "Failed to get post ratings" });
    }
});

// Rate a post (-1; 1)
ratingRouter.post("/", isAuthMiddleware, async (req, res, next) => {
    try {
        const { postId, userId, value } = req.body;
        if (value != -1 && value != 1) {
            throw new ValidationError("Invalid value given for rating {-1; 1}")
        }

        const post_exists = await getPostById(postId);
        if (!post_exists) {
            throw new BadRequest(`Post by id ${postId} does not exist.`)    
        }

        const newRating = await createRating(postId, userId, value);
        
        res.status(201).json(newRating);
    } catch (error) {
        next(error)
    }
});
