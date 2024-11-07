import { RequestHandler } from "express";
import User from "../models/User.model";

export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find();

    res.send({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};
