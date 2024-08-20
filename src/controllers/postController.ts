import { Request, Response } from "express";
import Post from "../models/post";

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("author", "email");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const addPost = async (req: Request, res: Response) => {
  const { title, content } = req.body;

  try {
    const post = new Post({ title, content, author: req.user?.id });
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const { title, content } = req.body;

  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
