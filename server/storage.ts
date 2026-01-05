// import { Snack, Student, Order, connectDB } from "./mongodb";
// import { randomBytes } from "crypto";

// export interface IStorage {
//   getSnacks(): Promise<any[]>;
//   getStudents(): Promise<any[]>;
//   getStudent(id: string): Promise<any>;
//   createStudent(student: any): Promise<any>;
//   createOrder(order: any): Promise<any>;
//   seedSnacks(): Promise<void>;
// }

// export class MongoStorage implements IStorage {
//   constructor() {
//     connectDB();
//   }

//   async getSnacks(): Promise<any[]> {
//     return await Snack.find({});
//   }

//   async getStudents(): Promise<any[]> {
//     return await Student.find({});
//   }

//   async getStudent(id: string): Promise<any> {
//     const student = await Student.findById(id).lean();
//     if (!student) return undefined;
//     const orders = await Order.find({ studentId: id }).populate('snackId').lean();
//     return { ...student, orders: orders.map(o => ({ ...o, snack: o.snackId })) };
//   }

//   async createStudent(insertStudent: any): Promise<any> {
//     const referralCode = `REF-${randomBytes(4).toString("hex").toUpperCase()}`;
//     const student = new Student({ ...insertStudent, referralCode });
//     return await student.save();
//   }

//   async createOrder(insertOrder: any): Promise<any> {
//     const snack = await Snack.findById(insertOrder.snackId);
//     if (!snack) throw new Error("Snack not found");

//     const amount = snack.price * insertOrder.quantity;
//     const order = new Order({ ...insertOrder, amount });
//     await order.save();

//     await Student.findByIdAndUpdate(insertOrder.studentId, {
//       $inc: { totalSpent: amount }
//     });

//     return order;
//   }

//   async seedSnacks(): Promise<void> {
//     const count = await Snack.countDocuments();
//     if (count === 0) {
//       await Snack.insertMany([
//         { name: "Potato Chips", price: 150 },
//         { name: "Soda Can", price: 200 },
//         { name: "Chocolate Bar", price: 125 },
//         { name: "Apple", price: 50 },
//         { name: "Chicken Sandwich", price: 450 },
//       ]);
//     }
//   }
// }

// export const storage = new MongoStorage();





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

  private transform(doc: any) {
    if (!doc) return doc;
    const obj = doc.toObject ? doc.toObject() : { ...doc };
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
    return obj;
  }

  async getSnacks(): Promise<any[]> {
    const snacks = await Snack.find({});
    return snacks.map(this.transform);
  }

  async getStudents(): Promise<any[]> {
    const students = await Student.find({});
    return students.map(this.transform);
  }

  async getStudent(id: string): Promise<any> {
    const studentDoc = await Student.findById(id);
    if (!studentDoc) return undefined;
    
    const student = this.transform(studentDoc);
    const orderDocs = await Order.find({ studentId: id }).populate('snackId');
    
    student.orders = orderDocs.map(o => {
      const order = this.transform(o);
      order.snack = this.transform(o.snackId);
      delete order.snackId;
      return order;
    });
    
    return student;
  }

  async createStudent(insertStudent: any): Promise<any> {
    const referralCode = `REF-${randomBytes(4).toString("hex").toUpperCase()}`;
    const student = new Student({ ...insertStudent, referralCode });
    const saved = await student.save();
    return this.transform(saved);
  }

  async createOrder(insertOrder: any): Promise<any> {
    const snack = await Snack.findById(insertOrder.snackId);
    if (!snack) throw new Error("Snack not found");

    const amount = snack.price * insertOrder.quantity;
    const order = new Order({ ...insertOrder, amount });
    const saved = await order.save();

    await Student.findByIdAndUpdate(insertOrder.studentId, {
      $inc: { totalSpent: amount }
    });

    return this.transform(saved);
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
