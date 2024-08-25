import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  text: string;
  author: string;
  chatId: Schema.Types.ObjectId;
}

const messageSchema = new Schema<IMessage>(
  {
    text: { type: String, required: true },
    author: { type: String, required: true },
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IMessage>("Message", messageSchema);
