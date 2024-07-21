import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3133;

app.use(cors());
//MongoDB connection
const ReClick = async () => {
  try {
    await mongoose.connect(process.env.ReClick_MONGODB_URL);
    console.log("Connect to MongoDB successfully");
  } catch (error) {
    console.log("Connection failed");
  }
};
ReClick();
//ReClick Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Running ReClick Server");
});
app.listen(PORT, (error) => {
  if (error) {
    console.log("Failed to connect server");
  } else {
    console.log(`Server started and Server running on ${PORT}`);
  }
});
