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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const joi_1 = __importDefault(require("joi"));
const mongodb_1 = require("mongodb");
const router = (0, express_1.Router)();
// Validation schema for reminders
const reminderSchema = joi_1.default.object({
    accountId: joi_1.default.string().required(),
    spendingTypeId: joi_1.default.string().required(),
    presetAmount: joi_1.default.number().required(),
    description: joi_1.default.string().optional(),
    dueDate: joi_1.default.date().required(), // Date when the reminder is due
});
// Create a new reminder
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountId, spendingTypeId, presetAmount, description, dueDate } = req.body;
        yield reminderSchema.validateAsync({
            accountId,
            spendingTypeId,
            presetAmount,
            description,
            dueDate,
        });
        const remindersCollection = database_1.db.collection("reminders");
        yield remindersCollection.insertOne({
            accountId: new mongodb_1.ObjectId(accountId),
            spendingTypeId: new mongodb_1.ObjectId(spendingTypeId),
            presetAmount,
            description,
            dueDate: new Date(dueDate),
        });
        res.status(201).json({ message: req.__("REMINDER_ADDED") });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
// Get reminders (optionally filtered by accountId or spendingTypeId)
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountId, spendingTypeId } = req.query;
        const match = {};
        if (accountId)
            match.accountId = new mongodb_1.ObjectId(accountId);
        if (spendingTypeId)
            match.spendingTypeId = new mongodb_1.ObjectId(spendingTypeId);
        const remindersCollection = database_1.db.collection("reminders");
        const reminders = yield remindersCollection.find(match).toArray();
        res.status(200).json({ reminders });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
exports.default = router;
