import express, { Request, Response } from "express";
import { log } from "node:console";
import authRoutes from "./routes/authRoutes";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
