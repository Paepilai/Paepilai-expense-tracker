"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const mongodb_1 = require("mongodb");
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate, accountId, spendingTypeId } = req.query;
        const matchCriteria = {
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        };
        if (accountId)
            matchCriteria.accountId = new mongodb_1.ObjectId(accountId);
        if (spendingTypeId)
            matchCriteria.spendingTypeId = new mongodb_1.ObjectId(spendingTypeId);
        const transactionsCollection = database_1.db.collection("transactions");
        const pipeline = [
            { $match: matchCriteria },
            {
                $group: {
                    _id: null,
                    totalIncome: {
                        $sum: { $cond: [{ $gt: ["$amount", 0] }, "$amount", 0] },
                    },
                    totalExpenses: {
                        $sum: { $cond: [{ $lt: ["$amount", 0] }, "$amount", 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalIncome: 1,
                    totalExpenses: 1,
                    netAmount: {
                        $subtract: ["$totalIncome", { $abs: "$totalExpenses" }],
                    },
                },
            },
        ];
        const summary = yield transactionsCollection.aggregate(pipeline).toArray();
        res
            .status(200)
            .json(summary[0] || { totalIncome: 0, totalExpenses: 0, netAmount: 0 });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
exports.default = router;
