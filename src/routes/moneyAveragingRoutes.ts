import { Router } from "express";
import { db } from "../config/database";
import Joi from "joi";
import axios from "axios";

const router = Router();

const moneyAveragingSchema = Joi.object({
  totalIncome: Joi.number().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
});

router.post("/", async (req, res) => {
  try {
    await moneyAveragingSchema.validateAsync(req.body);

    const { totalIncome, startDate, endDate } = req.body;
    const currentDate = new Date();

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res
        .status(400)
        .json({ message: "End date must be after start date." });
    }

    const daysRemaining = Math.ceil(
      (end.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
    );

    // Fetch total expenses from the spending summary endpoint
    const summaryResponse = await axios.get(
      "http://localhost:3000/api/spending-summary",
      {
        params: { startDate, endDate },
      }
    );

    const totalExpenses = summaryResponse.data.allTotalAmount || 0;

    const remainingMoney = totalIncome - totalExpenses;
    const dailyAvailableAmount =
      daysRemaining > 0 ? remainingMoney / daysRemaining : remainingMoney;

    res.status(200).json({
      totalIncome,
      totalExpenses,
      remainingMoney,
      dailyAvailableAmount,
      daysRemaining,
    });
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
});

export default router;
