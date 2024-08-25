import { Router } from "express";
import ctrl from "../controllers/chatController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, ctrl.getChats);
router.get("/:id", authMiddleware, ctrl.getChat);
router.post("/", authMiddleware, ctrl.addChat);
router.put("/:id", authMiddleware, ctrl.updateChat);
router.delete("/:id", authMiddleware, ctrl.deleteChat);

export default router;
