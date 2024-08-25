import mongoose, { Document, Schema } from "mongoose";

export interface IChat extends Document {
  name: string;
  surName: string;
  owner: Schema.Types.ObjectId;
}

const chatSchema = new Schema<IChat>({
  name: { type: String, required: true },
  surName: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IChat>("Chat", chatSchema);
