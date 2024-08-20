import { Router } from "express";
import {
  getPosts,
  addPost,
  updatePost,
  deletePost,
} from "../controllers/postController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getPosts);
router.post("/", authMiddleware, addPost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;
