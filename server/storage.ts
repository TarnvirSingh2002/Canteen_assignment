import { Snack, Student, Order, connectDB } from "./mongodb";
import { randomBytes } from "crypto";

export interface IStorage {
  getSnacks(): Promise<any[]>;
  getStudents(): Promise<any[]>;
  getStudent(id: string): Promise<any>;
  createStudent(student: any): Promise<any>;
  createOrder(order: any): Promise<any>;
  seedSnacks(): Promise<void>;
}

export class MongoStorage implements IStorage {
  constructor() {
    connectDB();
  }

  async getSnacks(): Promise<any[]> {
    return await Snack.find({});
  }

  async getStudents(): Promise<any[]> {
    return await Student.find({});
  }

  async getStudent(id: string): Promise<any> {
    const student = await Student.findById(id).lean();
    if (!student) return undefined;
    const orders = await Order.find({ studentId: id }).populate('snackId').lean();
    return { ...student, orders: orders.map(o => ({ ...o, snack: o.snackId })) };
  }

  async createStudent(insertStudent: any): Promise<any> {
    const referralCode = `REF-${randomBytes(4).toString("hex").toUpperCase()}`;
    const student = new Student({ ...insertStudent, referralCode });
    return await student.save();
  }

  async createOrder(insertOrder: any): Promise<any> {
    const snack = await Snack.findById(insertOrder.snackId);
    if (!snack) throw new Error("Snack not found");

    const amount = snack.price * insertOrder.quantity;
    const order = new Order({ ...insertOrder, amount });
    await order.save();

    await Student.findByIdAndUpdate(insertOrder.studentId, {
      $inc: { totalSpent: amount }
    });

    return order;
  }

  async seedSnacks(): Promise<void> {
    const count = await Snack.countDocuments();
    if (count === 0) {
      await Snack.insertMany([
        { name: "Potato Chips", price: 150 },
        { name: "Soda Can", price: 200 },
        { name: "Chocolate Bar", price: 125 },
        { name: "Apple", price: 50 },
        { name: "Chicken Sandwich", price: 450 },
      ]);
    }
  }
}

export const storage = new MongoStorage();
