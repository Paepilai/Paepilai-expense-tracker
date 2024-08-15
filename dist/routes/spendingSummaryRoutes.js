"use strict";
// import { Router } from "express";
// import { db } from "../config/database";
// import Joi from "joi";
// import { ObjectId } from "mongodb";
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
// const summarySchema = Joi.object({
//   startDate: Joi.date().optional(),
//   endDate: Joi.date().optional(),
//   accountId: Joi.string().optional(),
//   spendingTypeId: Joi.string().optional(),
//   year: Joi.number().integer().optional(), // Added year filter
// });
// router.get("/", async (req, res) => {
//   try {
//     await summarySchema.validateAsync(req.query);
//     const {
//       startDate,
//       endDate,
//       accountId,
//       spendingTypeId,
//       year,
//       page = 1,
//       limit = 10,
//     } = req.query;
//     const match: any = {};
//     const warnings: string[] = [];
//     if (year) {
//       const yearNumber = Number(year); // Convert to number
//       if (!isNaN(yearNumber)) {
//         const startYear = new Date(`${yearNumber}-01-01`);
//         const endYear = new Date(`${yearNumber + 1}-01-01`);
//         match.date = { $gte: startYear, $lt: endYear };
//       } else {
//         warnings.push("Invalid year format.");
//       }
//     } else {
//       if (startDate || endDate) {
//         match.date = {};
//         if (startDate) match.date.$gte = new Date(startDate as string);
//         if (endDate) match.date.$lte = new Date(endDate as string);
//       } else {
//         warnings.push("No date filters applied. Showing all transactions.");
//       }
//     }
//     if (accountId) {
//       match.accountId = new ObjectId(accountId as string);
//     }
//     if (spendingTypeId) {
//       match.spendingTypeId = new ObjectId(spendingTypeId as string);
//     }
//     if (!accountId && !spendingTypeId && !year) {
//       warnings.push("No filters applied. Showing all transactions.");
//     }
//     const transactionsCollection = db.collection("transactions");
//     const summary = await transactionsCollection
//       .aggregate([
//         { $match: match },
//         {
//           $group: {
//             _id: null,
//             totalAmount: { $sum: "$amount" },
//             transactionCount: { $sum: 1 },
//           },
//         },
//         {
//           $skip: (Number(page) - 1) * Number(limit), // Pagination logic
//         },
//         {
//           $limit: Number(limit),
//         },
//       ])
//       .toArray();
//     res.status(200).json({
//       summary: summary[0] || { totalAmount: 0, transactionCount: 0 },
//       warnings,
//     });
//   } catch (error) {
//     res.status(400).json({ message: (error as any).message });
//   }
// });
// export default router;
///
// import { Router } from "express";
// import { db } from "../config/database";
// import Joi from "joi";
// import { ObjectId } from "mongodb";
// const router = Router();
// // Validation schema for query parameters
// const summarySchema = Joi.object({
//   startDate: Joi.date().optional(),
//   endDate: Joi.date().optional(),
//   accountId: Joi.string().optional(),
//   spendingTypeId: Joi.string().optional(),
//   year: Joi.number().integer().optional(),
//   page: Joi.number().integer().default(1).optional(),
//   limit: Joi.number().integer().default(10).optional(),
// });
// router.get("/", async (req, res) => {
//   try {
//     // Validate query parameters
//     await summarySchema.validateAsync(req.query);
//     const {
//       startDate,
//       endDate,
//       accountId,
//       spendingTypeId,
//       year,
//       page = 1,
//       limit = 10,
//     } = req.query;
//     const match: any = {};
//     const warnings: string[] = [];
//     if (year) {
//       const yearNumber = Number(year);
//       if (!isNaN(yearNumber)) {
//         const startYear = new Date(`${yearNumber}-01-01`);
//         const endYear = new Date(`${yearNumber + 1}-01-01`);
//         match.date = { $gte: startYear, $lt: endYear };
//       } else {
//         warnings.push("Invalid year format.");
//       }
//     } else {
//       if (startDate || endDate) {
//         match.date = {};
//         if (startDate) match.date.$gte = new Date(startDate as string);
//         if (endDate) match.date.$lte = new Date(endDate as string);
//       } else {
//         warnings.push("No date filters applied. Showing all transactions.");
//       }
//     }
//     if (accountId) {
//       match.accountId = new ObjectId(accountId as string);
//     }
//     if (spendingTypeId) {
//       match.spendingTypeId = new ObjectId(spendingTypeId as string);
//     }
//     const transactionsCollection = db.collection("transactions");
//     const pipeline = [
//       { $match: match },
//       {
//         $group: {
//           _id: {
//             accountId: "$accountId",
//             spendingTypeId: "$spendingTypeId",
//           },
//           totalAmount: { $sum: { $toDouble: "$amount" } },
//           transactionCount: { $sum: 1 },
//         },
//       },
//       {
//         $lookup: {
//           from: "accounts",
//           localField: "_id.accountId",
//           foreignField: "_id",
//           as: "account",
//         },
//       },
//       {
//         $unwind: "$account",
//       },
//       {
//         $lookup: {
//           from: "spending-types",
//           localField: "_id.spendingTypeId",
//           foreignField: "_id",
//           as: "spendingType",
//         },
//       },
//       {
//         $unwind: "$spendingType",
//       },
//       {
//         $project: {
//           _id: 0,
//           accountId: "$_id.accountId",
//           accountName: "$account.name",
//           spendingTypeId: "$_id.spendingTypeId",
//           spendingTypeName: "$spendingType.type",
//           totalAmount: 1,
//           transactionCount: 1,
//         },
//       },
//       {
//         $sort: { totalAmount: -1 }, // Sorting by totalAmount, adjust as needed
//       },
//       {
//         $skip: (Number(page) - 1) * Number(limit),
//       },
//       {
//         $limit: Number(limit),
//       },
//     ];
//     const results = await transactionsCollection.aggregate(pipeline).toArray();
//     const totalCount = await transactionsCollection.countDocuments(match);
//     res.status(200).json({
//       data: results,
//       totalCount,
//       page: Number(page),
//       limit: Number(limit),
//       totalPages: Math.ceil(totalCount / Number(limit)),
//       warnings,
//     });
//   } catch (error) {
//     res.status(400).json({ message: (error as any).message });
//   }
// });
// export default router;
////
const express_1 = require("express");
const database_1 = require("../config/database");
const joi_1 = __importDefault(require("joi"));
const mongodb_1 = require("mongodb");
const router = (0, express_1.Router)();
// Validation schema for query parameters
const summarySchema = joi_1.default.object({
    startDate: joi_1.default.date().optional(),
    endDate: joi_1.default.date().optional(),
    accountId: joi_1.default.string().optional(),
    spendingTypeId: joi_1.default.string().optional(),
    year: joi_1.default.number().integer().optional(),
    page: joi_1.default.number().integer().default(1).optional(),
    limit: joi_1.default.number().integer().default(10).optional(),
});
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        // Validate query parameters
        yield summarySchema.validateAsync(req.query);
        const { startDate, endDate, accountId, spendingTypeId, year, page = 1, limit = 10, } = req.query;
        const match = {};
        const warnings = [];
        if (year) {
            const yearNumber = Number(year);
            if (!isNaN(yearNumber)) {
                const startYear = new Date(`${yearNumber}-01-01`);
                const endYear = new Date(`${yearNumber + 1}-01-01`);
                match.date = { $gte: startYear, $lt: endYear };
            }
            else {
                warnings.push("Invalid year format.");
            }
        }
        else {
            if (startDate || endDate) {
                match.date = {};
                if (startDate)
                    match.date.$gte = new Date(startDate);
                if (endDate)
                    match.date.$lte = new Date(endDate);
            }
            else {
                warnings.push("No date filters applied. Showing all transactions.");
            }
        }
        if (accountId) {
            match.accountId = new mongodb_1.ObjectId(accountId);
        }
        if (spendingTypeId) {
            match.spendingTypeId = new mongodb_1.ObjectId(spendingTypeId);
        }
        const transactionsCollection = database_1.db.collection("transactions");
        const pipeline = [
            { $match: match },
            {
                $facet: {
                    data: [
                        {
                            $group: {
                                _id: {
                                    accountId: "$accountId",
                                    spendingTypeId: "$spendingTypeId",
                                },
                                totalAmount: { $sum: { $toDouble: "$amount" } },
                                transactionCount: { $sum: 1 },
                            },
                        },
                        {
                            $lookup: {
                                from: "accounts",
                                localField: "_id.accountId",
                                foreignField: "_id",
                                as: "account",
                            },
                        },
                        {
                            $unwind: "$account",
                        },
                        {
                            $lookup: {
                                from: "spending-types",
                                localField: "_id.spendingTypeId",
                                foreignField: "_id",
                                as: "spendingType",
                            },
                        },
                        {
                            $unwind: "$spendingType",
                        },
                        {
                            $project: {
                                _id: 0,
                                accountId: "$_id.accountId",
                                accountName: "$account.name",
                                spendingTypeId: "$_id.spendingTypeId",
                                spendingTypeName: "$spendingType.type",
                                totalAmount: 1,
                                transactionCount: 1,
                            },
                        },
                        {
                            $sort: { totalAmount: -1 }, // Sorting by totalAmount, adjust as needed
                        },
                        {
                            $skip: (Number(page) - 1) * Number(limit),
                        },
                        {
                            $limit: Number(limit),
                        },
                    ],
                    summary: [
                        {
                            $group: {
                                _id: null,
                                totalAmount: { $sum: { $toDouble: "$amount" } },
                                totalCount: { $sum: 1 },
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    data: 1,
                    totalCount: { $arrayElemAt: ["$summary.totalCount", 0] },
                    allTotalAmount: { $arrayElemAt: ["$summary.totalAmount", 0] },
                },
            },
        ];
        const results = yield transactionsCollection.aggregate(pipeline).toArray();
        const data = ((_a = results[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
        const totalCount = ((_b = results[0]) === null || _b === void 0 ? void 0 : _b.totalCount) || 0;
        const allTotalAmount = ((_c = results[0]) === null || _c === void 0 ? void 0 : _c.allTotalAmount) || 0;
        const totalPages = Math.ceil(totalCount / Number(limit));
        res.status(200).json({
            data,
            totalCount,
            allTotalAmount,
            page: Number(page),
            limit: Number(limit),
            totalPages,
            warnings,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
exports.default = router;
