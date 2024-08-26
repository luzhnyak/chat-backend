import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/express";

import { ctrlWrapper } from "../helpers";
import Chat from "../models/chat";
import Message from "../models/message";

const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  const { chatId } = req.params;
  const messages = await Message.find({ chatId });
  res.json(messages);
};

const getMessage = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const message = await Message.findOne({ _id: id });
  res.json(message);
};

const addMessage = async (req: AuthenticatedRequest, res: Response) => {
  const { text, author, chatId } = req.body;

  const message = new Message({ text, author: req.user?.name, chatId });
  await message.save();

  console.log("text", text);

  await Chat.findByIdAndUpdate(chatId, { lastMessage: text }, { new: true });

  // const response = await fetch("https://api.quotable.io/random");
  // const data = await response.json();
  // console.log(`"${data.content}" —${data.author}`);

  res.status(201).json(message);
};

const updateMessage = async (req: AuthenticatedRequest, res: Response) => {
  const { text, author, chatId } = req.body;

  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { text, author, chatId },
    { new: true }
  );
  res.json(message);
};

const deleteMessage = async (req: AuthenticatedRequest, res: Response) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ message: "Message deleted" });
};

export default {
  getMessages: ctrlWrapper(getMessages),
  getMessage: ctrlWrapper(getMessage),
  addMessage: ctrlWrapper(addMessage),
  updateMessage: ctrlWrapper(updateMessage),
  deleteMessage: ctrlWrapper(deleteMessage),
};
