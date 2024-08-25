import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id?: string;
  name?: string;
  email: string;
  password: string;
  googleId?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
