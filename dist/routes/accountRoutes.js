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
const mongodb_1 = require("mongodb"); // Correctly import ObjectId
const router = (0, express_1.Router)();
const accountSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
});
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        yield accountSchema.validateAsync({ name });
        const accountsCollection = database_1.db.collection("accounts");
        yield accountsCollection.insertOne({ name });
        res.status(201).json({ message: "Account added" });
    }
    catch (error) {
        // Cast error to any to access message
        res.status(400).json({ message: error.message });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const accountsCollection = database_1.db.collection("accounts");
        yield accountsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) }); // Use ObjectId directly
        res.status(200).json({ message: "Account deleted" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
exports.default = router;
