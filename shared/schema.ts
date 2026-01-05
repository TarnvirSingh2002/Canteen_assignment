// import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
// import { createInsertSchema } from "drizzle-zod";
// import { z } from "zod";
// import { relations } from "drizzle-orm";

// export const snacks = pgTable("snacks", {
//   id: serial("id").primaryKey(),
//   name: text("name").notNull(),
//   price: integer("price").notNull(), // in cents
// });

// export const students = pgTable("students", {
//   id: serial("id").primaryKey(),
//   name: text("name").notNull(),
//   referralCode: text("referral_code").notNull().unique(),
//   totalSpent: integer("total_spent").default(0).notNull(),
// });

// export const orders = pgTable("orders", {
//   id: serial("id").primaryKey(),
//   studentId: integer("student_id").references(() => students.id).notNull(),
//   snackId: integer("snack_id").references(() => snacks.id).notNull(),
//   quantity: integer("quantity").notNull(),
//   amount: integer("amount").notNull(), // total cost in cents
//   createdAt: timestamp("created_at").defaultNow().notNull(),
// });

// // Relations
// export const studentsRelations = relations(students, ({ many }) => ({
//   orders: many(orders),
// }));

// export const snacksRelations = relations(snacks, ({ many }) => ({
//   orders: many(orders),
// }));

// export const ordersRelations = relations(orders, ({ one }) => ({
//   student: one(students, {
//     fields: [orders.studentId],
//     references: [students.id],
//   }),
//   snack: one(snacks, {
//     fields: [orders.snackId],
//     references: [snacks.id],
//   }),
// }));

// // Schemas
// export const insertSnackSchema = createInsertSchema(snacks).omit({ id: true });
// export const insertStudentSchema = createInsertSchema(students).omit({ id: true, totalSpent: true, referralCode: true });
// export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, amount: true });

// // Types
// export type Snack = typeof snacks.$inferSelect;
// export type InsertSnack = z.infer<typeof insertSnackSchema>;
// export type Student = typeof students.$inferSelect;
// export type InsertStudent = z.infer<typeof insertStudentSchema>;
// export type Order = typeof orders.$inferSelect;
// export type InsertOrder = z.infer<typeof insertOrderSchema>;




import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const snacks = pgTable("snacks", {
  id: varchar("id").primaryKey(), // Changed to varchar for MongoDB string IDs
  name: text("name").notNull(),
  price: integer("price").notNull(), // in cents
});

export const students = pgTable("students", {
  id: varchar("id").primaryKey(), // Changed to varchar for MongoDB string IDs
  name: text("name").notNull(),
  referralCode: text("referral_code").notNull().unique(),
  totalSpent: integer("total_spent").default(0).notNull(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey(), // Changed to varchar for MongoDB string IDs
  studentId: varchar("student_id").notNull(), // Match student id type
  snackId: varchar("snack_id").notNull(), // Match snack id type
  quantity: integer("quantity").notNull(),
  amount: integer("amount").notNull(), // total cost in cents
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const studentsRelations = relations(students, ({ many }) => ({
  orders: many(orders),
}));

export const snacksRelations = relations(snacks, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  student: one(students, {
    fields: [orders.studentId],
    references: [students.id],
  }),
  snack: one(snacks, {
    fields: [orders.snackId],
    references: [snacks.id],
  }),
}));

// Schemas
export const insertSnackSchema = createInsertSchema(snacks).omit({ id: true });
export const insertStudentSchema = createInsertSchema(students).omit({ id: true, totalSpent: true, referralCode: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, amount: true });

// Types
export type Snack = typeof snacks.$inferSelect;
export type InsertSnack = z.infer<typeof insertSnackSchema>;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
