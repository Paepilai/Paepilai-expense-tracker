import { Router } from "express";
import { db } from "../config/database";
import Joi from "joi";
import { ObjectId } from "mongodb";

const router = Router();

const reminderSchema = Joi.object({
  accountId: Joi.string().required(),
  spendingTypeId: Joi.string().required(),
  presetAmount: Joi.number().required(),
  description: Joi.string().optional(),
  dueDate: Joi.date().required(),
});

// Create a new reminder
router.post("/", async (req, res) => {
  try {
    const { accountId, spendingTypeId, presetAmount, description, dueDate } =
      req.body;

    await reminderSchema.validateAsync({
      accountId,
      spendingTypeId,
      presetAmount,
      description,
      dueDate,
    });

    const remindersCollection = db.collection("reminders");
    await remindersCollection.insertOne({
      accountId: new ObjectId(accountId),
      spendingTypeId: new ObjectId(spendingTypeId),
      presetAmount,
      description,
      dueDate: new Date(dueDate),
    });

    res.status(201).json({ message: req.__("REMINDER_ADDED") });
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
});

// Get reminders
router.get("/", async (req, res) => {
  try {
    const { accountId, spendingTypeId } = req.query;

    const match: any = {};
    if (accountId) match.accountId = new ObjectId(accountId as string);
    if (spendingTypeId)
      match.spendingTypeId = new ObjectId(spendingTypeId as string);

    const remindersCollection = db.collection("reminders");
    const reminders = await remindersCollection.find(match).toArray();

    res.status(200).json({ reminders });
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
});

export default router;
