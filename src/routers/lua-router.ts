import express from "express";
import { getSourcecodeByPost } from "../services/lua-service";

export const luaRouter = express.Router();

luaRouter.get("/:id_post", async (req, res) => {
	try {
		const id_post = req.params.id_post;
		const sourcecode = await getSourcecodeByPost(id_post);
		if (!sourcecode) throw new Error("El posteo esta vacio (?)");
		res.status(200).json({ sourcecode: sourcecode });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: (error as Error).message });
	}
});
