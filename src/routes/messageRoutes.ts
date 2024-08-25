import { Router } from "express";
import ctrl from "../controllers/messageController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get("/:chatId", authMiddleware, ctrl.getMessages);
router.post("/", authMiddleware, ctrl.addMessage);
router.put("/:id", authMiddleware, ctrl.updateMessage);
router.delete("/:id", authMiddleware, ctrl.deleteMessage);

export default router;
