import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "morgan";

import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import messagesRoutes from "./routes/messageRoutes";

dotenv.config();
connectDB();

const allowedOrigins = [
  "https://epharmacy.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }, // Домен, якому дозволено доступ
  optionsSuccessStatus: 200, // Для старих браузерів, які не підтримують статус 204 для preflight запитів
};

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messagesRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
