import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import cors from "cors";
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
const start = async () => {
  try {
    await AppDataSource.initialize();
    console.log("DB Connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("DB Error ❌", err);
  }
};

start();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
