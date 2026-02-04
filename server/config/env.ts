import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_PORT: number;
  JWT_EXPIRES_IN: string;
  JWT_SECRET: string;
  REFRESH_SECRET: string;
}

function getEnv(): EnvConfig {
  const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT,

    JWT_SECRET,
    REFRESH_SECRET,
    JWT_EXPIRES_IN,
  } = process.env;

  if (
    !DB_HOST ||
    !DB_USER ||
    !DB_PASSWORD ||
    !DB_NAME ||
    !DB_PORT ||
    !JWT_SECRET ||
    !REFRESH_SECRET ||
    !JWT_EXPIRES_IN
  ) {
    throw new Error("Missing ENV variables");
  }

  return {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT: Number(DB_PORT),

    JWT_SECRET,
    REFRESH_SECRET,
    JWT_EXPIRES_IN,
  };
}

export const env = getEnv();
