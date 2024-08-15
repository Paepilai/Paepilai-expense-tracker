import { Router } from "express";
import { db } from "../config/database";
import Joi from "joi";
import { ObjectId } from "mongodb";

const router = Router();

const summarySchema = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  accountId: Joi.string().optional(),
  spendingTypeId: Joi.string().optional(),
  year: Joi.number().integer().optional(),
  page: Joi.number().integer().default(1).optional(),
  limit: Joi.number().integer().default(10).optional(),
});

router.get("/", async (req, res) => {
  try {
    await summarySchema.validateAsync(req.query);

    const {
      startDate,
      endDate,
      accountId,
      spendingTypeId,
      year,
      page = 1,
      limit = 10,
    } = req.query;

    const match: any = {};
    const warnings: string[] = [];

    if (year) {
      const yearNumber = Number(year);
      if (!isNaN(yearNumber)) {
        const startYear = new Date(`${yearNumber}-01-01`);
        const endYear = new Date(`${yearNumber + 1}-01-01`);
        match.date = { $gte: startYear, $lt: endYear };
      } else {
        warnings.push("Invalid year format.");
      }
    } else {
      if (startDate || endDate) {
        match.date = {};
        if (startDate) match.date.$gte = new Date(startDate as string);
        if (endDate) match.date.$lte = new Date(endDate as string);
      } else {
        warnings.push("No date filters applied. Showing all transactions.");
      }
    }

    if (accountId) {
      match.accountId = new ObjectId(accountId as string);
    }

    if (spendingTypeId) {
      match.spendingTypeId = new ObjectId(spendingTypeId as string);
    }

    const transactionsCollection = db.collection("transactions");

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
              $sort: { totalAmount: -1 },
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

    const results = await transactionsCollection.aggregate(pipeline).toArray();
    const data = results[0]?.data || [];
    const totalCount = results[0]?.totalCount || 0;
    const allTotalAmount = results[0]?.allTotalAmount || 0;
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
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
});

export default router;
