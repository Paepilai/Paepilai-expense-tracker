import { Router } from "express";
import { db } from "../config/database";
import Joi from "joi";
import { ObjectId } from "mongodb";
import multer from "multer";
import path from "path";
import rudeWordsMiddleware from "../middleware/rudeWordsMiddleware";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = Router();

const transactionSchema = Joi.object({
  amount: Joi.number().required(),
  date: Joi.date().required(),
  accountId: Joi.string().required(),
  spendingTypeId: Joi.string().required(),
  description: Joi.string().optional(),
});

router.post(
  "/",
  upload.single("slip"),
  rudeWordsMiddleware,
  async (req, res) => {
    try {
      const { amount, date, accountId, spendingTypeId, description } = req.body;
      const file = req.file;

      await transactionSchema.validateAsync({
        amount,
        date,
        accountId,
        spendingTypeId,
        description,
      });

      const transactionsCollection = db.collection("transactions");
      const transaction = {
        amount,
        date: new Date(date),
        accountId: new ObjectId(accountId),
        spendingTypeId: new ObjectId(spendingTypeId),
        description,
        slipPath: file ? file.path : null,
      };

      await transactionsCollection.insertOne(transaction);
      res.status(201).json({ message: res.__("TRANSACTION_ADDED") });
    } catch (error) {
      res.status(400).json({ message: (error as any).message });
    }
  }
);

export default router;
