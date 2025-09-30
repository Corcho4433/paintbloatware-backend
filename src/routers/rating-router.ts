import { Router } from "express";
import { createRating, getRatingsByPost, getRatingsByUser } from "../services/rating-service";

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

// Create a new rating
ratingRouter.post("/", async (req, res) => {
    try {
        const { postId, userId, value } = req.body;
        console.log("hey", req.body);

        const newRating = await createRating(postId, userId, value);
        res.status(201).json(newRating);
    } catch (error) {
        res.status(500).json({ error: "Failed to create rating" });
    }
});
