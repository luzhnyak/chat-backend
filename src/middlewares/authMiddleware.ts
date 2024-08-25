import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/express";
import User from "../models/user";

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    req.user = { _id: user._id, name: user.name, email: user.email };
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export default authMiddleware;
