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
const express_1 = require("express");
const database_1 = require("../config/database");
const joi_1 = __importDefault(require("joi"));
const mongodb_1 = require("mongodb");
const multer_1 = __importDefault(require("multer"));
const rudeWordsMiddleware_1 = __importDefault(require("../middleware/rudeWordsMiddleware"));
// diskStorage:
// Persistence - The files persist even after the server is restarted
// File Size - Suitable for handling large files because they don't consume server memory.
// Scalability - Files can be easily managed, backed up, and scaled by leveraging cloud storage services or external storage solutions.
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/uploads/"); // Specify the directory where the files will be saved
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Create a unique filename
    },
});
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
const transactionSchema = joi_1.default.object({
    amount: joi_1.default.number().required(),
    date: joi_1.default.date().required(),
    accountId: joi_1.default.string().required(),
    spendingTypeId: joi_1.default.string().required(),
    description: joi_1.default.string().optional(),
});
// to use form-data when handling file uploads is that it allows the client (e.g., Postman) to send both text fields and files in a single request.
router.post("/", upload.single("slip"), rudeWordsMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, date, accountId, spendingTypeId, description } = req.body;
        const file = req.file;
        yield transactionSchema.validateAsync({
            amount,
            date,
            accountId,
            spendingTypeId,
            description,
        });
        const transactionsCollection = database_1.db.collection("transactions");
        const transaction = {
            amount,
            date: new Date(date),
            accountId: new mongodb_1.ObjectId(accountId),
            spendingTypeId: new mongodb_1.ObjectId(spendingTypeId),
            description,
            slipPath: file ? file.path : null, // Save the file path if a file was uploaded
        };
        yield transactionsCollection.insertOne(transaction);
        // res.status(201).json({ message: "Transaction added", transaction });
        res.status(201).json({ message: res.__("TRANSACTION_ADDED") });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
exports.default = router;
