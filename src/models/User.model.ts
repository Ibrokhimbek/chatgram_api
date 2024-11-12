import mongoose, { Schema, Model, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        );
      },
      message: (props: any) => `${props.value} is not a valid email!`,
    },
    required: [true, "User email is required"],
  },
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
