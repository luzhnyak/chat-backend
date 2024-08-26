import app from "./app";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

import Message from "./models/message";
import Chat from "./models/chat";

import { quotes } from "./data/quotes";

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Дозвольте з'єднання з клієнтом React
    methods: ["GET", "POST"],
  },
});

// Middleware для перевірки JWT
io.use((socket: Socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        return next(new Error("Authentication error"));
      }
      socket.data.user = decoded; // Збереження декодованої інформації
      next();
    }
  );
});

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("message", async ({ text, chatId }) => {
    console.log("message received:", text);
    const message = new Message({
      text,
      author: socket.data.user?.name,
      chatId,
    });
    await message.save();

    await Chat.findByIdAndUpdate(chatId, { lastMessage: text });

    setTimeout(async () => {
      const quote =
        quotes[Math.floor(Math.random() * quotes.length)].split("@")[0] ||
        "Hello!";

      io.emit("message", {
        text: quote,
        author: "author",
        chatId,
      });

      const messageServer = new Message({
        text: quote,
        author: "author",
        chatId,
      });
      await messageServer.save();
      await Chat.findByIdAndUpdate(chatId, { lastMessage: quote });
    }, 3000);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
