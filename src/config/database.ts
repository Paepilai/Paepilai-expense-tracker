import { MongoClient } from "mongodb";
import { MONGO_URI } from "./env";

const client = new MongoClient(MONGO_URI);

export const connectDB = async () => {
  try {
    await client.connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export const db = client.db();
