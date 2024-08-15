import { Router } from "express";
import { db } from "../config/database";
import Joi from "joi";
import { ObjectId } from "mongodb"; // Correctly import ObjectId

const router = Router();

const accountSchema = Joi.object({
  name: Joi.string().required(),
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    await accountSchema.validateAsync({ name });

    const accountsCollection = db.collection("accounts");
    await accountsCollection.insertOne({ name });
    res.status(201).json({ message: "Account added" });
  } catch (error) {
    // Cast error to any to access message
    res.status(400).json({ message: (error as any).message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const accountsCollection = db.collection("accounts");
    await accountsCollection.deleteOne({ _id: new ObjectId(id) }); // Use ObjectId directly
    res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
});

export default router;
