import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../models/User.model";
import { IRoom } from "../models/Room.model";

export interface IMessage extends Document {
  room: IRoom["_id"];
  sender: IUser["_id"];
  text: string;
  timestamp: Date;
}

const messageSchema: Schema = new Schema({
  room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;
