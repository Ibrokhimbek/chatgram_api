import mongoose, { Schema, Model } from "mongoose";

interface IUser {
  username: string;
  email: string;
}

type UserModel = Model<IUser>;

const UserSchema = new Schema<IUser, UserModel>({
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

const User = mongoose.model<IUser, UserModel>("User", UserSchema);
export default User;
