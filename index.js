import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import dbConnect from "./config/dbconfig.js";

dotenv.config();

const app = express();


app.use(express.json());
app.use(cors());


app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("API is running");
});

dbConnect();


app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});