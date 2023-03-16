import mongoose from "mongoose";
import User from "../models/user/user.js";
import Transaction from "../models/transaction/transaction.js";

export async function getAdmins(req, res) {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).send({ err: "Failed to get admins" });
  }
}

export async function getUserPerformance(req, res) {
  try {
    const { id } = req.params;

    const userWithStats = await User.aggregate([
      // Converting the id from the params into _id, and finding the user with the matching id.
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        // 
        $lookup: {
          from: "affiliatestats",
          localField: "_id",
          foreignField: "userId",
          as: "affiliateStats",
        },
      },
      { $unwind: "$affiliateStats" },
    ]);
    
    const saleTransactions = await Promise.all(
      userWithStats[0].affiliateStats.affiliateSales.map((id) => {
        return Transaction.findById(id);
      })
    );
    const filteredSaleTransactions = saleTransactions.filter(
      (transaction) => transaction !== null
    );

    res
      .status(200)
      .json({ user: userWithStats[0], sales: filteredSaleTransactions });
  } catch (error) {
    res.status(500).send({ err: "Failed to get performance" });
  }
}
