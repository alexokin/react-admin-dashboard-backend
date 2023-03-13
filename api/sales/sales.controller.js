import OverallStat from "../models/overallStat/overallStat.js";

export async function getSales(req, res) {
  try {
    const overallStats = await OverallStat.find();
    res.status(200).json(overallStats[0]);
    
  } catch (err) {
    res.status(500).send({ err: "Failed to get products" });
  }
};
