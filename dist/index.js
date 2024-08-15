"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const accountRoutes_1 = __importDefault(require("./routes/accountRoutes"));
const spendingTypeRoutes_1 = __importDefault(require("./routes/spendingTypeRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const spendingSummaryRoutes_1 = __importDefault(require("./routes/spendingSummaryRoutes"));
const moneyAveragingRoutes_1 = __importDefault(require("./routes/moneyAveragingRoutes"));
const presetExpenseRoutes_1 = __importDefault(require("./routes/presetExpenseRoutes"));
const i18n_1 = __importDefault(require("i18n"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// i18n configuration
i18n_1.default.configure({
    locales: ["en", "th"], // Define your supported languages
    directory: path_1.default.join(__dirname, "locales"), // Path to the locales directory
    defaultLocale: "en",
    queryParameter: "lang", // Use the lang query parameter to determine language
    autoReload: true, // Automatically reload language files when they change
    updateFiles: false, // Do not automatically add missing keys to translation files
    syncFiles: false, // Do not create missing translation files
    objectNotation: true,
});
app.use(i18n_1.default.init);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/accounts", accountRoutes_1.default);
app.use("/api/spending-types", spendingTypeRoutes_1.default);
app.use("/api/transactions", transactionRoutes_1.default);
app.use("/api/spending-summary", spendingSummaryRoutes_1.default);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/money-averaging", moneyAveragingRoutes_1.default);
app.use("/api/reminder", presetExpenseRoutes_1.default);
app.use("/api/reminders", presetExpenseRoutes_1.default);
app.listen(env_1.PORT, () => {
    (0, database_1.connectDB)();
    console.log(`Server running on port ${env_1.PORT}`);
});
//
