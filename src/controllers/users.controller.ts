import { RequestHandler } from "express";
import User from "../models/User.model";

export const getUsers: RequestHandler = async (req, res) => {
  const userEmail = req.userEmail;
  const users = await User.find({ email: { $nin: userEmail } });

  res.send({
    status: "success",
    data: {
      users,
    },
  });
};
