// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// connect DB
connectDB();

// middlewares
app.use(cors());
app.use(express.json()); // parse JSON body

// routes
app.use("/auth", authRoutes); // /auth/register, /auth/login, /auth/me

app.get("/", (req, res) => {
  res.send("JWT Auth API is running...");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
