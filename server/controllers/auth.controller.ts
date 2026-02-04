import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { AppDataSource } from "../config/db.js";
import { User } from "../entities/User.js";
import { generateToken } from "../utils/jwt.js";

const userRepo = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ message: "all fields are required", status: 400 });
    }
    const existingUser = await userRepo.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const user = userRepo.create({
      name,
      email,
      password: hashPassword,
    });
    await userRepo.save(user);
    return res.json({
      message: "User register successfully",
      status: 200,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Server error", status: 501 });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: "All fields are required" });
    }
    const existingUser = await userRepo.findOne({ where: { email } });
    if (!existingUser) {
      return res.status(401).json({ message: "Please Register" });
    }
    const comparePassword = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!comparePassword) {
      return res.status(401).json({ message: "Credentials are missing" });
    }
    const token = generateToken({
      id: existingUser.id,
      email: existingUser.email,
    });
    return res.status(200).json({
      message: "User loggedIn successfully",
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};
