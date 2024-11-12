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
  // Finding user from database
  const verificationCode = await Code.findOne({ email, code });

  if (!verificationCode) {
    res.status(404).send({ message: "Code not found" });
  }

  if (verificationCode!.code !== code) {
    res.status(400).send({ message: "Invalid code" });
  }

  // Delete verification code
  await Code.deleteOne({ email, code });

  // Find user from db
  const user = await User.findOne({ email });

  if (!user) {
    // Creating user
    const newUser = new User({
      username: email.split("@")[0],
      email,
    });
    await newUser.save();
  }

  // Create jwt token
  const token: string = jwt.sign({ email }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
  
  // Sending response
  res.send({
    success: true,
    message: "Code verified successfully",
    data: {
      token,
    },
  });
};
