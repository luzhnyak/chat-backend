import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { ctrlWrapper } from "../helpers";
import { AuthenticatedRequest } from "../types/express";

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  // res.status(201).json({ message: "User registered successfully" });
  res.json({ token, user });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password!);

  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "24h" }
  );

  res.json({ token, user });
};

const currentUser = async (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
};

// Google OAuth logic can be added here

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  currentUser: ctrlWrapper(currentUser),
};
