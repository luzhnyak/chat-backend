import { Router } from "express";
import ctrl from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/user", authMiddleware, ctrl.currentUser);
router.get("/google", ctrl.google);
router.get("/google-redirect", ctrl.googleRedirect);

export default router;
