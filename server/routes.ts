import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.snacks.list.path, async (req, res) => {
    const snacks = await storage.getSnacks();
    res.json(snacks);
  });

  app.get(api.students.list.path, async (req, res) => {
    const students = await storage.getStudents();
    res.json(students);
  });

  app.get(api.students.get.path, async (req, res) => {
    const student = await storage.getStudent(String(req.params.id));
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  });

  app.post(api.students.create.path, async (req, res) => {
    try {
      const input = api.students.create.input.parse(req.body);
      const student = await storage.createStudent(input);
      res.status(201).json(student);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      // Verify snack exists implicitly via storage logic, or catch error
      try {
        const order = await storage.createOrder(input);
        res.status(201).json(order);
      } catch (e: any) {
        if (e.message === "Snack not found") {
           return res.status(404).json({ message: 'Snack not found' });
        }
        throw e;
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed data on startup
  await storage.seedSnacks();

  return httpServer;
}
