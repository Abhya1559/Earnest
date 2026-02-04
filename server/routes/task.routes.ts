import { Router } from "express";

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleTask,
} from "../controllers/task.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔐 Protected
router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);

router.patch("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

router.patch("/:id/toggle", authMiddleware, toggleTask);

export default router;
