import mongoose, { Schema, Document } from "mongoose";

interface ICode extends Document {
  email: string;
  code: string;
  createdAt: Date;
}

const CodeSchema = new Schema<ICode>({
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
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 3000,
  },
});

const Code = mongoose.model<ICode>("Code", CodeSchema);
export default Code;
