import express from "express";
import authRoutes from "./routes/authRoutes";
import conversationRoutes from "./routes/conversationRoutes";
import messagesRoutes from "./routes/messagesRoutes";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/conversation", conversationRoutes);
app.use("/messages", messagesRoutes);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
