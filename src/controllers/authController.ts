import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { SECRET_KEY } from "../config/env";

const users: { [key: string]: string } = {}; // Simple in-memory user storage

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (users[username]) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users[username] = hashedPassword;
  res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const hashedPassword = users[username];

  if (!hashedPassword || !(await bcrypt.compare(password, hashedPassword))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Create a session or token here, but keep it simple for now
  res.status(200).json({ message: "Login successful" });
};
