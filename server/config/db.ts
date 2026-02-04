import "reflect-metadata";
import { DataSource } from "typeorm";

import { env } from "../config/env.js";

import { User } from "../entities/User.js";
import { Task } from "../entities/Task.js";
import { RefreshToken } from "../entities/RefreshToken.js";

export const AppDataSource = new DataSource({
  type: "mysql",

  host: env.DB_HOST,
  port: env.DB_PORT,

  username: env.DB_USER,
  password: env.DB_PASSWORD,

  database: env.DB_NAME,

  synchronize: true,
  logging: false,

  entities: [User, Task, RefreshToken],
});
