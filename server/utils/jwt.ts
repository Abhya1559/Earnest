import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

interface TokenPayload {
  id: number;
  email: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "1h", // ✅ FORCE TYPE
  });
};
