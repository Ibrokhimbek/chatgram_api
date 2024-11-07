import { RequestHandler } from "express";
import Code from "../models/Code.model";
import { transporter } from "../configs/mail.config";
import jwt from "jsonwebtoken";
import User from "../models/User.model";

export const sendCode: RequestHandler = async (req, res) => {
  const { email } = req.body;

  let verifyCode = Math.floor(Math.random() * 999999) + 1;

  const code = new Code({
    email,
    code: String(verifyCode),
  });

  await code.save();

  transporter.sendMail(
    {
      from: "gym.crm.llc@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Verify your email!", // Subject line
      html: `<h1>Code: ${verifyCode}</h1>`, // plain text body
    },
    function (err: Error | null) {
      if (err) console.log(err);
      else console.log("Email was sent successfully");
    }
  );

  res.send({
    success: true,
    message: "Verification code sent to your email",
  });
};

export const verifyCode: RequestHandler = async (req, res) => {
  const { email, code } = req.body;

  const user = await Code.findOne({ email, code });

  if (!user) {
    res.status(404).send({ message: "User not found" });
  }

  if (user!.code !== code) {
    res.status(400).send({ message: "Invalid code" });
  }

  await Code.deleteOne({ email, code });

  const jwtSecret: string | undefined = process.env.JWT_SECRET;

  const token = jwt.sign({ email }, jwtSecret!, {
    expiresIn: "1h",
  });

  const newUser = new User({
    username: email.split("@")[0],
    email,
  });

  await newUser.save();

  res.send({
    success: true,
    message: "Code verified successfully",
    data: {
      token: token,
    },
  });
};
