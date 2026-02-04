import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { AppDataSource } from "../config/db.js";
import { User } from "../entities/User.js";
import { generateToken, generateRefreshToken } from "../utils/jwt.js";
import { RefreshToken } from "../entities/RefreshToken.js";
import { env } from "process";
import jwt from "jsonwebtoken";
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
    const refreshToken = generateRefreshToken({
      id: existingUser.id,
      email: existingUser.email,
    });

    const tokenRepo = AppDataSource.getRepository(RefreshToken);
    await tokenRepo.delete({
      user: { id: existingUser.id },
    });
    const tokenEntity = tokenRepo.create({
      token: refreshToken,
      user: existingUser,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await tokenRepo.save(tokenEntity);
    return res.status(200).json({
      message: "User loggedIn successfully",
      token,
      refreshToken,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      refreshToken,
      env.REFRESH_SECRET as string,
    ) as any;

    const tokenRepo = AppDataSource.getRepository(RefreshToken);

    // Check in DB
    const savedToken = await tokenRepo.findOne({
      where: { token: refreshToken },
      relations: ["user"],
    });

    if (!savedToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    // Generate new access token
    const newAccessToken = generateToken({
      id: decoded.id,
      email: decoded.email,
    });

    return res.json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token required",
      });
    }

    const tokenRepo = AppDataSource.getRepository(RefreshToken);

    await tokenRepo.delete({ token: refreshToken });

    return res.json({
      message: "Logged out successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};
