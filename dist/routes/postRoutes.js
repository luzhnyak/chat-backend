"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.default, postController_1.getPosts);
router.post("/", authMiddleware_1.default, postController_1.addPost);
router.put("/:id", authMiddleware_1.default, postController_1.updatePost);
router.delete("/:id", authMiddleware_1.default, postController_1.deletePost);
exports.default = router;
