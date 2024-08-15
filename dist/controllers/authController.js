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
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const users = {}; // Simple in-memory user storage
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (users[username]) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    users[username] = hashedPassword;
    res.status(201).json({ message: "User registered successfully" });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const hashedPassword = users[username];
    if (!hashedPassword || !(yield bcrypt_1.default.compare(password, hashedPassword))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    // Create a session or token here, but keep it simple for now
    res.status(200).json({ message: "Login successful" });
});
exports.login = login;
