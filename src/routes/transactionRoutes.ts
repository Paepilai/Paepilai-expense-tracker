// import { Router } from "express";
// import { db } from "../config/database";
// import Joi from "joi";
// import { ObjectId } from "mongodb";

// const router = Router();

// const transactionSchema = Joi.object({
//   amount: Joi.number().required(),
//   date: Joi.date().required(),
//   accountId: Joi.string().required(),
//   spendingTypeId: Joi.string().required(),
//   description: Joi.string().optional(),
// });

// router.post("/", async (req, res) => {
//   try {
//     const { amount, date, accountId, spendingTypeId, description } = req.body;
//     await transactionSchema.validateAsync({
//       amount,
//       date,
//       accountId,
//       spendingTypeId,
//       description,
//     });

//     const transactionsCollection = db.collection("transactions");
//     await transactionsCollection.insertOne({
//       amount,
//       date: new Date(date),
//       accountId: new ObjectId(accountId),
//       spendingTypeId: new ObjectId(spendingTypeId),
//       description,
//     });
//     res.status(201).json({ message: "Transaction added" });
//   } catch (error) {
//     res.status(400).json({ message: (error as any).message });
//   }
// });

// export default router;

//

import { Router } from "express";
import { db } from "../config/database";
import Joi from "joi";
import { ObjectId } from "mongodb";
import multer from "multer";
import path from "path";
import rudeWordsMiddleware from "../middleware/rudeWordsMiddleware";

// diskStorage:
// Persistence - The files persist even after the server is restarted
// File Size - Suitable for handling large files because they don't consume server memory.
// Scalability - Files can be easily managed, backed up, and scaled by leveraging cloud storage services or external storage solutions.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/"); // Specify the directory where the files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Create a unique filename
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

// to use form-data when handling file uploads is that it allows the client (e.g., Postman) to send both text fields and files in a single request.
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
        slipPath: file ? file.path : null, // Save the file path if a file was uploaded
      };

      await transactionsCollection.insertOne(transaction);
      // res.status(201).json({ message: "Transaction added", transaction });
      res.status(201).json({ message: res.__("TRANSACTION_ADDED") });
    } catch (error) {
      res.status(400).json({ message: (error as any).message });
    }
  }
);

export default router;
