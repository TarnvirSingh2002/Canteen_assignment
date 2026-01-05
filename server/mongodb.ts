import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/canteen");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // process.env.MONGODB_URI = ""; // Clear so it doesn't keep retrying with bad URI
  }
};

const snackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  referralCode: { type: String, required: true, unique: true },
  totalSpent: { type: Number, default: 0 },
});

const orderSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  snackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Snack', required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Snack = mongoose.model("Snack", snackSchema);
export const Student = mongoose.model("Student", studentSchema);
export const Order = mongoose.model("Order", orderSchema);
