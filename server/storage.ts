import { db } from "./db";
import {
  snacks,
  students,
  orders,
  type InsertStudent,
  type InsertOrder,
  type Student,
  type Snack,
  type Order,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { randomBytes } from "crypto";

export interface IStorage {
  getSnacks(): Promise<Snack[]>;
  getStudents(): Promise<Student[]>;
  getStudent(id: number): Promise<(Student & { orders: (Order & { snack: Snack })[] }) | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  createOrder(order: InsertOrder): Promise<Order>;
  seedSnacks(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getSnacks(): Promise<Snack[]> {
    return await db.select().from(snacks);
  }

  async getStudents(): Promise<Student[]> {
    return await db.select().from(students);
  }

  async getStudent(id: number): Promise<(Student & { orders: (Order & { snack: Snack })[] }) | undefined> {
    const student = await db.query.students.findFirst({
      where: eq(students.id, id),
      with: {
        orders: {
          with: { snack: true },
          orderBy: [desc(orders.createdAt)],
        },
      },
    });
    return student;
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    // Generate a simple referral code
    const referralCode = `REF-${randomBytes(4).toString("hex").toUpperCase()}`;
    const [student] = await db
      .insert(students)
      .values({ ...insertStudent, referralCode })
      .returning();
    return student;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    // 1. Get the snack to calculate amount
    const [snack] = await db.select().from(snacks).where(eq(snacks.id, insertOrder.snackId));
    if (!snack) throw new Error("Snack not found");

    const amount = snack.price * insertOrder.quantity;

    // 2. Create order
    const [order] = await db
      .insert(orders)
      .values({
        ...insertOrder,
        amount,
      })
      .returning();

    // 3. Update student total spent
    const [student] = await db.select().from(students).where(eq(students.id, insertOrder.studentId));
    if (student) {
      await db
        .update(students)
        .set({ totalSpent: (student.totalSpent || 0) + amount })
        .where(eq(students.id, insertOrder.studentId));
    }

    return order;
  }

  async seedSnacks(): Promise<void> {
    const existing = await this.getSnacks();
    if (existing.length === 0) {
      await db.insert(snacks).values([
        { name: "Potato Chips", price: 150 },
        { name: "Soda Can", price: 200 },
        { name: "Chocolate Bar", price: 125 },
        { name: "Apple", price: 50 },
        { name: "Chicken Sandwich", price: 450 },
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
