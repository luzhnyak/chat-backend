"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.addPost = exports.getPosts = void 0;
const post_1 = __importDefault(require("../models/post"));
const getPosts = async (req, res) => {
    try {
        const posts = await post_1.default.find().populate("author", "email");
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
exports.getPosts = getPosts;
const addPost = async (req, res) => {
    const { title, content } = req.body;
    try {
        const post = new post_1.default({ title, content, author: req.user?.id });
        await post.save();
        res.status(201).json(post);
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
exports.addPost = addPost;
const updatePost = async (req, res) => {
    const { title, content } = req.body;
    try {
        const post = await post_1.default.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
        res.json(post);
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
exports.updatePost = updatePost;
const deletePost = async (req, res) => {
    try {
        await post_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: "Post deleted" });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
exports.deletePost = deletePost;
