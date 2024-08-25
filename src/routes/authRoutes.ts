import { Router } from "express";
import ctrl from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/user", authMiddleware, ctrl.currentUser);

// Add Google Auth routes here

export default router;
