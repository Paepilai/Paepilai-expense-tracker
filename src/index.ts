import express from "express";
import { PORT } from "./config/env";
import { connectDB } from "./config/database";
import authRoutes from "./routes/authRoutes";
import accountRoutes from "./routes/accountRoutes";
import spendingTypeRoutes from "./routes/spendingTypeRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import spendingSummaryRoutes from "./routes/spendingSummaryRoutes";
import moneyAveragingRoutes from "./routes/moneyAveragingRoutes";
import reminderRoutes from "./routes/presetExpenseRoutes";

import i18n from "i18n";
import path from "path";

const app = express();
app.use(express.json());

i18n.configure({
  locales: ["en", "th"],
  directory: path.join(__dirname, "locales"),
  defaultLocale: "en",
  queryParameter: "lang",
  autoReload: true,
  updateFiles: false,
  syncFiles: false,
  objectNotation: true,
});

app.use(i18n.init);

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/spending-types", spendingTypeRoutes);

app.use("/api/transactions", transactionRoutes);
app.use("/api/spending-summary", spendingSummaryRoutes);

app.use("/api/money-averaging", moneyAveragingRoutes);

app.use("/api/reminder", reminderRoutes);
app.use("/api/reminders", reminderRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});

//
