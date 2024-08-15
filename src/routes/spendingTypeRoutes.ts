import { Router } from "express";
import { db } from "../config/database";
import Joi from "joi";
import { ObjectId } from "mongodb"; // Correctly import ObjectId

const router = Router();

const spendingTypeSchema = Joi.object({
  type: Joi.string().required(),
});

router.post("/", async (req, res) => {
  try {
    const { type } = req.body;
    await spendingTypeSchema.validateAsync({ type });

    const spendingTypesCollection = db.collection("spending-types");
    await spendingTypesCollection.insertOne({ type });
    res.status(201).json({ message: "Spending type added" });
  } catch (error) {
    // Cast error to any to access message
    res.status(400).json({ message: (error as any).message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const spendingTypesCollection = db.collection("spending-types");
    await spendingTypesCollection.deleteOne({ _id: new ObjectId(id) }); // Use ObjectId directly
    res.status(200).json({ message: "Spending type deleted" });
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
});

export default router;
