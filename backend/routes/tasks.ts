import express, { Request, Response } from "express";
import { PrismaClient, PriorityOrder } from "@prisma/client";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Get all tasks for a user
router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: req.user?.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// Create a new task
router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, description, deadline, priority } = req.body;
    
    // Convert string priority to enum
    const priorityEnum = priority.toUpperCase() as keyof typeof PriorityOrder;
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        priority: PriorityOrder[priorityEnum],
        userId: req.user?.id
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
});

// Update a task
router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, deadline, priority, completed } = req.body;
    
    // Convert string priority to enum if provided
    const priorityEnum = priority ? 
      priority.toUpperCase() as keyof typeof PriorityOrder : 
      undefined;
    
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        priority: priorityEnum ? PriorityOrder[priorityEnum] : undefined,
        completed
      }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// Delete a task
router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id }
    });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

export default router; 