import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User.model";

export interface IRoom extends Document {
  users: IUser["_id"][];
}

const RoomSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
});

const Room = mongoose.model<IRoom>("Room", RoomSchema);
export default Room;
