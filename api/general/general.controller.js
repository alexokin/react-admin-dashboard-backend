import User from "../models/user/user.js";
import OverallStat from "../models/overallStat/overallStat.js";
import Transaction from "../models/transaction/transaction.js";

export async function getUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.send(user);
  } catch (err) {
    res.status(500).send({ err: "Failed to get user" });
  }
}

export async function getDashboardStats(req, res) {
  try {
    // hardcoded values
    const currentMonth = "November";
    const currentYear = 2021;
    const currentDay = "2021-11-15";

    const transactions = await Transaction.find()
      .limit(50)
      .sort({ createdOn: -1 });

    const overallStat = await OverallStat.find({ year: currentYear });

    const {
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCatergory,
    } = overallStat;

    const thisMonthStats = overallStat[0].monthlyData.find(({ month }) => {
      return month === currentMonth;
    });

    const todayStats = overallStat[0].dailyData.find(({ date }) => {
      return date === currentDay;
    });
    
    res.status(200).json({
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCatergory,
      thisMonthStats,
      todayStats,
      transactions
    })
  } catch (err) {
    res.status(500).send({ err: "Failed to get dashboard stats" });
  }
}
