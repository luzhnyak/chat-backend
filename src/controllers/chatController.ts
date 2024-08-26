import { Request, Response } from "express";
import Chat from "../models/chat";
import { AuthenticatedRequest } from "../types/express";
import { ctrlWrapper } from "../helpers";

const getChats = async (req: AuthenticatedRequest, res: Response) => {
  const chats = await Chat.find({ owner: req.user?._id });

  res.json(chats);
};

const getChat = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const chat = await Chat.findOne({ _id: id });
  res.json(chat);
};

const addChat = async (req: AuthenticatedRequest, res: Response) => {
  const { name, surName } = req.body;

  const chat = new Chat({
    name,
    surName,
    owner: req.user?._id,
    lastMessage: "",
  });
  await chat.save();

  res.status(201).json(chat);
};

const updateChat = async (req: AuthenticatedRequest, res: Response) => {
  const { name, surName } = req.body;

  const chat = await Chat.findByIdAndUpdate(
    req.params.id,
    { name, surName },
    { new: true }
  );
  res.json(chat);
};

const deleteChat = async (req: AuthenticatedRequest, res: Response) => {
  await Chat.findByIdAndDelete(req.params.id);
  res.json({ message: "Chat deleted" });
};

export default {
  getChats: ctrlWrapper(getChats),
  getChat: ctrlWrapper(getChat),
  addChat: ctrlWrapper(addChat),
  updateChat: ctrlWrapper(updateChat),
  deleteChat: ctrlWrapper(deleteChat),
};
