import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import querystring from "querystring";
import axios from "axios";

import { ctrlWrapper } from "../helpers";
import { AuthenticatedRequest } from "../types/express";
import User from "../models/user";
import Chat from "../models/chat";
import Message from "../models/message";

const defaultChats = [
  { name: "Jhon", surName: "Snow" },
  { name: "Alice", surName: "Freeman" },
  { name: "Piter", surName: "Parker" },
];

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

  defaultChats.map(async (defaultChat) => {
    const chat = new Chat({
      name: defaultChat.name,
      surName: defaultChat.surName,
      owner: user?._id,
      lastMessage: "Hello!",
    });
    await chat.save();

    const message = new Message({
      text: "Hello!",
      author: `${defaultChat.name} ${defaultChat.surName}`,
      chatId: chat._id,
    });
    await message.save();
  });

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

const google = async (req: Request, res: Response) => {
  const stringifiedParams = querystring.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL}/api/auth/google-redirect`,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });

  console.log(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
  );

  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
  );
};

const authGoogle = async (userData: {
  name: string;
  email: string;
  picture: string;
}) => {
  const { email } = userData;

  let user = await User.findOne({ email }).select("+password");

  if (!user) {
    user = await User.create({
      name: userData.name,
      email,
      password: "google12345",
    });

    defaultChats.map(async (defaultChat) => {
      const chat = new Chat({
        name: defaultChat.name,
        surName: defaultChat.surName,
        owner: user?._id,
        lastMessage: "Hello!",
      });
      await chat.save();

      const message = new Message({
        text: "Hello!",
        author: `${defaultChat.name} ${defaultChat.surName}`,
        chatId: chat._id,
      });
      await message.save();
    });
  }

  const token = jwt.sign(
    { userId: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "24h" }
  );

  return { token };
};

const googleRedirect = async (req: Request, res: Response) => {
  console.log("redirect");
  console.log("req.originalUrl", req.originalUrl);

  const queryParams = req.query;

  const code = queryParams.code;

  console.log("code", code);

  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "post",
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URL}/api/auth/google-redirect`,
      grant_type: "authorization_code",
      code,
    },
  });

  const userData = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });

  const { token } = await authGoogle(userData.data);

  return res.redirect(`${process.env.FRONTEND_URL}/auth?token=${token}`);
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  currentUser: ctrlWrapper(currentUser),
  google: ctrlWrapper(google),
  googleRedirect: ctrlWrapper(googleRedirect),
};
