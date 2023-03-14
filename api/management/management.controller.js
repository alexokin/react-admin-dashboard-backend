import mongoose from "mongoose";
import User from "../models/user/user.js";

export async function getAdmins(req, res) {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).send({ err: "Failed to get admins" });
  }
}
