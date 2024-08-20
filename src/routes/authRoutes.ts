import { Router } from "express";
import { register, login } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Add Google Auth routes here

export default router;
