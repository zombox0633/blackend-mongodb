import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/mongodb';
import connectCloudinary from './config/conenctCloudinary';

dotenv.config();
const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

connectDB()
connectCloudinary()

const allowedOrigins = [
  "https://artnakkk-frontend-admin.vercel.app",
  "http://localhost:5175", // For local development
  "http://localhost:5176", // For local development
];

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the origin
      } else {
        callback(new Error("Not allowed by CORS")); // Block the origin
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies or Authorization headers
  })
);

app.get("/", (req, res) => {
  res.send("API Working")
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
