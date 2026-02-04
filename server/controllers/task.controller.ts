import { Response } from "express";

import { AppDataSource } from "../config/db.js";
import { Task, TaskStatus } from "../entities/Task.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { User } from "../entities/User.js";

const taskRepo = AppDataSource.getRepository(Task);
const userRepo = AppDataSource.getRepository(User);

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }
    const user = await userRepo.findOne({
      where: { id: userId },
    });
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const task = taskRepo.create({
      title,
      description,
      user,
    });
    await taskRepo.save(task);
    return res.status(201).json({
      message: "Task created",
      task,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const tasks = await taskRepo.find({
      where: {
        user: { id: userId },
      },
      order: {
        createdAt: "DESC",
      },
    });
    return res.json({
      tasks,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const userId = req.user?.id;

    const task = await taskRepo.findOne({
      where: {
        id: Number(id),
        user: { id: userId },
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    task.title = title ?? task.title;
    task.description = description ?? task.description;

    await taskRepo.save(task);

    return res.json({
      message: "Task updated",
      task,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const task = await taskRepo.findOne({
      where: {
        id: Number(id),
        user: { id: userId },
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await taskRepo.remove(task);

    return res.json({
      message: "Task deleted",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
export const toggleTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const task = await taskRepo.findOne({
      where: {
        id: Number(id),
        user: { id: userId },
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.status =
      task.status === TaskStatus.PENDING
        ? TaskStatus.COMPLETED
        : TaskStatus.PENDING;

    await taskRepo.save(task);

    return res.json({
      message: "Status updated",
      task,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
