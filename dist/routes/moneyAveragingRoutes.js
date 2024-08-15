"use strict";
// import { Router } from "express";
// import { db } from "../config/database";
// import Joi from "joi";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// const moneyAveragingSchema = Joi.object({
//   totalIncome: Joi.number().required(),
//   startDate: Joi.date().required(),
//   endDate: Joi.date().required(),
// });
// router.post("/", async (req, res) => {
//   try {
//     const { totalIncome, startDate, endDate } = req.body;
//     await moneyAveragingSchema.validateAsync({
//       totalIncome,
//       startDate,
//       endDate,
//     });
//     // Parse dates
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const now = new Date();
//     // Ensure the start and end dates are valid
//     if (start > end) {
//       throw new Error("Start date must be before end date.");
//     }
//     // Get total expenses within the date range
//     const transactionsCollection = db.collection("transactions");
//     const expenses = await transactionsCollection
//       .aggregate([
//         { $match: { date: { $gte: start, $lte: end } } },
//         { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
//       ])
//       .toArray();
//     const totalExpenses = expenses.length > 0 ? expenses[0].totalAmount : 0;
//     // Calculate remaining balance and days remaining
//     const totalDays = Math.ceil(
//       (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
//     );
//     const daysRemaining = Math.ceil(
//       (end.getTime() - now.getTime()) / (1000 * 3600 * 24)
//     );
//     if (daysRemaining < 0) {
//       throw new Error("End date must be in the future.");
//     }
//     const remainingBalance = totalIncome - totalExpenses;
//     const dailyAvailableAmount =
//       daysRemaining > 0 ? remainingBalance / daysRemaining : remainingBalance;
//     res.status(200).json({
//       totalIncome,
//       totalExpenses,
//       remainingBalance,
//       daysRemaining,
//       dailyAvailableAmount: dailyAvailableAmount.toFixed(2),
//     });
//   } catch (error) {
//     res.status(400).json({ message: (error as any).message });
//   }
// });
// export default router;
///
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const axios_1 = __importDefault(require("axios")); // Make sure to install axios: npm install axios
const router = (0, express_1.Router)();
// Validation schema for query parameters
const moneyAveragingSchema = joi_1.default.object({
    totalIncome: joi_1.default.number().required(),
    startDate: joi_1.default.date().required(),
    endDate: joi_1.default.date().required(),
});
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        yield moneyAveragingSchema.validateAsync(req.body);
        const { totalIncome, startDate, endDate } = req.body;
        const currentDate = new Date();
        // Convert startDate and endDate to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start >= end) {
            return res
                .status(400)
                .json({ message: "End date must be after start date." });
        }
        // Calculate days remaining
        const daysRemaining = Math.ceil((end.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
        // Fetch total expenses from the spending summary endpoint
        const summaryResponse = yield axios_1.default.get("http://localhost:3000/api/spending-summary", {
            params: { startDate, endDate },
        });
        const totalExpenses = summaryResponse.data.allTotalAmount || 0;
        // Calculate daily usable money
        const remainingMoney = totalIncome - totalExpenses;
        const dailyAvailableAmount = daysRemaining > 0 ? remainingMoney / daysRemaining : remainingMoney;
        res.status(200).json({
            totalIncome,
            totalExpenses,
            remainingMoney,
            dailyAvailableAmount,
            daysRemaining,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
exports.default = router;
