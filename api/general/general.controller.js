import User from "../models/user/user.js";

export async function getUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.send(user);
  } catch (err) {
    res.status(500).send({ err: "Failed to get user" });
  }
}


